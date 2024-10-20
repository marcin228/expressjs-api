"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers = {
    prepareStandardHeaders: (response) => {
        response.set("Content-Type", "application/json");
        response.set("X-Powered-By", "Node.js");
        response.set("Cache-Control", "no-store");
        response.set("Connection", "keep-alive");
        response.set("Date", new Date().toUTCString());
        return;
    },
    validateUser: (user) => {
        const result = [];
        if (user["fname"] !== undefined) {
            if (/^[a-zA-Z]+$/.test(user["fname"]))
                result.push(true);
            else
                result.push(false);
        }
        if (user["lname"] !== undefined) {
            if (/^[a-zA-Z]+$/.test(user["lname"]))
                result.push(true);
            else
                result.push(false);
        }
        if (user["email"] !== undefined) {
            if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user["email"]))
                result.push(true);
            else
                result.push(false);
        }
        // at least one: lower case letter, upper case letter, digit and special character
        // at least 8 characters long
        if (user["pass"] !== undefined) {
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(user["pass"]))
                result.push(true);
            else
                result.push(false);
        }
        if (result.includes(false))
            return false;
        return true;
    },
};
module.exports = helpers;
