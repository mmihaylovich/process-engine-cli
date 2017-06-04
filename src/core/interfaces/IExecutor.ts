export interface IExecutor {
    execute(params: Object): void;
}
export interface IExecutionContext {executor: IExecutor; config: any };
