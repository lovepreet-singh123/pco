import { Props } from "react-select"
import ReactSelect from "react-select";

export type Option = {
    value: string | number,
    label: string | number,
}

type PropTypes<isMulti extends boolean> = Props<Option, isMulti> & {
    label?: string,
    error?: string,
}

const Select = <isMulti extends boolean = false>({ label, name, error, ...rest }: PropTypes<isMulti>) => {
    return (
        <div>
            {label && <label className="d-block" htmlFor={name}>{label}</label>}
            <ReactSelect
                {...rest}
                name={name}
                id={name}
            />
            {error && <span className="text-danger">{error}</span>}
        </div>
    )
}

export default Select