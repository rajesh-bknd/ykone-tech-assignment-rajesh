const {columns, clientSchema} = require('../../models/clients.model')
const {OK} = require('http-status-codes')
const _ = require('lodash')
const {ResponseModel} = require('../../models/response.model')
const express = require("express");

/**
 * this function iteration through user given search criteria and applies mongo queries
 * @param {Object} query - search parameters like CIN, name and email
 * @returns {{}}
 */
const getFilterQuery = (query) => {
    const filterQuery = {}
    for (const key of _.keys(query)) {
        switch (key) {
            case columns.CIN: {
                filterQuery[columns.CIN] = query[columns.CIN]
                break
            }
            case columns.NAME: {
                // /*name*/i
                filterQuery[columns.NAME] = {$regex: new RegExp(query[columns.NAME]), $options: 'i'}
                break
            }
            case columns.EMAIL: {
                // /*email*/i
                filterQuery[`${columns.CONTACT_DETAIL}.${columns.EMAIL}`] = {
                    $regex: new RegExp(query[columns.EMAIL]),
                    $options: 'i'
                }
                break
            }
        }
    }
    return filterQuery
}
/**
 * function returns all clients from database or searches for the given parameters
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<{data: null, message: null, error: {errorDescription: null, errorTitle: null}, status: string}>}
 */
exports.getAllClients = async (req, res, next) => {
    const responseModel = ResponseModel()
    const query = req.query
    const filterQuery = getFilterQuery(query)
    // project only required fields
    const result = await clientSchema.find(filterQuery, {
        [columns.CIN]: 1,
        [columns.NAME]: 1,
        [columns.ACTIVITY]: 1,
        [columns.CONTACT_DETAIL]: 1,
        [columns.contactDetail]: 1
    })
    if (result && _.isArray(result)) {
        responseModel.status = "success"
        responseModel.message = `${_.size(result)} results found.`
        responseModel.data = result
        return responseModel
    } else {
        responseModel.status = "failed"
        return responseModel
    }
}
/**
 * function retrieves client information for the given CIN
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<{data: null, message: null, error: {errorDescription: null, errorTitle: null}, status: string}>}
 */
exports.getClient = async (req, res, next) => {
    const responseModel = ResponseModel()
    const result = await clientSchema.findOne({[columns.CIN]: req.params["clientId"]})
    if (result && _.isObject(result)) {
        responseModel.status = "success"
        responseModel.message = `Results found`
        responseModel.data = result
        return responseModel
    } else {
        responseModel.status = "failed"
        responseModel.message = `No data found`
        return responseModel
    }
}

