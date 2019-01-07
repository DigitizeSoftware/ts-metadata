import * as simpleTypes from "./simple-type-constants";
import {SimpleTypeShape} from "./types";

export function isSimpleType(type: any): type is SimpleTypeShape {
    if (typeof type !== "string") {
        return false;
    }
    const foundType = Object.keys(simpleTypes).find((k: keyof typeof simpleTypes) => simpleTypes[k] === type);
    return typeof foundType !== "undefined";
}
