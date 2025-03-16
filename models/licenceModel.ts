import { LicenceStatus } from './ticketEnum';

export default class Licence {
    licenceKey: String;
    productID: Number;
    companyID: Number;
    start: Date;
    end: Date;
    duration: Date;
    status: LicenceStatus;
    userContact: String;

    constructor(
        licenceKey: String,
        productID: Number,
        companyID: Number,
        start: Date,
        end: Date, // Calculer la "end" en fonction du champ "duration", la durée de la licence, on met pas de "end" tant que licence pas activée
        duration: Date,
        status: LicenceStatus,
        userContact: String
    ) {
        this.licenceKey = licenceKey,
        this.productID = productID,
        this.companyID = companyID,
        this.start = start,
        this.end = end,
        this.duration = duration,
        this.status = status,
        this.userContact = userContact
    }

    toJSON(): any {
        return {
            licenceKey: this.licenceKey,
            productID: this.productID,
            companyID: this.companyID,
            start: this.start.toISOString(),
            end: this.end.toISOString(),
            duration: this.duration.toISOString(),
            status: this.status,
            userContact: this.userContact
        };
    }
}