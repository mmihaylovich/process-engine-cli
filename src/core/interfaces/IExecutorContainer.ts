import {IExecutionContext, IExecutor } from './IExecutor';

export interface IExecutorContainer {
    getExecutors(config: any): Array<IExecutionContext>
}
