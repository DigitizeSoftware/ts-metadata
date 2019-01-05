import {Shape, TypeFromShape} from "./types";
import {mapValues} from "../hashmap/map-values";
import {DateType, JsonDateType} from "./simple-type-constants";
import {extractTypeFromRequired, isRequiredType, RequiredType, RequiredTypeShape} from "./required-type";
import {parseJsonDate} from "./json-date";

type PayloadShapeFromRecordShape<T> = {
    [P in keyof T]: T[P] extends typeof DateType ? typeof JsonDateType
        : T[P] extends RequiredTypeShape<any> ? RequiredTypeShape<typeof JsonDateType>
        : T[P];
};

export function getPayloadShape<T>(recordShape: Shape<T>): Shape<PayloadShapeFromRecordShape<T>> {
    return mapValues(recordShape, (value) => {
        if (value === DateType) {
            return JsonDateType;
        }
        else if (isRequiredType(value) && (value as RequiredTypeShape<any>).$$required === DateType) {
            return RequiredType(JsonDateType);
        }
        else {
            return value;
        }
    }) as any;
}

export function parsePayload<T>(payload: any, recordShape: Shape<T>): TypeFromShape<T> {
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
