const path = require('path')
require('dotenv').config({path: path.join(__dirname, "../", ".env")})

const cheerio = require('cheerio')
const axios = require('axios').default
const {handlePromise} = require('./util')

// import logs
const logger = require('../src/logger/logger')

// connect to mongo database
const mongo = require('../src/database/mongo')
mongo.connect()
const {clientSchema, columns} = require('../src/models/clients.model')
const {validateClientSchema} = require('../src/validation/client.validation')

// number of parallel requests to website
const parallelCount = 1

const homePageUrl = () => `https://www.companydetails.in/latest-registered-company-mca`

const loadHomePage = async (url) => {
    const [response, error] = await handlePromise(axios.get(url))
    if (error) {
        logger.error({
            service: "crawler",
            data: {url: url},
            error: JSON.stringify(error),
            message: error.message,
            stackTrace: error.stackTrace
        })
        throw error
    }
    if (response && response.status === 200) {
        let clientList = parseClientsList(response.data)
        let bufferedClientList = []
        // chunk companies, so that crawling can be grouped
        for (let i = 0; i < clientList.length; i = i + parallelCount) {
            bufferedClientList.push(clientList.slice(i, i + parallelCount))
        }
        clientList = []
        for (let chunkedClientList of bufferedClientList) {
            chunkedClientList = await Promise.all(chunkedClientList.map(client => parseClientProfileInfo(client.profileUrl)))
            chunkedClientList.forEach(client => {
                // validate client profile information
                const {error} = validateClientSchema(client)
                if (error) {
                    logger.error({
                        service: "crawler",
                        title: `parseClientProfileInfo ${url}`,
                        data: {profileUrl: url},
                        error: JSON.stringify(error),
                        message: error.message,
                    })
                } else {
                    // upsert client profile info using CIN
                    clientSchema.updateOne({[columns.CIN]: client[columns.CIN]}, {$set:{...client}}, {upsert: true}).catch(error => {
                        logger.error({
                            service: "crawler",
                            title: `parseClientProfileInfo ${url}`,
                            data: {profileUrl: url},
                            error: JSON.stringify(error),
                            message: error.message,
                        })
                    })
                }
            })
            clientList.push(...chunkedClientList)
        }
    }
    return true
}
const parseClientProfileInfo = async (profileUrl) => {
    console.log(`Parsing profile info for ${profileUrl}`)
    const profileInfo = {}
    const [response, error] = await handlePromise(axios.get(profileUrl))
    if (response && response.status === 200) {
        const $ = cheerio.load(response.data)
        profileInfo["profileUrl"] = profileUrl
        profileInfo["name"] = $(`#basic_details > tbody > tr:nth-child(1) > td`).first().text()

        profileInfo["activity"] = $(`#basic_details > tbody > tr:nth-child(2) > td`).first().text()

        profileInfo["CIN"] = $(`#basic_details > tbody > tr:nth-child(3) > td`).first().text()

        profileInfo["registrationDate"] = $(`#basic_details > tbody > tr:nth-child(4) > td`).first().text()

        profileInfo["category"] = $(`#basic_details > tbody > tr:nth-child(5) > td`).first().text()

        profileInfo["subCategory"] = $(`#basic_details > tbody > tr:nth-child(6) > td`).first().text()

        profileInfo["class"] = $(`#basic_details > tbody > tr:nth-child(7) > td`).first().text()

        profileInfo["ROC"] = $(`#company_status > tbody > tr:nth-child(1) > td`).first().text()

        profileInfo["status"] = $(`#company_status > tbody > tr:nth-child(2) > td > span`).first().text()

        profileInfo["isCompanyListed"] = $(`#company_status > tbody > tr:nth-child(3) > td`).first().text()

        profileInfo["authorizedCapital"] = $(`#company_fin > tbody > tr:nth-child(1) > td`).first().text()

        profileInfo["paidUpCapital"] = $(`#company_fin > tbody > tr:nth-child(2) > td`).first().text()

        const contactDetail = {}
        contactDetail["state"] = $(`#company_contactdetails > tbody > tr:nth-child(1) > td > a`).first().text()
        contactDetail["zipCode"] = $(`#company_contactdetails > tbody > tr:nth-child(2) > td`).first().text()
        contactDetail["country"] = $(`#address`).first().text()
        contactDetail["address"] = $(`#company_contactdetails > tbody > tr:nth-child(4) > td`).first().text()
        contactDetail["email"] = $(`#company_contactdetails > tbody > tr:nth-child(5) > td`).first().text()
        profileInfo["contactDetail"] = contactDetail
    } else {
        logger.error({
            service: "crawler",
            title: `parseClientProfileInfo ${profileUrl}`,
            data: {
                profileUrl: profileUrl
            },
            error: JSON.stringify(error),
            message: error.message,
            stackTrace: error.stackTrace
        })
    }
    return profileInfo
}

/**
 * @param {string} html
 * @returns {Object[]}
 */
const parseClientsList = (html) => {
    const clientList = []
    const $ = cheerio.load(html)
    const clientRows = $(`#ContentPlaceHolder1_GridView1 > tbody`).find('tr')
    clientRows.each(function (index, row) {
        const clientInfo = {}

        const nameElement = $(this).find(`td:nth-child(1) a`)

        // client profile url
        clientInfo["profileUrl"] = nameElement.first().attr("href")
        clientInfo["profileUrl"] = clientInfo["profileUrl"].toString().trim()

        /*
                // client name
                clientInfo["name"] = nameElement.first().text()
                clientInfo["name"] = clientInfo["name"].toString().trim()

                // client state
                clientInfo["state"] = $(this).find(`td:nth-child(2) a`).first().text()
                clientInfo["state"] = clientInfo["state"].toString().trim()

                //client updated date
                clientInfo["updatedDate"] = $(this).find(`td:nth-child(3)`).first().text()
                clientInfo["updatedDate"] = clientInfo["updatedDate"].toString().trim()
        */
        clientList.push(clientInfo)
    })
    return clientList
}
loadHomePage(homePageUrl()).then().catch()
module.exports = {
    loadHomePage,
    homePageUrl
}