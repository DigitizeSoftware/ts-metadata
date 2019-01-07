import {ValidationResult} from "./validation-result";
import {isBoolean, isDate, isJsonDate, isNumber, isObject, isString} from "./simple-types";
import {toString} from "./to-string";
import * as types from "../metadata/simple-type-constants";
import {SimpleTypeShape} from "../metadata/types";

type ValidationMap = { [P in SimpleTypeShape]: (value: any) => boolean };

const validationMap: ValidationMap = {
    [types.JsonDateType]: isJsonDate,
    [types.StringType]: isString,
    [types.NumberType]: isNumber,
    [types.BooleanType]: isBoolean,
    [types.ObjectType]: isObject,
    [types.DateType]: isDate,
    [types.NullType]: (v: any) => v === null
};

export function validateSimpleType(value: any, type: SimpleTypeShape): ValidationResult {
    const result = new ValidationResult();
    const validationFn = validationMap[type];
    if (typeof validationFn === "undefined") {
        return result.addError(`unsupported simple type shape ${JSON.stringify(type)}`);
    }
    if (value != null && !validationFn(value)) {
        result.addError(`expected "${type}", got "${toString(value)}"`);
    }
    return result;
}
