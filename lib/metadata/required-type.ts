import {Shape, SimpleTypeShape} from "./types";
import {isSimpleType} from "./simple-type";
import {ArrayTypeShape, isArrayType} from "./array-type";
import {NullType} from "./simple-type-constants";

type RequiredSubType = Exclude<SimpleTypeShape | ArrayTypeShape<any> | Shape<any>, typeof NullType>;

export class RequiredTypeShape<T extends RequiredSubType> {
    constructor(public readonly $$required: T) {
    }
}

export const RequiredType = <T extends RequiredSubType>(type: T): RequiredTypeShape<T> => new RequiredTypeShape(type);

export function isRequiredType(type: any) {
    if (typeof type !== "object" || type == null) {
        return false;
    }
    const subtype = type.$$required;
    return isSimpleType(subtype) || isArrayType(subtype);
}

export const extractTypeFromRequired = <T extends RequiredSubType>(type: RequiredTypeShape<T>) => type.$$required;
