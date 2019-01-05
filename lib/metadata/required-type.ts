import {SimpleTypeShape} from "./types";

export class RequiredTypeShape<T extends SimpleTypeShape> {
    constructor(public readonly $$required: T) {
    }
}

export const RequiredType = <T extends SimpleTypeShape>(type: T): RequiredTypeShape<T> => new RequiredTypeShape(type);

export function isRequiredType(type: any) {
    return typeof type === "object" && type != null && typeof type.$$required === "string";
}

export const extractTypeFromRequired = <T extends SimpleTypeShape>(type: RequiredTypeShape<T>) => type.$$required;
