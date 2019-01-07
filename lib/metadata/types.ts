import * as types from "./simple-type-constants";
import {ArrayType, ArrayTypeShape} from "./array-type";
import {BooleanType, DateType, JsonDateType, NullType, NumberType, StringType} from "./simple-type-constants";
import {RequiredTypeShape} from "./required-type";

export type PropertyTypes<T> = {
    [P in keyof T]: T[P]
}[keyof T];

export type SimpleTypeShape = PropertyTypes<typeof types>;

export type ComplexTypeShape = SimpleTypeShape | RequiredTypeShape<any> | ArrayTypeShape<any>;

export type Shape<T> = T extends { [P in keyof T]: ComplexTypeShape } ? T : never;

export type TypeFromSimpleOrComplexType<T extends SimpleTypeShape | ArrayTypeShape<any> | Shape<any>> =
    T extends SimpleTypeShape ? TypeFromString<T> :
    T extends ArrayTypeShape<infer R> ? ArrayType<R> :
    T extends Shape<infer R> ? TypeFromShape<T> :
    never;

interface ArrayType<T extends SimpleTypeShape | ArrayTypeShape<any> | Shape<any>> extends Array<TypeFromSimpleOrComplexType<T>> {
}

export type TypeFromString<T extends SimpleTypeShape> =
    T extends typeof StringType ? string :
    T extends typeof JsonDateType ? string :
    T extends typeof NumberType ? number :
    T extends typeof BooleanType ? boolean :
    T extends typeof NullType ? null :
    T extends typeof DateType ? Date :
    any;

export type TypeFromShape<T> = {
    [P in keyof T]:
        P extends "$$array" ? never :
        P extends "$$required" ? never :
        T[P] extends RequiredTypeShape<infer R> ?
            R extends SimpleTypeShape | ArrayTypeShape<any> | Shape<any> ? TypeFromSimpleOrComplexType<R> :
            never :
        TypeFromSimpleOrComplexType<T[P]> | null;
};
