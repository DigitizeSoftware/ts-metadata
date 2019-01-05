export function isJsonDate(value: any) {
    return isString(value) && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z$/.test(value);
}

export function isString(value: any): boolean {
    return typeof value === "string";
}

export function isNumber(value: any) {
    return typeof value === "number" && !isNaN(value);
}

export function isBoolean(value: any) {
    return typeof value === "boolean";
}

export function isObject(value: any) {
    return typeof value === "object" && value != null;
}

export function isDate(value: any) {
    return isObject(value) && value instanceof Date;
}
