import { Pagination } from "react-bootstrap"
import { useDebouncedCallback } from "use-debounce"

type PropTypes = {
    total: number,
    limit?: number,
    onChange: (page: number) => void,
    onPrev?: (page: number) => void,
    onNext?: (page: number) => void,
    page: number,
}

const CustomPagination = ({ total, limit = 10, onChange, onPrev, onNext, page }: PropTypes) => {
    const debounceOnChange = useDebouncedCallback(page => onChange(page), 300)
    const debounceOnPrev = useDebouncedCallback(page => onPrev && onPrev(page), 300)
    const debounceOnNext = useDebouncedCallback(page => onNext && onNext(page), 300)
    const totalPages = Math.ceil(total / limit);
    return totalPages > 0 &&
        (
            <Pagination className="justify-content-center mb-5">
                {onPrev && <Pagination.Prev disabled={page === 1} onClick={() => debounceOnPrev(page - 1)} />}
                {
                    Array.from({ length: totalPages }).map((_, i) => (
                        <Pagination.Item key={i} onClick={() => {
                            debounceOnChange(i + 1)
                        }} active={page === (i + 1)}>{i + 1}</Pagination.Item>
                    ))
                }
                {onNext && <Pagination.Next disabled={page === totalPages} onClick={() => debounceOnNext(page + 1)} />}
            </Pagination>
        )
}

export default CustomPagination