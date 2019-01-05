export type Merge<T, U> = {
    [P in keyof T]: P extends keyof U
        ? U[P]
        : T[P];
}

export type MappedValue<T, U> =
    U extends (value: infer R, ...args: any[]) => infer V
        ? R extends T
            ? V
            : never
        : U extends undefined
            ? T
            : U

export type Mapped<T, U> = {
    [P in keyof T | keyof U]: P extends keyof U
        ? P extends keyof T
            ? MappedValue<T[P], U[P]>
            : never
        : P extends keyof T
            ? T[P]
            : never
}

export type Mapper<T, U> = RequiredMapper<T, U> & OptionalMapper<T, U>;

type ValueMapper<T, U> = U | ((value: T) => U);

type RequiredMapperProps<T, U> = {
    [P in keyof U]: P extends keyof T
        ? U[P] extends T[P]
            ? never
            : P
        : never;
}[keyof U];

type OptionalMapperProps<T, U> = {
    [P in keyof T]: P extends keyof U
        ? U[P] extends T[P]
            ? P
            : never
        : P;
}[keyof T];

type OptionalMapper<T, U> = {
    [P in OptionalMapperProps<T, U>]?: ValueMapper<T[P], T[P]>;
}

type RequiredMapper<T, U> = {
    [P in RequiredMapperProps<T, U>]: P extends keyof T
        ? ValueMapper<T[P], U[P]>
        : never;
}

export function mapObject<T, U>(obj: T, map: Mapper<T, U>): Mapped<T, U> {
    let result = {...obj};
    const keys = Object.keys(obj) as Array<keyof T>;
    keys.forEach(key => {
        if (map.hasOwnProperty(key)) {
            const mappedValue = map[key as keyof typeof map];
            if (typeof mappedValue === "function") {
                result[key] = mappedValue(result[key]);
            }
            else {
                result[key] = mappedValue as any;
            }
        }
    });
    return result as any;
}
