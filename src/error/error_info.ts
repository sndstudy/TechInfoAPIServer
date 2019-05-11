export class ErrorInfo {

    public statusCode: number;

    public message: string;

    public errorObj?: Error;

    constructor(statusCode: number, message: string, errorObj?: Error){
        this.statusCode = statusCode;
        this.message = message;
        this.errorObj = errorObj; 
    }

}