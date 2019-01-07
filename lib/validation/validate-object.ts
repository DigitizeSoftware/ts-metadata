import {ValidationResult} from "./validation-result";
import {validateSimpleType} from "./validate-simple-type";
import {isObject} from "./simple-types";
import {toString} from "./to-string";
import {Shape, SimpleTypeShape} from "../metadata/types";
import {extractTypeFromRequired, isRequiredType, RequiredTypeShape} from "../metadata/required-type";
import {isSimpleType} from "../metadata/simple-type";
import {ArraySubType, ArrayTypeShape, extractArraySubtype, isArrayType} from "../metadata/array-type";

export function validateObject<T>(value: any, type: Shape<T>): ValidationResult {
    const result = new ValidationResult();

    if (!isObject(value)) {
        return result.addError(toString(value) + " is not an object");
    }

    // Validate expected keys
    const typeKeys = Object.keys(type) as Array<keyof Shape<T>>;
    typeKeys.forEach(k => {
        if (!value.hasOwnProperty(k)) {
            return result.addError(`property "${k}" is missing`);
        }

        const keyValue = value[k];
        const keyType = type[k];
        const keyResult = validateComplexType(keyValue, keyType);
        if (!keyResult.valid) {
            result.addError(`"${k}" > ${keyResult.error}`);
        }
    });

    //Validate unexpected keys
    const valueKeys = Object.keys(value);
    valueKeys.forEach(k => {
        if (k === "$$required" || k === "$$array") {
            return result.addError(`"$$required" and "$$array" are reserved property names, you shouldn't use them`);
        }
        if (!type.hasOwnProperty(k)) {
            result.addError(`unexpected property "${k}"`);
        }
    });

    return result;
}

export function validateComplexType(value: any, type: SimpleTypeShape | RequiredTypeShape<any> | ArrayTypeShape<any> | Shape<any>): ValidationResult {
    if (isRequiredType(type)) {
        if (value == null) {
            return new ValidationResult("value cannot be null or undefined");
        }
        type = extractTypeFromRequired(type);
    }
    else if (value == null) {
        return new ValidationResult();
    }

    if (isSimpleType(type)) {
        return validateSimpleType(value, type as SimpleTypeShape);
    }
    else if (isArrayType(type)) {
        return validateArrayType(value, extractArraySubtype(type));
    }
    else {
        return validateObject(value, type);
    }
}

export function validateArrayType<T extends ArraySubType>(value: any, type: T): ValidationResult {
    if (!Array.isArray(value)) {
        return new ValidationResult(`${toString(value)} is not array`);
    }
    const result = new ValidationResult();
    value.forEach((item, i) => {
        const itemResult = validateComplexType(item, type);
        if (!itemResult.valid) {
            result.addError(`[${i}] > ${itemResult.error}`);
        }
    });
    return result;
}
