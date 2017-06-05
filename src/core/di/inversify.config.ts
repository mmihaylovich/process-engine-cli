import { IExecutorContainer } from './../interfaces/IExecutorContainer';
import { IExecutor } from './../interfaces/IExecutor';
import { Container } from 'inversify';
import {TYPES} from './types';
import {ReadProjectExecutor} from '../ReadProjectExecutor'
import { ExecutorContainer } from '../ExecutorContainer';
import { InitProjectExecutor } from '../InitProjectExecutor';


const myContainer = new Container();
myContainer.bind<IExecutor>(TYPES.IExecutor).to(ReadProjectExecutor);
myContainer.bind<IExecutor>(TYPES.IExecutor).to(InitProjectExecutor);
myContainer.bind<IExecutorContainer>(TYPES.IExecutorContainer).to(ExecutorContainer);

export { myContainer };
