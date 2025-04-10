import { useCallback, useEffect, useMemo, useState } from "react"
import { Badge, Table } from "react-bootstrap"
import { Controller } from "react-hook-form"
import toast from "react-hot-toast"
import { Range } from "react-range"
import { useDebouncedCallback } from "use-debounce"
import useFilter, { useDeleteProduct, useDeleteProducts } from "../../actions/products/product.action"
import { useGetProductsQuery } from "../../api/products/products.api"
import Button from "../../components/Button/Button"
import Checkbox from "../../components/form/Checkbox/Checkbox"
import Select from "../../components/form/Select/Select"
import ProductModal from "../../components/modals/ProductModal"
import ViewProduct from "../../components/modals/ViewProduct"
import CustomPagination from "../../components/Pagination/Pagination"
import Spinner from "../../components/Spinner/Spinner"
import usePermissions from "../../hooks/usePermission"
import { useUpdate } from "../../hooks/useSearch"
import { API_STATUS, CATEGORIES, LIMIT_OPTIONS, PRICE, STATUS_OPTIONS, TAGS } from "../../utils/constants"
import { getBadge, getFilteredValues, getSelectDefaultValue } from "../../utils/utils"

const Products = () => {
    const [show, setShow] = useState(false);
    const [view, setView] = useState(false);
    const [id, setId] = useState("");
    const [ids, setIds] = useState<string[]>([]);
    const [rangeValues, setRangeValues] = useState([PRICE.MIN, PRICE.MAX]);
    const { canCreate, canDelete, canEdit, canView } = usePermissions("product");
    const { control, handlePage, setValue, values, reset } = useFilter();
    const handleUpdateSearch = useUpdate();
    const { data, status, refetch } = useGetProductsQuery(values);
    const allSelected = useMemo(() => data?.products && data.products.length === ids.length, [ids, data])
    const { handleDelete, loading: deleteProductLoading } = useDeleteProduct(() => {
        setId("");
        refetch();
    });
    const { handleDeleteProducts, loading: deleteProductsLoading } = useDeleteProducts(() => {
        setIds([]);
        refetch();
    });
    const loading = useMemo(() => status === API_STATUS.PENDING, [status]);

    const handleCloseProductModal = useCallback((shouldRefetch = false) => {
        setShow(false);
        setId("");
        if (shouldRefetch) {
            refetch();
        }
    }, [refetch])

    const handleCloseViewModal = useCallback(() => setView(false), [])

    const handleReset = useDebouncedCallback(() => {
        reset();
        setRangeValues([PRICE.MIN, PRICE.MAX])
        handleUpdateSearch("search", "", true);
    }, 300)

    const handleSelectProduct = useCallback((id: string) => {
        setIds(ids => getFilteredValues(ids, id));
    }, [setIds, getFilteredValues])

    const handleSelectAll = useCallback(() => {
        if (data?.products) {
            setIds(ids => data.products.length === ids.length ? [] : data?.products.map(item => item._id))
        } else {
            toast.error("There's no record to select")
        }
    }, [setIds, data])

    useEffect(() => {
        setIds([])
    }, [data?.products, setIds])

    return (
        <div>
            <h2>Products - {loading ? <Spinner /> : data?.total}</h2>
            <div className="d-flex my-4 gap-3 align-items-center">
                <Controller
                    control={control}
                    name="categories"
                    render={({ field }) => (
                        <Select
                            options={CATEGORIES}
                            onChange={(option) => {
                                field.onChange(option.map(item => item.value))
                            }}
                            value={getSelectDefaultValue(CATEGORIES, field.value)}
                            isMulti
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <Select
                            onChange={(option) => field.onChange(option?.value)}
                            options={[{ value: "", label: "All", }, ...STATUS_OPTIONS]}
                            value={getSelectDefaultValue([{ value: "", label: "All", }, ...STATUS_OPTIONS], field.value)}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="limit"
                    render={({ field }) => (
                        <Select
                            onChange={option => {
                                field.onChange(option?.value);
                                setValue("page", 1);
                            }}
                            options={LIMIT_OPTIONS}
                            value={getSelectDefaultValue(LIMIT_OPTIONS, field.value)}
                        />
                    )}
                />
                <div style={{ width: 300 }} className="ms-5">
                    <p className="d-flex justify-content-between"><span>{values.min_price}</span><span>{values.max_price}</span></p>
                    <Range
                        label="Price Range"
                        min={PRICE.MIN}
                        max={PRICE.MAX}
                        values={rangeValues}
                        onChange={(values) => {
                            setRangeValues(values);
                        }}
                        onFinalChange={(values) => {
                            setValue("min_price", values[0]);
                            setValue("max_price", values[1]);
                        }}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: "6px",
                                    width: "100%",
                                    backgroundColor: "#ccc",
                                }}
                            >
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div
                                {...props}
                                key={props.key}
                                style={{
                                    ...props.style,
                                    height: "24px",
                                    width: "24px",
                                    backgroundColor: "#999",
                                }}
                            />
                        )}
                    />
                </div>
                <Button onClick={handleReset} className="ms-auto">Reset</Button>
                {canCreate && <Button onClick={() => setShow(true)} className="ms-auto">Create</Button>}
                {(canDelete && ids.length > 0) && (deleteProductsLoading ? <Spinner /> : <Button onClick={() => handleDeleteProducts(ids)} className="ms-auto">Delete Selected</Button>)}
            </div>
            <div className="d-flex my-4 gap-3 align-items-center">
                <Controller
                    control={control}
                    name="is_premium"
                    render={({ field }) => <Checkbox {...field} checked={field.value} value="true" label={"Is Premium"} />}
                />
            </div>
            <div className="d-flex my-4 gap-3 align-items-center">
                <Controller
                    control={control}
                    name="in_stock"
                    render={({ field }) => <Checkbox {...field} checked={field.value} value="true" label={"Is in stock"} />}
                />
            </div>
            <div className="d-flex my-4 gap-3 align-items-center">
                <Controller
                    control={control}
                    name="rating"
                    render={({ field }) => (
                        <>
                            {Array.from({ length: 5 }, (_, k) => {
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
                            })}
                            {field.value > 0 && <button type="button" onClick={() => field.onChange(0)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>}
                        </>
                    )}
                />
            </div>
            <div className="d-flex gap-4 my-3">
                {
                    TAGS.map(item => {
                        return <Controller
                            name="tags"
                            control={control}
                            key={item.value}
                            render={({ field }) => {
                                const onChange = () => {
                                    field.onChange(getFilteredValues(values.tags, item.value))
                                    setValue("page", 1);
                                }
                                return <Checkbox name="tags" onChange={onChange} value={item.value} id={field.name + item.value} label={item.label} />
                            }}
                        />
                    })
                }
            </div>
            <Table responsive>
                <thead>
                    <tr>
                        <th><Checkbox onChange={handleSelectAll} checked={allSelected} /></th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ?
                            <tr>
                                <td colSpan={7}>
                                    <Spinner />
                                </td>
                            </tr>
                            :
                            (data?.products && data?.products.length > 0) ?
                                data?.products.map((item) => {
                                    return (
                                        <tr key={item._id}>
                                            <td>
                                                <Checkbox checked={ids.includes(item._id)} onChange={() => handleSelectProduct(item._id)} />
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>{item.price}</td>
                                            <td>{item.category}</td>
                                            <td>
                                                <Badge className={getBadge(item.status)}>{item.status}</Badge>
                                            </td>
                                            <td>
                                                {canEdit && <Button onClick={() => { setShow(true); setId(item._id) }}>Edit</Button>}
                                                {canView && <Button onClick={() => { setView(true); setId(item._id) }}>View</Button>}
                                                {canDelete && (deleteProductLoading && id === item._id) ? <Spinner /> : <Button onClick={() => { handleDelete(item._id); setId(item._id) }}>Delete</Button>}
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan={7}>No Record found</td>
                                </tr>
                    }
                </tbody>
            </Table>
            {
                (data && !loading) &&
                <CustomPagination
                    total={data.total}
                    limit={data.limit}
                    page={data.page}
                    onChange={handlePage}
                    onNext={handlePage}
                    onPrev={handlePage}
                />
            }
            {show && <ProductModal id={id} show={show} handleClose={handleCloseProductModal} />}
            {view && <ViewProduct id={id} show={view} handleClose={handleCloseViewModal} />}
        </div>
    )
}

export default Products