const {ResponseModel} = require('../../models/response.model')
const {clientSchema, columns} = require('../../models/clients.model')
const {handlePromise} = require('../../util/util')
const {CREATED} = require('http-status-codes')
exports.addNewClient = async (req, res, next) => {
    const responseModel = ResponseModel()
    const body = req.body
    const [result, error] = await handlePromise(clientSchema.create(body))
    if (error) {
        responseModel.status = `failed`
        responseModel.error.errorTitle = error.message
        responseModel.message = `Failed to add profile`
        return responseModel
    }
    if (result && columns.ID in result) {
        responseModel.status = `success`
        responseModel.message = `Profile has been successfully added`
        responseModel.data = {
            [columns.ID]: result[columns.ID],
            [columns.CIN]: result[columns.CIN]
        }
        res.status(CREATED)
        return responseModel
    }
    throw error
}
exports.updateClient = async (req, res, next) => {
    const responseModel = ResponseModel()
    const body = req.body
    const cin = req.params["clientId"]
    const [result, error] = await handlePromise(
        clientSchema.updateOne({
                [columns.CIN]: cin
            }, {$set: body}
        ))
    if (error) {
        responseModel.status = `failed`
        responseModel.error.errorTitle = error.message
        responseModel.message = `Failed to update data`
        return responseModel
    }
    if (result) {
        responseModel.status = `success`
        responseModel.data = result
        // when profile updated successfully
        if (result.nModified > 0) {
            responseModel.message = `Profile has been updated successfully`
        }
        // when profile matched and no changes available to update
        if (result.n > 0 && result.ok > 0) {
            responseModel.message = `Zero changes to update`
        }
        // when CIN is not matched with profiles
        if (result.n === 0) {
            responseModel.message = `Zero profiles found for CIN ${cin} to update`
        }
        return responseModel
    }
    throw error
}