
import { yupResolver } from "@hookform/resolvers/yup"
import { FormEvent, useCallback, useMemo } from "react"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useDebouncedCallback } from "use-debounce"
import { useUpdatePermissionsMutation, useUserQuery } from "../../api/users/users.api"
import { routes } from "../../routes/AuthRoutes/Routes"
import { API_STATUS, PERMISSIONS } from "../../utils/constants"
import { capitalize, getSelectDefaultValue, Yup } from "../../utils/utils"
import Button from "../Button/Button"
import Select from "../form/Select/Select"
import Spinner from "../Spinner/Spinner"

type PropTypes = {
    show: boolean,
    id: string,
    handleClose: (shouldRefetch?: boolean) => void,
}

const PermissionModal = ({ show, id, handleClose }: PropTypes) => {
    const { data, status } = useUserQuery({ id });
    const [updatePermissions, { status: updatePermissionStatus }] = useUpdatePermissionsMutation();
    const isSubmitting = useMemo(() => updatePermissionStatus === API_STATUS.PENDING, [updatePermissionStatus]);
    const loading = useMemo(() => status === API_STATUS.PENDING, [status]);
    const PERMISSIONS_LIST = useMemo(() => routes.map(item => ({ value: item.module, label: capitalize(item.module) })), [routes]);

    const { setValue, watch, handleSubmit } = useForm({
        values: {
            permissions: data?.permissions || [PERMISSIONS.DASHBOARD],
        },
        resolver: yupResolver(Yup.object({
            permissions: Yup.array(Yup.string().required()).required(),
        })),
    });

    const values = watch();

    const onSubmit = handleSubmit(async ({ permissions }) => {
        try {
            await updatePermissions({ id, permissions, }).unwrap();
            handleClose(true);
        } catch (error) {
            console.log('error: ', error);
        }
    })

    const debouncedSubmit = useDebouncedCallback(() => onSubmit(), 300);

    const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        debouncedSubmit();
    }, [])

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            {
                loading ?
                    <Spinner />
                    :
                    <Modal.Body>
                        <form onSubmit={handleFormSubmit}>
                            <Select
                                label="Username"
                                isDisabled
                                value={{ value: "", label: data?.username || "" }}
                            />
                            <Select
                                options={PERMISSIONS_LIST}
                                label="Permissions"
                                isMulti
                                onChange={(option, action) => {
                                    setValue("permissions", option.map(item => String(item.value)));
                                }}
                                value={getSelectDefaultValue(PERMISSIONS_LIST, values.permissions)}
                            />
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                        </form>
                    </Modal.Body>
            }
        </Modal>
    )
}

export default PermissionModal