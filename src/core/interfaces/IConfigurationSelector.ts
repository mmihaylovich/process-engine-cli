interface IConfigurationSelector {
    getConfigurationSelector(): string;
    getCommand(): string;
}

class AbstractConfigurationSelector implements IConfigurationSelector {
    getCommand(): string {
        throw new Error('Method not implemented.');
    }
    getConfigurationSelector(): string {
        throw new Error('Method not implemented.');
    }
}

export {IConfigurationSelector, AbstractConfigurationSelector};
