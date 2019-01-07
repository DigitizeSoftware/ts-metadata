import {Shape, SimpleTypeShape} from "./types";
import {isSimpleType} from "./simple-type";

export type ArraySubType = SimpleTypeShape | ArrayTypeShape<any> | Shape<any>;

export class ArrayTypeShape<T extends ArraySubType> {
    constructor(public readonly $$array: T) {}
}

export const ArrayType = <T extends ArraySubType>(type: T) => new ArrayTypeShape(type);

export function isArrayType(type: any): type is ArrayTypeShape<any> {
    if (typeof type !== "object" || type == null) {
        return false;
    }
    const subtype = (type as any).$$array;
    return isSimpleType(subtype) || isArrayType(subtype) || typeof subtype === "object" && subtype != null;
}

export const extractArraySubtype = <T extends ArraySubType>(type: ArrayTypeShape<T>): T => type.$$array;
