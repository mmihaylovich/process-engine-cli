import { IExecutorContainer } from './interfaces/IExecutorContainer';
import { IExecutionContext,IExecutor } from './interfaces/IExecutor';
import { multiInject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigurationSelector, AbstractConfigurationSelector } from "./interfaces/IConfigurationSelector";

@injectable()
export class ExecutorContainer implements IExecutorContainer {
    private _executors: IExecutor[]

    constructor( @multiInject('IExecutor') executors: IExecutor[]) {
        this._executors = executors;
    }

    getAllExecutors (): IExecutor[] {
        return this._executors;
    }

    getExecutors(config: any): Array<IExecutionContext> {
        const result: Array<IExecutionContext> = [];
        this._executors.forEach( it => {
            if (it instanceof AbstractConfigurationSelector) {
                const configSelector = (<IConfigurationSelector>it).getConfigurationSelector();
                const command = (<IConfigurationSelector>it).getCommand();
                if ( config.exec.command === command ) {
                    result.push({executor: it, config: config[configSelector] })
                }
            }
        });
        return result;
    }

}
