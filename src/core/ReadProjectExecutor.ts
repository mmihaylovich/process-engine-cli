import 'reflect-metadata';

import { injectable } from 'inversify';
import { ProjectAccessor } from './ProjectAccessor';
import { IExecutor } from './interfaces/IExecutor';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import * as config from 'config';
import * as fs from 'fs-extra';
import {cloneDeep} from 'lodash';

@injectable()
class ReadProjectExecutor implements IExecutor {
    private _watchObj: any

    execute(params: Object): void {
        const that = this;
        const prj: ProjectAccessor = new ProjectAccessor()
        this._watchObj = config.get<any>('corezoid.watch');
        const source = Observable
            .interval(this._watchObj.refresh_interval * 1000)
            .timeInterval();
        prj.collect(source, that._loadedData, that);
    }

    private _loadedData(objs: Array<any>, owner: any) {
        const that = owner;
        // по получаемым примерам предположим что объекты в схеме уже отсортированы
        // топологической сорировкой в обратном порядке. Если в ходе эксплуатации выянится, что
        // это не всегда правда - нужно будет ее выполнить.
        that._clearFodler();
        // Будем качать сразу папку, а не поэлементно. Соответственно в массиве будет только один объект
        that._extractData.bind(that)(objs[0]);

    }

    private _clearFodler(): void {

    }

    private _extractData(obj: any): void {
        const json = JSON.stringify(obj.ops[0].scheme);
        const hjson = JSON.stringify(obj.ops[0].scheme, null, 4);
        const folders = new Map<number, string>();
        // console.log('loaded data:' + json);
        const folder = config.get<string>('corezoid.workspace');

        const items = fs.readdirSync(folder)
        console.log(items);
            for (let i = 0; i < items.length; i++) {
                if (!(<string>items[i]).startsWith('.git')) {
                    fs.removeSync(folder + items[i])
                }
            }
        if (folder) {
             fs.writeFileSync(`${folder}${this._watchObj.object_id}.raw.json`, json);
             fs.writeFileSync(`${folder}${this._watchObj.object_id}.human.json`, hjson);
        }
        obj.ops[0].scheme.reverse().forEach( (it: any) => {
            let subfolder: string = folders.get(it.parent_id)
            if (subfolder) {
                subfolder += '/';
            } else {
                subfolder = folder;
            }
            //  folder
            if (it.obj_type === 0) {
                const newDir = `${subfolder}${this._getItemName(it)}`;
                folders.set(it.obj_id , newDir);
                fs.mkdirSync(newDir);
            } else {
                this._divideOneFile(it, subfolder);
            }
            // console.log(`${it.parent_id} - ${it.obj_id}`)
        });
    }

    private _divideOneFile(it: any, folder: string): void {
        if (it.obj_type === 1 && it.scheme && it.scheme.nodes) {
            // пересортируем
            it.scheme.nodes.sort((a: any, b: any) => {
                 if (a.id < b.id) { return -1; }
                 if (a.id > b.id) { return 1; }
                 return 0;
             });
        }

        let newFile = `${folder}${this._getItemName(it)}.human.json`;
        fs.writeFileSync(newFile, JSON.stringify([it], null, 4));

        const viewObject: any = cloneDeep(it);

        const scripts: Array<any> = [];
        // в этом экземпляре уберем элементы связанные со view
        if (it.scheme  && it.scheme.nodes ){
            it.scheme.nodes.forEach( (n: any) => {
                delete n.x;
                delete n.y;
                delete n.extra;
                if (n.condition && n.condition.logics) {
                    n.condition.logics.forEach( (el: any) => {
                        if (el.type === 'api_code' && el.lang === 'js') {
                            const src = el.src;
                            scripts.push({src: src, id: n.id});
                            el.src = '//extracted to separate file';
                        }
                    });
                }
            });
        }

        if (viewObject.scheme && viewObject.scheme.nodes) {
            viewObject.scheme.nodes.forEach( (n: any) => {
                for (const property in n) {
                    if (n.hasOwnProperty(property) && !(['x', 'y' , 'extra', 'id'].includes(property))) {
                            delete n[property];
                    }
                }
            });
        }

        if (scripts.length > 0) {
            const assetsDir = folder + this._getItemName(it) + '.assests';
            fs.mkdirSync(assetsDir);
            scripts.forEach( (src: any) => {
                fs.writeFileSync(`${assetsDir}/${src.id}.js`, src.src);
            })
        }
        // сохраним view
        newFile = `${folder}${this._getItemName(it)}.view.json`;
        fs.writeFileSync(newFile, JSON.stringify([viewObject], null, 4));
        // сохраним логику
        newFile = `${folder}${this._getItemName(it)}.logic.json`;
        fs.writeFileSync(newFile, JSON.stringify([it], null, 4));
    }

    private _getItemName(it: any): string {
        return `${it.obj_id}-${it.title}`.replace(/[|&;$%@"<>()+,]/g, '-');
    }

}


export { ReadProjectExecutor }
