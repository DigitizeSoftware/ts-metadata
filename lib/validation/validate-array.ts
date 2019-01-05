import {Shape} from "../metadata/types";
import {ValidationResult} from "./validation-result";
import {validateObject} from "./validate-object";

export function validateArray<T>(arr: Array<any>, shape: Shape<T>): ValidationResult {
    const result = new ValidationResult();
    arr.forEach(item => {
        const itemResult = validateObject(item, shape);
        if (!itemResult.valid) {
            result.addError(itemResult.error);
        }
    });
    return result;
}
