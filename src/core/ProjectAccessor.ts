import { Observable } from 'rxjs/Rx';
import { Corezoid } from '../corezoid/corezoid';

export class ProjectAccessor {

    constructor (obs: Observable <Object>) {
        obs.subscribe(
            (value) => {
                const corezoid = new Corezoid();
                corezoid.getFolders().subscribe(
                    (resp) => console.log(resp),
                    (err) => console.error(err)
                )
            },
            (error) => {console.error(error)}
        )
    }

}
