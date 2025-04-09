import { Modal } from "react-bootstrap"
import { Controller } from "react-hook-form"
import useProduct from "../../actions/product/product.action"
import { CATEGORIES, STATUS_OPTIONS, TAGS } from "../../utils/constants"
import { getSelectDefaultValue } from "../../utils/utils"
import Button from "../Button/Button"
import Checkbox from "../form/Checkbox/Checkbox"
import Input from "../form/Input/Input"
import Select from "../form/Select/Select"
import Textarea from "../form/Textarea/Textarea"
import Spinner from "../Spinner/Spinner"

type PropTypes = {
    show: boolean,
    handleClose: () => void,
    id?: string,
}

const ProductModal = ({ show, id, handleClose }: PropTypes) => {
    const { control, handleSubmit, loading, productFetching } = useProduct({ handleClose, id });
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            {
                productFetching ?
                    <Spinner />
                    :
                    <Modal.Body>
                        <form onSubmit={handleSubmit}>
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
                            <Controller
                                control={control}
                                name="description"
                                render={({ field, fieldState }) =>
                                    <Textarea
                                        {...field}
                                        error={fieldState.error?.message}
                                        label="Description"
                                    />}
                            />
                            <Controller
                                control={control}
                                name="status"
                                render={({ field, fieldState }) =>
                                    <Select
                                        options={STATUS_OPTIONS}
                                        label="Status"
                                        defaultValue={getSelectDefaultValue(STATUS_OPTIONS, field.value)}
                                        error={fieldState.error?.message}
                                        onChange={(option) => field.onChange(option?.value)}
                                    />
                                }
                            />
                            <Controller
                                control={control}
                                name="price"
                                render={({ field, fieldState }) =>
                                    <Input
                                        label="Price"
                                        type="number"
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                }
                            />
                            <Controller
                                control={control}
                                name="stock"
                                render={({ field, fieldState }) =>
                                    <Input
                                        label="Stock"
                                        type="number"
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                }
                            />
                            <div className="d-flex my-4 gap-3 align-items-center">
                                <Controller
                                    control={control}
                                    name="is_premium"
                                    render={({ field, fieldState }) => <Checkbox {...field} error={fieldState.error?.message} defaultChecked={field.value} value="true" label={"Is Premium"} />}
                                />
                            </div>
                            <div className="d-flex my-4 gap-3 align-items-center">
                                <Controller
                                    control={control}
                                    name="rating"
                                    render={({ field, fieldState }) => {
                                        return <>
                                            {
                                                Array.from({ length: 5 }, (_, k) => {
                                                    return (
                                                        <button type="button" key={k} onClick={() => field.onChange((k + 1))}>
                                                            {
                                                                field.value < (k + 1) ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                                    </svg>
                                                                    :
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                                    </svg>
                                                            }
                                                        </button>
                                                    )
                                                })
                                            }
                                            {field.value > 0 && <button type="button" onClick={() => field.onChange(0)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </button>}
                                            <div>
                                                {fieldState.error && <span className="text-danger">{fieldState.error.message}</span>}
                                            </div>
                                        </>
                                    }}
                                />
                            </div>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field, fieldState }) =>
                                    <Select
                                        options={CATEGORIES}
                                        label="Category"
                                        defaultValue={getSelectDefaultValue(CATEGORIES, field.value)}
                                        error={fieldState.error?.message}
                                        onChange={(option) => field.onChange(option?.value)}
                                    />
                                }
                            />
                            <Controller
                                control={control}
                                name="tags"
                                render={({ field, fieldState }) =>
                                    <Select
                                        options={TAGS}
                                        label="Tags"
                                        isMulti
                                        error={fieldState.error?.message}
                                        defaultValue={getSelectDefaultValue(TAGS, field.value)}
                                        onChange={(option) => {
                                            field.onChange(option.map(item => item.value));
                                        }}
                                    />
                                }
                            />
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

export default ProductModal