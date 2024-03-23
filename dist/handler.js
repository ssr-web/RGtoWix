"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const wixToRg_1 = __importDefault(require("./wixToRg"));
const handler = async (event) => {
    const results = await (0, wixToRg_1.default)({
        username: String(process.env.username),
        password: String(process.env.password),
        token: String(process.env.token),
        collection: String(process.env.collection),
        accountId: String(process.env.accountId),
    });
    const response = {
        statusCode: 200,
        body: JSON.stringify('Finished'),
    };
    return response;
};
exports.handler = handler;
//# sourceMappingURL=handler.js.map