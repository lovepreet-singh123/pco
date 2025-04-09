import { Middleware } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";

const errorHandlerMiddleware: Middleware = () => (next) => (action) => {
    return next(action);

    // if (isRejectedWithValue(action)) {
    //     let errorMessage = "An error occurred";
    //     if (action.payload?.status === "FETCH_ERROR") {
    //         errorMessage = "Failed to fetch";
    //     } else if (action.payload?.data?.msg) {
    //         errorMessage = Array.isArray(action.payload.data.msg)
    //             ? action.payload.data.msg[0]
    //             : action.payload.data.msg;
    //     }

    //     toast.error(errorMessage)
    // }
    // return next(action);
};
export default errorHandlerMiddleware;