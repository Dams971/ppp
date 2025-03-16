
export default class Product {
    name: String;
    creationDate: Date;
    baseKey: String;

    constructor(
        name: String,
        creationDate: Date,
        baseKey: String
    ) {
        this.name = name;
        this.creationDate = creationDate;
        this.baseKey = baseKey;
    };

    toJSON(): any {
        return {
            name: this.name,
            creationDate: this.creationDate,
            baseKey: this.baseKey
        };
    };
}