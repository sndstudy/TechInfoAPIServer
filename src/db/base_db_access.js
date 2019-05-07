"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase-admin");
const serviceAccount = require("./tech-info-ss-serviceAccountKey.json");
class BaseDbAccess {
    constructor() { }
}
BaseDbAccess.app = firebase.initializeApp({
    credential: firebase.credential.cert(Object.assign({}, serviceAccount)),
});
exports.BaseDbAccess = BaseDbAccess;
//# sourceMappingURL=base_db_access.js.map