import * as simpleTypes from "./simple-type-constants";

export function isSimpleType(type: any) {
    return typeof type === "string" && simpleTypes.hasOwnProperty(type);
}
