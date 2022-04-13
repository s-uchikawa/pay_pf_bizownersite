export class ApiError extends Error {
    public innerError: any;

    constructor(message: string, innerError: any) {        
        super(message);

        this.innerError = innerError;
    }
}
