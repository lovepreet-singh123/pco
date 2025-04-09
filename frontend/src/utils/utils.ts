import * as Yup from 'yup';
import { Option } from '../components/form/Select/Select';

const getBadge = (type: string) => type === "INACTIVE" ? "bg-danger" : type === "ARCHIVED" ? "bg-warning" : ""

const capitalize = (str?: string) => str && `${str[0].toLocaleUpperCase()}${str.slice(1).toLocaleLowerCase()}`

const getFilteredValues = <T>(arr: T[], value: T): T[] => {
    if (arr.includes(value)) {
        return arr.filter(item => item !== value);
    }
    return [...arr, value];
}

const getSelectDefaultValue = <T>(options: Option[], value: T) => {
    if (Array.isArray(value)) {
        const set = new Set(value);
        return options.filter(option => set.has(option.value));
    }
    return options.find(option => option.value === value);
};
export { getBadge, getFilteredValues, capitalize, Yup, getSelectDefaultValue };
