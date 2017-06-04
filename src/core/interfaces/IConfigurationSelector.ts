interface IConfigurationSelector {
    getConfigurationSelector(): string;
    getCommand(): string;
}

class AbstractConfigurationSelector implements IConfigurationSelector {
    getCommand(): never {
        throw new Error('Method not implemented.');
    }
    getConfigurationSelector(): never {
        throw new Error('Method not implemented.');
    }
}

export {IConfigurationSelector, AbstractConfigurationSelector};
