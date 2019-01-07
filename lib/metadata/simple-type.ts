import * as simpleTypes from "./simple-type-constants";

export function isSimpleType(type: any) {
    if (typeof type !== "string") {
        return false;
    }
    const foundType = Object.keys(simpleTypes).find((k: keyof typeof simpleTypes) => simpleTypes[k] === type);
    return typeof foundType !== "undefined";
}
