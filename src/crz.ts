import { IExecutorContainer } from './core/interfaces/IExecutorContainer';
import { AppSettingsCollector } from './core/settings/AppSettingsCollector';
import { inject, injectable } from 'inversify';
import { TYPES } from './core/di/types';
import 'reflect-metadata';
import { myContainer } from './core/di/inversify.config';
import * as log4js from 'log4js';
import * as fs from 'fs-extra';

/**
 * Start point for app
 * Module purposes:
 * 1) collect startup variables and configuration accordingly environment
 * 2) initiate execution accordingly startup variables and pass configuration
 */
class Application {

    private static configureLogger() {
        if (fs.existsSync('log4js.json')) {
            log4js.configure('log4js.json');
        } else {
            log4js.configure({
                'appenders': [{
                    'type': 'file',
                    'filename': 'logs/process_engine.log',
                    'backups': 3,
                    'level': 'DEBUG'
                }]
            });
        }
    }

    static main(): void {
        Application.configureLogger();
        const container = myContainer.get<IExecutorContainer>(TYPES.IExecutorContainer);
        (new Application(container)).start();
    }

    constructor(private _executorContainer: IExecutorContainer) { }

    start() {
        const props = AppSettingsCollector.collectSettings();
        this._executorContainer.getExecutors(props).forEach(it => it.executor.execute(it.config))
    };

};

;

Application.main();
