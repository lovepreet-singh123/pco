import { Controller } from "react-hook-form";
import { useLogin } from "../../actions/login/login.action";
import Button from "../../components/Button/Button";
import Input from "../../components/form/Input/Input";

const Login = () => {
    const { control, onSubmit, loading } = useLogin();
    return (
        <div>
            <form onSubmit={onSubmit}>
                <Controller
                    name="username"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <Input
                                {...field}
                                error={fieldState.error?.message}
                            />
                        )
                    }}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <Input
                                type="password"
                                {...field}
                                error={fieldState.error?.message}
                            />
                        )
                    }}
                />
                <Button loading={loading} disabled={loading} type="submit">Submit</Button>
            </form>
        </div>
    )
}

export default Login