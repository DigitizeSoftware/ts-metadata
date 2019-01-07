import {CustomError} from "ts-custom-error";

import {ValidationResult} from "../validation/validation-result";

export class ValidationError extends CustomError {
    constructor({error}: ValidationResult, message?: string) {
        const msg = message
            ? `${message}: ${error}`
            : error;
        super(msg);
    }
}
