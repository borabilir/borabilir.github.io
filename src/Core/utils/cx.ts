import asArray from 'Core/utils/object/asArray';

type Argument =
    | string
    | null
    | undefined
    | Record<string, boolean>
    | [string, boolean | undefined]
    | [string, boolean | undefined, string];
type Arguments = Argument[];
type Props = (...args: Arguments) => string;

const cx: Props = (...args) => {
    let classList: string[] = [];

    args.forEach((x) => {
        if (typeof x === 'string' && x !== '') {
            classList.push(x);
        } else if (typeof x === 'object') {
            if (Array.isArray(x)) {
                if (x[1] === true) {
                    classList.push(x[0]);
                } else if (x.length === 3) {
                    classList.push(x[2]);
                }
            } else {
                asArray(x!).forEach(({ key, value }) => {
                    if (value === true) {
                        classList.push(key);
                    }
                });
            }
        }
    });

    return classList.join(' ');
};

export default cx;
