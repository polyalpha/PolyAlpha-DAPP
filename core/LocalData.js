const Static = require("../utils/Static");

class LocalData {
    // Users
    // Messages
    static addUser(address, name, avatarUrl) {
        if (this.hasLocalStorage()) {
            let user = {};
            user[Static.LOCAL.USER_ADDRESS] = address;
            user[Static.LOCAL.USER_NAME] = name;
            user[Static.LOCAL.USER_AVARTAR_URL] = avatarUrl;
            let users = window.localStorage.getItem(Static.LOCAL.USER_LIST);
            if (users == undefined) {
                users = [];
            }
            users.push(user);
            window.localStorage.setItem(Static.LOCAL.USER_LIST, users);
        }
    }

    static testStorage() {
        console.log(this.hasLocalStorage());
        window.localStorage.setItem('hello', 'xx');
    }

    static getUsers() {
        let users;
        if (this.hasLocalStorage()) {
            users = window.localStorage.getItem(Static.LOCAL.USER_LIST);
            if (users == undefined) {
                users = [];
            }
        } else {
            users = [];
        }
        return users;
    }

    // Bid received array
    // Bid sent array

    // static setItem(name, value) {
    //     if (this.hasLocalStorage()) {
    //         window.localStorage.setItem(name, value);
    //     }
    // }

    static getItem(name) {
        if (this.hasLocalStorage()) {
            let value = window.localStorage.getItem(name);
            if (value == undefined) {
                return "";
            } else {
                return value;
            }
        } else {
            if (this.window != undefined) {
                return this.window.localStorage['name'];
            } else {
                return "";
            }
        }
    }

    static hasLocalStorage() {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = LocalData;