class Tools {
    static coalesce(...values: any[]): any {
        for (const item of values) {
            let checkValue = item;
            if (Tools.isFunction(item)) {
                checkValue = item();
            }
            if ( checkValue !== null && checkValue !== undefined) {
                return item
            }
        }
        return undefined;
    }

    static isFunction(functionToCheck: any): boolean {
        const getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
}


export {Tools}
