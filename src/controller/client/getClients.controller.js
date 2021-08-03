const {columns, clientSchema} = require('../../models/clients.model')
const {OK} = require('http-status-codes')
const _ = require('lodash')
const {ResponseModel} = require('../../models/response.model')

const getFilterQuery = (query) => {
    const filterQuery = {}
    for (const key of _.keys(query)) {
        switch (key) {
            case columns.CIN: {
                filterQuery[columns.CIN] = query[columns.CIN]
                break
            }
            case columns.NAME: {
                filterQuery[columns.NAME] = {$regex: new RegExp(query[columns.NAME]), $options: 'i'}
                break
            }
            case columns.EMAIL: {
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
exports.getAllClients = async (req, res, next) => {
    const responseModel = ResponseModel()
    const query = req.query
    const filterQuery = getFilterQuery(query)
    const result = await clientSchema.find(filterQuery)
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

exports.searchClient = (req, res, next) => {

}
