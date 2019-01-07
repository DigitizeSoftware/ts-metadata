export function isJsonDate(value: any): value is string {
    return isString(value) && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z$/.test(value);
}

export function isString(value: any): value is string {
    return typeof value === "string";
}

export function isNumber(value: any): value is number {
    return typeof value === "number" && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
    return typeof value === "boolean";
}

export function isObject(value: any) {
    return typeof value === "object" && value != null;
}

export function isDate(value: any): value is Date {
    return isObject(value) && value instanceof Date;
}

export function isNull(value: any): value is null {
    return value === null;
}
