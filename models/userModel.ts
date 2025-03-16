import { UserStatus } from './userEnum';

export default class User {
    email: String;
    name: String;
    password: String;
    companyID: Number;
    phone: String;
    role: UserStatus;

    constructor(
        email: String,
        name: String,
        password: String,
        companyID: Number,
        phone: String,
        role: UserStatus
    ) {
        this.companyID = companyID;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
    }

    toJSON(): any {
        return {
            email: this.email,
            name: this.name,
            password: this.password,
            companyID: this.companyID,
            phone: this.phone,
            role: this.role
        };
    }
}