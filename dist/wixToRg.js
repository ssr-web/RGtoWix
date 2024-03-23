"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RG_1 = __importDefault(require("./RG"));
const WIX_1 = __importDefault(require("./WIX"));
const wixToRG = async (args) => {
    console.log('Setting up RG conenction');
    const rg = new RG_1.default(args.accountId);
    await rg.login(args.username, args.password);
    console.log("Logged in to RG");
    const dogs = await rg.getDogs();
    console.log(`${dogs.length} found in RG`);
    const wix = new WIX_1.default(args.token, args.collection);
    await wix.truncate();
    console.log('Truncated wix collection!');
    const items = await wix.insert(dogs);
    console.log(`${items?.bulkActionMetadata?.totalSuccesses} uploaded to wix collection.`);
};
exports.default = wixToRG;
//# sourceMappingURL=wixToRg.js.map