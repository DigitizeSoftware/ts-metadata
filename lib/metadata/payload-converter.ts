import {ArraySubType, ArrayType, ArrayTypeShape, extractArraySubtype, isArrayType} from "./array-type";
import {DateType, JsonDateType} from "./simple-type-constants";
import {Shape, SimpleTypeShape, TypeFromShape} from "./types";
import {ValidationError} from "../errors/validation-error";
import {extractTypeFromRequired, isRequiredType, RequiredType, RequiredTypeShape} from "./required-type";
import {isSimpleType} from "./simple-type";
import {mapValues} from "../hashmap/map-values";
import {parseJsonDate} from "./json-date";
import {payloadArrayValidator, payloadValidator} from "./payload-validator";

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

    return parseShape(payload, recordShape);
}

export function parseArrayPayload<T>(payload: any, recordShape: Shape<T>): Array<TypeFromShape<T>> {
    const validationResult = payloadArrayValidator(recordShape)(payload);
    if (!validationResult.valid) {
        throw new ValidationError(validationResult);
    }

    return (payload as Array<T>).map(item => parseShape(item, recordShape));
}

function parseShape<T>(payload: any, typeShape: Shape<T>) {
    return mapValues(typeShape, (keyShape, key) => parseValueType(payload[key], keyShape))
}

function parseValueType<T>(value: any, typeShape: SimpleTypeShape | RequiredTypeShape<any> | ArrayTypeShape<any> | Shape<T>): any {
    if (isRequiredType(typeShape)) {
        typeShape = extractTypeFromRequired(typeShape);
    }
    if (isSimpleType(typeShape)) {
        return parseSimpleValue(value, typeShape);
    }
    else if (isArrayType(typeShape)) {
        if (Array.isArray(value)) {
            const arraySubtype = extractArraySubtype(typeShape);
            return value.map(item => parseValueType(item, arraySubtype));
        }
        else {
            return value;
        }
    }
    else if (typeof typeShape === "object" && typeShape != null) {
        return parseShape(value, typeShape as Shape<T>);
    }
    else {
        return value;
    }
}

function parseSimpleValue(value: any, type: SimpleTypeShape) {
    return type === DateType
        ? parseJsonDate(value)
        : value;
}
