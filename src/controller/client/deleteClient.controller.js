const {ResponseModel} = require('../../models/response.model')
const {clientSchema, columns} = require('../../models/clients.model')
const express = require('express')
/**
 * function deletes client profile for the given CIN
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<{data: null, message: null, error: {errorDescription: null, errorTitle: null}, status: string}>}
 */
exports.deleteClient = async (req, res, next) => {
    const responseModel = ResponseModel()
    const cin = req.params["clientId"]

    const result = await clientSchema.deleteMany({[columns.CIN]: cin})
    if (result) {
        responseModel.status = "success"
        responseModel.data = result
        // when profile has been deleted  successfully
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