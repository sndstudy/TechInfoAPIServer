import * as Express from "express";
import { ErrorEnum } from "./error_enum";
import { ErrorInfo } from "./error_info";

export const errorHandler = (errCode: number, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    
    switch (errCode){
        case ErrorEnum.NotFound:
            return res.status(ErrorEnum.NotFound).json(new ErrorInfo(ErrorEnum.NotFound, "Not Found"));
        case ErrorEnum.MethodNotAllowed:
            return res.status(ErrorEnum.MethodNotAllowed).json(new ErrorInfo(ErrorEnum.MethodNotAllowed, "Method Not Allowed"));
        default:
            return res.status(ErrorEnum.InternalServerError).json(new ErrorInfo(ErrorEnum.InternalServerError, "Internal Server Error"));
    }

};