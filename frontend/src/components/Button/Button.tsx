import { ButtonHTMLAttributes } from "react"
import Spinner from "../Spinner/Spinner"
import { clsx } from "../../utils/clsx"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean,
    text?: string,
    fluid?: boolean,
}

const Button = ({ className, loading, fluid, text, children, ...rest }: ButtonProps) => {
    return (
        <button
            type="button"
            {...rest}
            className={clsx("custom_btn", fluid && "w-100", className)}
        >
            {
                loading ? <Spinner /> : text || children
            }
        </button>
    )
}

export default Button