import { IExecutorContainer } from './core/interfaces/IExecutorContainer';
import { AppSettingsCollector } from './core/settings/AppSettingsCollector';
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
 *
 * watch  <id item>  --autocommit all
 *
 */

/**
 * Start point for app
 * Module purposes:
 * 1) collect startup variables and configuration accordingly environment
 * 2) initiate execution accordingly startup variables and pass configuration
 */
class Application {
    static main(): void {
        log4js.configure('config/log4js.json');
        const container =  myContainer.get<IExecutorContainer>(TYPES.IExecutorContainer);
        (new Application(container)).start();
    }

    constructor (private _executorContainer: IExecutorContainer ) {}

    start() {
        const props = AppSettingsCollector.collectSettings();
        this._executorContainer.getExecutors(props).forEach(it => it.executor.execute(it.config) )
    };

};

;

Application.main();
