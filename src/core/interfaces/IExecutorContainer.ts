import { IExecutor } from './IExecutor';

export interface IExecutorContainer {
    getExecutors(): Array<IExecutor>
}
