import { Entry } from 'Core/types/Entry';

type Props = <T extends {}>(data: T) => Entry<T>[];

const asArray: Props = (data) => {
    if (!data) return [];
    return Object.keys(data).map((x) => ({
        key: x as keyof typeof data,
        value: data[x as keyof typeof data],
    }));
};

export default asArray;
