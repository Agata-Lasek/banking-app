export const handleError = (error) => {
    if (error.response) {
        switch (error.response.status) {
            case 400:
            case 401:
            case 403:
                return error.response.data.detail
            case 422:
                return error.response.data.detail[0].msg
        }
    }
    return error.request ? "No response from server, please contact support" : "Something went wrong, please contact support"
}
