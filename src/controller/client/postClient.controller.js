const {ResponseModel} = require('../../models/response.model')
const {clientSchema, columns} = require('../../models/clients.model')
const {handlePromise} = require('../../util/util')
const {CREATED} = require('http-status-codes')
const {validateClientSchema} = require('../../validation/client.validation')
const {validationResult} = require('express-validator')
const express = require('express')
/**
 * function add new client information
 * CIN number should be unique
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<{data: null, message: null, error: {errorDescription: null, errorTitle: null}, status: string}>}
 */
exports.addNewClient = async (req, res, next) => {
    const responseModel = ResponseModel()
    const body = req.body
    const {error} = validateClientSchema(body)
    if (error) {
        throw error
    }
    const [result, queryError] = await handlePromise(clientSchema.create(body))
    if (queryError) {
        responseModel.status = `failed`
        responseModel.error.errorTitle = queryError.message
        responseModel.message = `Failed to add profile`
        return responseModel
    }
    // if result has value and _id key present in result object
    if (result && columns.ID in result) {
        responseModel.status = `success`
        responseModel.message = `${body[columns.NAME]} - profile has been successfully added`
        responseModel.data = {
            [columns.ID]: result[columns.ID],
            [columns.CIN]: result[columns.CIN]
        }
        // set status to 201
        res.status(CREATED)
        return responseModel
    }
    throw queryError
}
/**
 * function update existing client information
 * CIN number should present in database in order to update
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<{data: null, message: null, error: {errorDescription: null, errorTitle: null}, status: string}>}
 */
exports.updateClient = async (req, res, next) => {
    const responseModel = ResponseModel()
    const body = req.body
    const cin = req.params["clientId"]
    delete body[columns.ID]
    delete body["__v"]
    const {error} = validateClientSchema(body)
    if (error) {
        throw error
    }
    // do not update CIN
    delete body[columns.CIN]

    const [result, queryError] = await handlePromise(
        clientSchema.updateOne({
                [columns.CIN]: cin
            }, {$set: body}
        ))
    if (queryError) {
        responseModel.status = `failed`
        responseModel.error.errorTitle = queryError.message
        responseModel.message = `Failed to update data`
        return responseModel
    }
    if (result) {
        responseModel.status = `success`
        responseModel.data = result
        // when profile matched and no changes available to update
        if (result.n > 0 && result.ok > 0) {
            responseModel.message = `Zero changes to update`
        }
        // when CIN is not matched with profiles
        if (result.n === 0) {
            responseModel.message = `Zero profiles found for CIN ${cin} to update`
        }
        // when profile updated successfully
        if (result.nModified > 0) {
            responseModel.message = `Profile has been updated successfully`
        }
        return responseModel
    }
    throw queryError
}