
import Loadable from 'react-loadable';
import * as React from 'react';

export type CompareFunction<A> =
    ((a: A) => number)
    | { tpe: 'dual', fun: (a: A, b: A) => number }

export function dual<A>(fun: (a: A, b: A) => number): CompareFunction<A> {
    return {
        tpe: 'dual',
        fun
    };
}

export const comparing = <A>(...props: CompareFunction<A>[]) => (a1: A, a2: A) => {
    for (let prop of props) {
        let comp = 0;
        if (!prop['tpe']) {
            comp = (<((a: A) => number)>prop)(a1) - (<((a: A) => number)>prop)(a2);
        } else {
            comp = (<any>prop).fun(a1, a2);
        }
        if (comp !== 0) {
            return comp;
        };
    }
    return 0;
}

export function dataSize(size: number) {
    if (size < 1000) {
        return size + 'B';
    } else if (size < 1000 * 1000) {
        return (prec(size / 1000, 1)) + 'kB';
    } else if (size < 1000 * 1000 * 1000) {
        return (prec(size / 1000 / 1000, 1)) + 'MB';
    }
    return size + 'B';
}

export function prec(n: number, prec: number) {
    return Math.round(n * (10 ** prec)) / (10 ** prec);
}

export function defaultLoad(f: () => Promise<any>, loading: React.ComponentType<any>) {
    return Loadable({
        loader: () => {
            return f().then((x: any) => {
                return (new Promise(resolve => {
                    x((y: any) => resolve(y))
                })) as any;
            });
        },
        loading: loading,
    });
}