import { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string,
    error?: string,
}

const Input = ({ label, error, name, ...rest }: InputProps) => {
    return (
        <div>
            {label && <label className="d-block" htmlFor={name}>{label}</label>}
            <input type="text" {...rest} name={name} id={name} />
            {error && <span className="text-danger">{error}</span>}
        </div>
    )
}

export default Input