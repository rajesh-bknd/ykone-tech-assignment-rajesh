/**
 * returns base object for response object
 * @returns {{data: null, message: null, error: {errorDescription: null, errorTitle: null}, status: string}}
 * @constructor
 */
exports.ResponseModel = () => {

    return {
        status: "fail",
        message:null,
        data: null,
        error: {
            errorTitle: null,
            errorDescription: null
        }
    }
}