const {ResponseModel} = require('../../models/response.model')
const {clientSchema, columns} = require('../../models/clients.model')

exports.deleteClient = async (req, res, next) => {
    const responseModel = ResponseModel()
    const cin = req.params["clientId"]
    const result = await clientSchema.deleteOne({[columns.CIN]: cin})
    if (result) {
        responseModel.status = "success"
        responseModel.data  = result
        // when profile  successfully
        if (result.deletedCount > 0) {
            responseModel.message = `Profile has been deleted successfully`
        }
        // when CIN is not matched with profiles
        if (result.n === 0) {
            responseModel.message = `Zero profiles found for CIN ${cin} to delete`
        }
        return responseModel
    } else {
        responseModel.status = "failed"
        responseModel.message = `Unable to delete profile with CIN ${req.params["clientId"]}`
        return responseModel
    }
}