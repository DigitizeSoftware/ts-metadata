export type MapValuesResult<T, U> = {
    [P in keyof T]: U
};
export type ObjectValues<T> = T[keyof T];
export type ObjectKeys<T> = {
    [P in keyof T]: P
}[keyof T];

export function mapValues<T, U>(object: T, callback: (value: ObjectValues<T>, key: ObjectKeys<T>) => U): MapValuesResult<T, U> {
    const result = {} as MapValuesResult<T, U>;
    const keys = Object.keys(object) as Array<keyof T>;
    keys.forEach(key => {
        const item = object[key];
        result[key] = callback(item, key);
    });
    return result;
}
