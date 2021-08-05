const {OK, INTERNAL_SERVER_ERROR} = require('http-status-codes')
const logger = require('../logger/logger')
const {ResponseModel} = require('../models/response.model')
module.exports = (controller) => {
    return async (req, res, next) => {
        try {
            res.status(OK)
            let result = await controller(req, res)
            res.json(result)
        } catch (error) {
            // hand
            if (error && "__proto__" in error && error.__proto__.isJoi) {
                const responseModel = ResponseModel()
                responseModel.status = "failed"
                responseModel.error.errorTitle = error.__proto__.name
                responseModel.error.errorDescription = error.message
                return res.status(200).json(responseModel);
            }
            logger.error({
                service: "RestAPI",
                title: `Controller ${req.url}`,
                data: {
                    url: req.url,
                    query: req.query,
                    params: req.params,
                    headers: req.headers,
                    body: req.body
                },
                error: JSON.stringify(error),
                message: error.message,
                stackTrace: error.stackTrace
            })
            res.status(INTERNAL_SERVER_ERROR).send({message: error.message});
        }
    }
}