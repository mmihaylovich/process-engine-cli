import 'reflect-metadata';

import { injectable } from 'inversify';
import { ProjectAccessor } from './ProjectAccessor';
import { IExecutor } from './interfaces/IExecutor';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import * as fs from 'fs-extra';
import { cloneDeep } from 'lodash';
import { CorezoidWatchSettings } from '../entity/CorezoidWatchSettings';
import { IConfigurationSelector } from './interfaces/IConfigurationSelector';

const topsort = require('topsort');


@injectable()
class ReadProjectExecutor implements IExecutor, IConfigurationSelector {

    private _params: CorezoidWatchSettings;
    private _view_params = ['x', 'y', 'extra'];
    private _identity_params = ['id', 'title'];


    getConfigurationSelector(): string {
        return 'corezoidWatchSettings';
    }
    getCommand(): string {
        return 'watch';
    }

    execute(params: CorezoidWatchSettings): void {
        if (!(params instanceof CorezoidWatchSettings)) { return };

        const that = this;
        this._params = params;
        const prj: ProjectAccessor = new ProjectAccessor(this._params.api, this._params.process);

        const source = Observable
            .interval(this._params.interval * 1000)
            .startWith(0)
            .timeInterval();

        prj.collect(source, that._loadedData, that);
    }

    private _loadedData(objs: Array<any>, owner: any) {
        const meth = owner._loadedDataOwned.bind(owner);
        meth(objs);
    }

    private _loadedDataOwned(objs: Array<any>) {
        const that = this;
        console.log(`Received ${new Date()}`);
        try {
            that._clearFodler();
            // Будем качать сразу папку, а не поэлементно. Соответственно в массиве будет только один объект
            that._extractData(objs[0]);
        } catch (err) {
            console.log(`Error occured during store data ${err.message}`);
        }
    }

    private _clearFodler(): void {
        const folder = this._params.workdir;
        const items = fs.readdirSync(folder)
        for (let i = 0; i < items.length; i++) {
            if (!(<string>items[i]).startsWith('.git')) {
                fs.removeSync(folder + items[i])
            }
        }
    }

    private _extractData(obj: any): void {
        const json = JSON.stringify(obj.ops[0].scheme);
        const hjson = JSON.stringify(obj.ops[0].scheme, null, 4);
        const folders = new Map<number, string>();

        const folder = this._params.workdir;
        // extract clear exported data and exported data after beautify
        if (folder) {
            fs.writeFileSync(`${folder}${this._params.process.id}.raw.json`, json);
            fs.writeFileSync(`${folder}${this._params.process.id}.human.json`, hjson);
        }
        // before export we should sort it topologicaly (accordignly dependencies)
        const index: Map<number, any> = new Map<number, any>();
        const edges = obj.ops[0].scheme.map(
            (el: any) => {
                index.set(el.obj_id, el);
                return [el.parent_id, el.obj_id]
            }
        );

        const sorted = topsort(edges);

        sorted.forEach((el: number) => {
            const it = cloneDeep(index.get(el));
            if (it) {
                let subfolder: string = folders.get(it.parent_id)
                if (subfolder) {
                    subfolder += '/';
                } else {
                    subfolder = folder;
                }
                //  folder
                if (it.obj_type === 0) {
                    const newDir = `${subfolder}${this._getItemName(it)}`;
                    folders.set(it.obj_id, newDir);
                    fs.mkdirSync(newDir);
                } else {
                    this._divideOneFile(it, subfolder);
                }
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
        if (it.scheme && it.scheme.nodes) {
            it.scheme.nodes.forEach((n: any) => {
                this._view_params.forEach(element => {
                    delete n[element];
                });

                if (n.condition && n.condition.logics) {
                    n.condition.logics.forEach((el: any) => {
                        if (el.type === 'api_code' && el.lang === 'js') {
                            const src = el.src;
                            scripts.push({ src: src, id: n.id });
                            el.src = '//extracted to separate file';
                        }
                    });
                }
            });
        }

        if (viewObject.scheme && viewObject.scheme.nodes) {
            viewObject.scheme.nodes.forEach((n: any) => {
                for (const property in n) {
                    if (n.hasOwnProperty(property) &&
                        !(this._view_params.concat(this._identity_params).includes(property))) {
                        delete n[property];
                    }
                }
            });
        }

        if (scripts.length > 0) {
            const assetsDir = folder + this._getItemName(it) + '.assests';
            fs.mkdirSync(assetsDir);
            scripts.forEach((src: any) => {
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
