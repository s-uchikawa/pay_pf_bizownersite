// see. https://newbedev.com/nameof-keyword-in-typescript

export type valueOf<T> = T[keyof T];

/**
 * Usage:
 * 
 * if (update.key !== nameOf((_: SomeClass) => _.someProperty)) {
 *  // ...                               
 * }
 * 
 */
export function nameOf<T, V extends T[keyof T]>(f: (x: T) => V): valueOf<{ [K in keyof T]: T[K] extends V ? K : never }>;
export function nameOf(f: (x: any) => any): keyof any {
    var p = new Proxy({}, {
        get: (target, key) => key
    })
    return f(p);
}

/**
 * Usage:
 * 
 * let obj: SomeClass = ...;
 * _$(obj).nameOf(x => x.someProperty)
 * 
 */
export interface I_$<T> {
    nameOf<V extends T[keyof T]>(f: (x: T) => V): valueOf<{ [K in keyof T]: T[K] extends V ? K : never }>;
}

export function _$<T>(obj: T) {
    return {
        nameOf: (f: (x: any) => any) => {
            return nameOf(f);
        }
    } as I_$<T>;
}