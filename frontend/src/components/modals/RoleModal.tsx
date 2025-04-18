import { yupResolver } from "@hookform/resolvers/yup"
import { FormEvent, useCallback, useMemo } from "react"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useDebouncedCallback } from "use-debounce"
import { useUpdateRoleMutation, useUserQuery } from "../../api/users/users.api"
import { API_STATUS, ROLE, ROLES } from "../../utils/constants"
import { getSelectDefaultValue, Yup } from "../../utils/utils"
import Button from "../Button/Button"
import Select from "../form/Select/Select"
import Spinner from "../Spinner/Spinner"

type PropTypes = {
    show: boolean,
    id: string,
    handleClose: (shouldRefetch?: boolean) => void,
}

const RoleModal = ({ show, id, handleClose }: PropTypes) => {
    const { data, status } = useUserQuery({ id });
    const [updateRole, { status: updateRoleStatus }] = useUpdateRoleMutation();
    const isSubmitting = useMemo(() => updateRoleStatus === API_STATUS.PENDING, [updateRoleStatus]);
    const loading = useMemo(() => status === API_STATUS.PENDING, [status]);

    const { setValue, watch, handleSubmit } = useForm({
        values: {
            role: data?.role || ROLE.USER,
        },
        resolver: yupResolver(Yup.object({
            role: Yup.number().required(),
        })),
    });

    const values = watch();
    const onSubmit = handleSubmit(async ({ role }) => {
        try {
            await updateRole({ id, role, }).unwrap();
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
                                options={ROLES}
                                label="Role"
                                onChange={option => setValue("role", Number(option?.value))}
                                value={getSelectDefaultValue(ROLES, values.role)}
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

export default RoleModal