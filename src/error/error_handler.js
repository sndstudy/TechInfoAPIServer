"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_enum_1 = require("./error_enum");
const error_info_1 = require("./error_info");
exports.errorHandler = (errCode, req, res, next) => {
    console.log('エラーハンドリング');
    switch (errCode) {
        case error_enum_1.ErrorEnum.NotFound:
            return res.status(error_enum_1.ErrorEnum.NotFound).json(new error_info_1.ErrorInfo(error_enum_1.ErrorEnum.NotFound, "Not Found"));
        case error_enum_1.ErrorEnum.MethodNotAllowed:
            return res.status(error_enum_1.ErrorEnum.MethodNotAllowed).json(new error_info_1.ErrorInfo(error_enum_1.ErrorEnum.MethodNotAllowed, "Method Not Allowed"));
        default:
            return res.status(error_enum_1.ErrorEnum.InternalServerError).json(new error_info_1.ErrorInfo(error_enum_1.ErrorEnum.InternalServerError, "Internal Server Error"));
    }
};
//# sourceMappingURL=error_handler.js.map