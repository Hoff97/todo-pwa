export type CompareFunction<A> = 
        ((a: A) => number)
    |   { tpe: 'dual', fun: (a: A, b: A) => number}

export function dual<A>(fun: (a: A, b: A) => number): CompareFunction<A> {
    return {
        tpe: 'dual',
        fun
    };
}

export const comparing = <A>(...props: CompareFunction<A>[]) => (a1: A, a2: A) => {
    for(let prop of props) {
        let comp = 0;
        if(!prop['tpe']) {
            comp = (<((a: A) => number)>prop)(a1)-(<((a: A) => number)>prop)(a2);
        } else {
            comp = (<any>prop).fun(a1, a2);
        }
        if (comp !== 0) {
            return comp;
        };
    }
    return 0;
}