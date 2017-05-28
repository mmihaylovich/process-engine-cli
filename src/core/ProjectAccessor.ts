import { Observable } from 'rxjs/Rx';
import { Corezoid } from '../corezoid/corezoid';

export class ProjectAccessor {

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
                // corezoid.getFolders2().subscribe( (s: any) => console.log(`next => ${JSON.stringify(s)}`));
                 corezoid.getBody(232968, 'conv').subscribe((s: any) => console.log(`next => ${JSON.stringify(s)}`));

            },
            (error) => { console.error(error) }
        )
    }

}
