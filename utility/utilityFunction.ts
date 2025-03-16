import jwt from 'jsonwebtoken';
import fs from 'fs';

function standardOffset(date: Date): number {
    const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul);
}

function isDst(date: Date): boolean {
    return date.getTimezoneOffset() < standardOffset(date);
}

const utilityController = {

    getUuidFromToken: (token: string): string => {
        const uuid: unknown = jwt.verify(token, fs.readFileSync("./certificates/JWT/public_key.pem"), (err: any, data: any) => {
            if (err) return false; // Forbidden
            return data.id
        });
        console.log(uuid)
        return uuid as string
    },

    ticketLevelToText: (level: number): string => {
        const levels: any = {
            1: "Basique",
            2: "Premium",
            3: "Sponsor",
            4: "Artiste",
            5: "Invité",
            6: "Staff"
        };

        return levels[level];
    },

    formatNumber: (number: number): string => {
        return (`${number}`).split('').reverse().join('').match(/.{1,3}/g)!.join(',').split('').reverse().join('');
    },

    random: (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    dateToTimestamp: (dateStr: string): number => {
        const [day, month, year] = dateStr.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        return date.getTime();
    },

    timestampToDate: (timestamp: number | Date, date: boolean, hours: boolean): string => {

        const fullDate = (timestamp instanceof Date ? timestamp : new Date(timestamp));

        const day = fullDate.getDate().toString().padStart(2, '0');
        const month = (fullDate.getMonth() + 1).toString().padStart(2, '0');;
        const year = fullDate.getFullYear();

        const hour = utilityController.changeHourFormat(fullDate.getHours()).toString().padStart(2, '0');
        const minute = fullDate.getMinutes().toString().padStart(2, '0');
        const second = fullDate.getSeconds().toString().padStart(2, '0');

        return ((date ? `${day}/${month}/${year}` : "") + ((date && hours) ? " | " : "") + (hours ? `${hour}:${minute}:${second}` : ""));
    },

    changeHourFormat(hour: number): number {
        const today = new Date();

        if (isDst(today)) return hour;
        return hour + 1;
    },

    isValidDateFormat: (dateStr: string): boolean => {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

        return dateRegex.test(dateStr);
    }
};

export default utilityController;