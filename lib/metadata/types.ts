import * as types from "./simple-type-constants";
import {RequiredTypeShape} from "./required-type";
import {BooleanType, DateType, JsonDateType, NullType, NumberType, StringType} from "./simple-type-constants";

export type PropertyTypes<T> = {
    [P in keyof T]: T[P]
}[keyof T];

export type SimpleTypeShape = PropertyTypes<typeof types>;

export type ComplexTypeShape = SimpleTypeShape | RequiredTypeShape<any>;

export type Shape<T> = T extends { [P in keyof T]: ComplexTypeShape } ? T : never;

export type TypeFromString<T> =
    T extends typeof StringType ? string :
    T extends typeof JsonDateType ? string :
    T extends typeof NumberType ? number :
    T extends typeof BooleanType ? boolean :
    T extends typeof NullType ? null :
    T extends typeof DateType ? Date :
    any;

export type TypeFromShape<T> = {
    [P in keyof T]: T[P] extends RequiredTypeShape<infer R> ? TypeFromString<R>
        : T[P] extends SimpleTypeShape ? (TypeFromString<T[P]> | null)
        : never;
};
