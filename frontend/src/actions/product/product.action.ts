import { yupResolver } from "@hookform/resolvers/yup";
import { FormEvent, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { useCreateProductMutation, useLazyGetProductQuery, useUpdateProductMutation } from "../../api/products/products.api";
import { API_STATUS, MSGS } from "../../utils/constants";
import { Yup } from "../../utils/utils";
import toast from "react-hot-toast";

export type createProductType = {
    name: string,
    description: string,
    status: string,
    stock: string,
    is_premium: boolean,
    rating: number,
    category: string,
    tags: string[],
    price: string,
}

const validationSchema = Yup.object({
    name: Yup.string().required(),
    description: Yup.string().required(),
    status: Yup.string().required(),
    stock: Yup.string().required(),
    is_premium: Yup.boolean().required(),
    rating: Yup.number().required().min(1),
    category: Yup.string().required(),
    tags: Yup.array(Yup.string().required()).required().min(1),
    price: Yup.string().required(),
})
const defaultValues = {
    name: "",
    description: "",
    status: "",
    stock: "",
    is_premium: false,
    rating: 5,
    category: "",
    tags: [],
    price: "",
}
const useProduct = ({ handleClose, id }: { id?: string, handleClose: (shouldRefetch?: boolean) => void }) => {
    const [getProduct, { status: getProductStatus }] = useLazyGetProductQuery();
    const [createProduct, { status }] = useCreateProductMutation();
    const [updateProduct, { status: updatingProduct }] = useUpdateProductMutation();
    const loading = useMemo(() => (status === API_STATUS.PENDING) || (updatingProduct === API_STATUS.PENDING), [status, updatingProduct])
    const fetchingProduct = useMemo(() => getProductStatus === API_STATUS.PENDING, [getProductStatus])

    const { control, setValue, handleSubmit, reset, } = useForm<createProductType>({
        defaultValues,
        resolver: yupResolver(validationSchema),
    })

    const fetchProduct = useCallback(async () => {
        if (id) {
            try {
                const response = await getProduct({ id }).unwrap();
                const { _id, createdAt, updatedAt, ...rest } = response;
                const values = {
                    ...rest,
                    stock: String(rest.stock),
                    price: String(rest.price),
                }
                reset(values);
            } catch (error) {
                console.log('error: ', error);
            }
        }
    }, [id, getProduct, reset])

    const onUpdate = handleSubmit(async data => {
        if (id) {
            try {
                await updateProduct({ ...data, id }).unwrap();
                toast.success(MSGS.PRODUCT_UPDATED);
                handleClose(true);
            } catch (error) {
                console.log('error: ', error);
            }
        }
    })

    const onSubmit = handleSubmit(async data => {
        try {
            await createProduct(data).unwrap();
            toast.success(MSGS.PRODUCT_CREATED);
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
            fetchProduct();
        }
    }, [id, fetchProduct])

    return {
        handleSubmit: submit,
        setValue,
        control,
        loading,
        productFetching: fetchingProduct,
    }
}

export default useProduct;