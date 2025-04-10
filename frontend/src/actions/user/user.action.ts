import { yupResolver } from "@hookform/resolvers/yup";
import { FormEvent, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import { useCreateUserMutation, useLazyUserQuery, useUpdateUserMutation } from "../../api/users/users.api";
import { API_STATUS, MSGS, ROLE } from "../../utils/constants";
import { Yup } from "../../utils/utils";

const defaultValues = {
    username: "",
    email: "",
    name: "",
    permissions: [],
    password: "test123",
    role: ROLE.USER,
}
type FormValues = {
    username: string;
    email: string;
    name: string;
    permissions: string[];
    password: string;
    role: number;
}

const validationSchema = Yup.object({
    username: Yup.string().required(),
    email: Yup.string().required().email(),
    name: Yup.string().required(),
    permissions: Yup.array(Yup.string().required()).required().min(1),
    password: Yup.string().required(),
    role: Yup.number().required(),
})

const useUser = ({ handleClose, id }: { id?: string, handleClose: (shouldRefetch?: boolean) => void }) => {
    const [getUser, { status: getUserStatus }] = useLazyUserQuery();
    const [createUser, { status }] = useCreateUserMutation();
    const [updateUser, { status: updatingUser }] = useUpdateUserMutation();
    const loading = useMemo(() => (status === API_STATUS.PENDING) || (updatingUser === API_STATUS.PENDING), [status, updatingUser])
    const userFetching = useMemo(() => getUserStatus === API_STATUS.PENDING, [getUserStatus])

    const { control, setValue, handleSubmit, reset, } = useForm<FormValues>({
        defaultValues,
        resolver: yupResolver(validationSchema),
    })

    const fetchUser = useCallback(async () => {
        if (id) {
            try {
                const response = await getUser({ id }).unwrap();
                const { _id, ...rest } = response;
                reset({ ...rest, password: "-" });
            } catch (error) {
                console.log('error: ', error);
            }
        }
    }, [id, getUser, reset])

    const onUpdate = handleSubmit(async req => {
        if (id) {
            const { password, ...data } = req;
            try {
                await updateUser({ ...data, id }).unwrap();
                toast.success(MSGS.USER_UPDATED);
                handleClose(true);
            } catch (error) {
                console.log('error: ', error);
            }
        }
    })

    const onSubmit = handleSubmit(async data => {
        try {
            await createUser(data).unwrap();
            toast.success(MSGS.USER_CREATED);
            handleClose(true);
        } catch (error) {
            console.log('error: ', error);
        }
    })

    const debouncedSubmit = useDebouncedCallback(id ? onUpdate : onSubmit, 300);

    const submit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        debouncedSubmit();
    }, [debouncedSubmit])

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id, fetchUser])

    return {
        handleSubmit: submit,
        setValue,
        control,
        loading,
        userFetching,
    }
}

export default useUser;