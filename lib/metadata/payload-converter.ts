import {Shape, SimpleTypeShape, TypeFromShape} from "./types";
import {mapValues} from "../hashmap/map-values";
import {DateType, JsonDateType} from "./simple-type-constants";
import {extractTypeFromRequired, isRequiredType, RequiredType, RequiredTypeShape} from "./required-type";
import {parseJsonDate} from "./json-date";
import {ArraySubType, ArrayType, ArrayTypeShape, extractArraySubtype, isArrayType} from "./array-type";
import {isSimpleType} from "./simple-type";
import {payloadArrayValidator, payloadValidator} from "./payload-validator";
import {ValidationError} from "../errors/validation-error";

type PayloadSimpleType<T extends SimpleTypeShape> =
    T extends typeof DateType ? typeof JsonDateType :
        T;

interface PayloadArray<T extends ArraySubType> extends ArrayTypeShape<PayloadType<T>> {
}

type PayloadType<T> =
    T extends SimpleTypeShape ? PayloadSimpleType<T> :
    T extends ArrayTypeShape<infer R> ? PayloadArray<R> :
    T extends Shape<infer R> ? PayloadShape<R> :
    never;

type PayloadShape<T> = {
    [P in keyof T]:
        T[P] extends RequiredTypeShape<infer R> ? PayloadType<R> :
        PayloadType<T[P]>;
};

export function getPayloadShape<T>(recordShape: Shape<T>): Shape<PayloadShape<T>> {
    return mapValues(recordShape, (value) => {
        if (isRequiredType(value)) {
            return RequiredType(getPayloadType(extractTypeFromRequired(value as any)));
        }
        else {
            return getPayloadType(value);
        }
    }) as any;
}

function getPayloadType<T>(value: T): PayloadType<T> | void {
    if (isSimpleType(value)) {
        return getSimpleTypePayloadShape(value as any);
    }
    else if (isArrayType(value)) {
        return getPayloadArray(extractArraySubtype(value as any)) as any;
    }
    else if (typeof value === "object" && value != null) {
        return getPayloadShape(value as Shape<T>) as any;
    }
}

function getPayloadArray(value: ArraySubType) {
    return ArrayType(getPayloadType(value));
}

function getSimpleTypePayloadShape<T extends SimpleTypeShape>(value: T) {
    return value === DateType
        ? JsonDateType
        : value;
}

export function parsePayload<T>(payload: any, recordShape: Shape<T>): TypeFromShape<T> {
    const validationResult = payloadValidator(recordShape)(payload);
    if (!validationResult.valid) {
        throw new ValidationError(validationResult);
    }

    return mapValues(recordShape, (typeShape, key) => {
        const value = payload[key];
        if (typeShape === DateType || isRequiredType(typeShape) && extractTypeFromRequired(typeShape as any) === DateType) {
            return parseJsonDate(value);
        }
        else {
            return value;
        }
    });
}

export function parseArrayPayload<T>(payload: any, recordShape: Shape<T>): Array<TypeFromShape<T>> {
    const validationResult = payloadArrayValidator(recordShape)(payload);
    if (!validationResult.valid) {
        throw new ValidationError(validationResult);
    }

    return (payload as Array<T>).map(item => parsePayload(item, recordShape));
}
