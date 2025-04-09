import { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string,
    error?: string,
}


const Checkbox = ({ label, error, name, id, ...rest }: InputProps) => {
    return (
        <div>
            {label && <label className="me-2" htmlFor={id}>{label}</label>}
            <input {...rest} type="checkbox" name={name} id={id} />
            {error && <span className="text-danger">{error}</span>}
        </div>
    )
}

export default Checkbox