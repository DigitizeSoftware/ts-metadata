import {ValidationResult} from "./validation-result";
import {validateSimpleType} from "./validate-simple-type";
import {isObject} from "./simple-types";
import {toString} from "./to-string";
import {ComplexTypeShape, Shape, SimpleTypeShape} from "../metadata/types";
import {extractTypeFromRequired, isRequiredType, RequiredTypeShape} from "../metadata/required-type";

export function validateObject<T>(value: any, type: Shape<T>): ValidationResult {
    const result = new ValidationResult();

    if (!isObject(value)) {
        return result.addError(toString(value) + " is not an object");
    }

    // Validate expected keys
    const typeKeys = Object.keys(type) as Array<keyof Shape<T>>;
    typeKeys.forEach(k => {
        if (!value.hasOwnProperty(k)) {
            result.addError(`property "${k}" is missing`);
            return;
        }

        const keyValue = value[k];
        const keyType = type[k];
        const keyResult = validateComplexType(keyValue, keyType);
        if (!keyResult.valid) {
            result.addError(`property "${k}" > ${keyResult.error}`);
        }
    });

    //Validate unexpected keys
    const valueKeys = Object.keys(value);
    valueKeys.forEach(k => {
        if (!type.hasOwnProperty(k)) {
            result.addError(`unexpected property "${k}"`);
        }
    });

    return result;
}

export function validateComplexType(value: any, type: ComplexTypeShape): ValidationResult {
    if (isRequiredType(type)) {
        return validateSimpleType(value, extractTypeFromRequired(type as RequiredTypeShape<any>), true);
    }
    // else if (isObject(type)) {
    //     return validateObject(value, type as ObjectType);
    // }
    else {
        return validateSimpleType(value, type as SimpleTypeShape);
    }
}
