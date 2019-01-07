import {Shape, SimpleTypeShape} from "./types";
import {isSimpleType} from "./simple-type";

export type ArraySubType = SimpleTypeShape | ArrayTypeShape<any> | Shape<any>;

export class ArrayTypeShape<T extends ArraySubType> {
    constructor(public readonly $$array: T) {}
}

export const ArrayType = <T extends ArraySubType>(type: T) => new ArrayTypeShape(type);

export function isArrayType<T>(type: T): T extends ArrayTypeShape<any> ? true : false {
    if (typeof type !== "object" || type == null) {
        return false as any;
    }
    const subtype = (type as any).$$array;
    return (isSimpleType(subtype) || isArrayType(subtype) || typeof subtype === "object" && subtype != null) as any;
}

export const extractArraySubtype = <T extends ArraySubType>(type: ArrayTypeShape<T>): T => type.$$array;
