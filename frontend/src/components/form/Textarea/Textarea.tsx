import { TextareaHTMLAttributes } from "react"

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string,
    error?: string,
}

const Textarea = ({ label, error, name, ...rest }: TextareaProps) => {
    return (
        <div>
            {label && <label className="d-block" htmlFor={name}>{label}</label>}
            <textarea {...rest} name={name} id={name} />
            {error && <span className="text-danger">{error}</span>}
        </div>
    )
}

export default Textarea