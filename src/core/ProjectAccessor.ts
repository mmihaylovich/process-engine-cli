import { Observable } from 'rxjs/Rx';
import { Corezoid } from '../corezoid/corezoid';
import * as log4js from 'log4js';

export class ProjectAccessor {
    private static logger = log4js.getLogger();

    constructor(obs: Observable<Object>) {
        // obs.subscribe(
        //     (value) => {
        //         const corezoid = new Corezoid();
        //         corezoid.getFolders().subscribe(
        //             (resp) => console.log(resp),
        //             (err) => console.error(err)
        //         )
        //     },
        //     (error) => {console.error(error)}
        // )
        obs.subscribe(
            (value) => {
                const corezoid = new Corezoid();
                corezoid.getFolders2().subscribe( (s: any) => {
                        console.log(`next => ${JSON.stringify(s)}`);
                        ProjectAccessor.logger.info(JSON.stringify(s));
                    }
                );
                //  corezoid.getBody(232968, 'conv').subscribe((s: any) => console.log(`next => ${JSON.stringify(s)}`));

            },
            (error) => { console.error(error) }
        )
    }

}
