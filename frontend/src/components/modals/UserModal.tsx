import { useMemo } from "react"
import { Modal } from "react-bootstrap"
import { Controller } from "react-hook-form"
import useUser from "../../actions/user/user.action"
import { routes } from "../../routes/AuthRoutes/Routes"
import { ROLES } from "../../utils/constants"
import { capitalize, getSelectDefaultValue } from "../../utils/utils"
import Button from "../Button/Button"
import Input from "../form/Input/Input"
import Select from "../form/Select/Select"
import Spinner from "../Spinner/Spinner"

type PropTypes = {
    show: boolean,
    handleClose: (shouldRefetch?: boolean) => void,
    id?: string,
}

const UserModal = ({ show, id, handleClose }: PropTypes) => {
    const { control, handleSubmit, loading, userFetching } = useUser({ handleClose, id });
    const PERMISSIONS_LIST = useMemo(() => routes.map(item => ({ value: item.module, label: capitalize(item.module) })), [routes]);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            {
                userFetching ?
                    <Spinner />
                    :
                    <Modal.Body>
                        <form onSubmit={handleSubmit}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field, fieldState }) =>
                                    <Input
                                        label="Email"
                                        type="email"
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                }
                            />
                            <Controller
                                control={control}
                                name="username"
                                render={({ field, fieldState }) =>
                                    <Input
                                        label="Username"
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                }
                            />
                            <Controller
                                control={control}
                                name="name"
                                render={({ field, fieldState }) =>
                                    <Input
                                        label="Name"
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                }
                            />
                            {!id && <Controller
                                control={control}
                                name="password"
                                render={({ field, fieldState }) =>
                                    <Input
                                        label="Password"
                                        type="password"
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                }
                            />}
                            {!id && <Controller
                                control={control}
                                name="role"
                                render={({ field, fieldState }) =>
                                    <Select
                                        label="Role"
                                        options={ROLES}
                                        value={getSelectDefaultValue(ROLES, field.value)}
                                        onChange={option => field.onChange(option?.value)}
                                        error={fieldState.error?.message}
                                    />
                                }
                            />}
                            {!id && <Controller
                                control={control}
                                name="permissions"
                                render={({ field, fieldState }) =>
                                    <Select
                                        label="Permissions"
                                        options={PERMISSIONS_LIST}
                                        value={getSelectDefaultValue(PERMISSIONS_LIST, field.value)}
                                        onChange={option => field.onChange(option.map(item => item.value))}
                                        error={fieldState.error?.message}
                                        isMulti
                                    />
                                }
                            />}
                            <Button
                                type="submit"
                                disabled={loading}
                                loading={loading}
                            >
                                Submit
                            </Button>
                        </form>
                    </Modal.Body>
            }
        </Modal>
    )
}

export default UserModal