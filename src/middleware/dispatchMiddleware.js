const {OK} = require('http-status-codes')
const logger = require('../logger/logger')
module.exports = (controller) => {
    return async (req, res) => {
        try {
            res.status(OK)
            let result = await controller(req, res)
            res.json(result)
        } catch (error) {
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
            res.status(500).send({message: error.message});
        }
    }
}