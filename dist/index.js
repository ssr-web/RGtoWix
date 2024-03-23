"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wixToRg_1 = __importDefault(require("./wixToRg"));
const util_1 = require("util");
/**
 * Setup script to run manually
 */
const init = async () => {
    const options = {
        username: {
            type: 'string',
            short: 'u'
        },
        password: {
            type: 'string',
            short: 'p'
        },
        accountId: {
            type: 'string',
            short: 'a'
        },
        collection: {
            type: 'string',
            short: 'c'
        },
        token: {
            type: 'string',
            short: 't'
        },
    };
    const { values } = (0, util_1.parseArgs)({ options, allowPositionals: true });
    const { username, password, token, collection, accountId } = values;
    (0, wixToRg_1.default)({
        username: String(username),
        password: String(password),
        token: String(token),
        collection: String(collection),
        accountId: String(accountId)
    });
    console.log('Done');
};
init();
//# sourceMappingURL=index.js.map