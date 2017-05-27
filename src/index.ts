import { IExecutorContainer } from './core/interfaces/IExecutorContainer';
import { inject, injectable } from 'inversify';
import { TYPES } from './core/di/types';
import 'reflect-metadata';
import {myContainer} from './core/di/inversify.config';
import * as log4js from 'log4js';

/**
 * Функционал тулинга:
 * 1) по хуку или интервалу инициировать перечитку проекта.
 * 2) проект экспортировать в оригинальном виде, после чего:
 *      - приводить к читаемому виду
 *      - формировать папку для каждого процесса
 *      - в папку сохранять для одного процесса - 2 файла:
 *          1 с парамтерами представления, 2 с параметрами логики
 *          в обоих случаях пересортировывать объкты в определенном порядке.
 *      - экспортировать элементы кода в отдельные файлы, проставлять ссылку
 *  3) обратная сборка проекта
 *  4) построение зависимостей между процессами - построение диаграммы зависимостей
 *  5) авторасстановка, возможная замена на прямые
 *  6) проверка качества кода
 *  7) деплой с проекта API
 */
class Application {
    static main(): void {
        const container =  myContainer.get<IExecutorContainer>(TYPES.IExecutorContainer);
        (new Application(container)).start();
    }

    constructor (private _executors: IExecutorContainer ) {}

    start() {
        const dotenv = require('dotenv');
        const c = dotenv.config();
        log4js.configure('config/log4js.json');
        this._executors.getExecutors().forEach(it => it.execute({}) )
    };

};

;

Application.main();
