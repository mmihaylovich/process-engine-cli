import { IExecutorContainer } from './interfaces/IExecutorContainer';
import { IExecutor } from './interfaces/IExecutor';
import { multiInject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class ExecutorContainer implements IExecutorContainer {
    private _executors: IExecutor[]

    constructor( @multiInject('IExecutor') executors: IExecutor[]) {
        this._executors = executors;
    }
    getExecutors (): IExecutor[] {
        return this._executors;
    }

}
