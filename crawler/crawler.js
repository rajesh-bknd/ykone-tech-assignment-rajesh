const cheerio = require('cheerio')
const axios = require('axios').default
const {handlePromise} = require('./util')
const homePageUrl = () => `https://www.companydetails.in/latest-registered-company-mca`
const clientPageUrl = (clientId) => `https://companydetails.in/company/${clientId}`

const loadHomePage = async (url) => {
    const [response, error] = await handlePromise(axios.get(url))
    if (error) {
        throw error
    }
    if (response && response.status === 200) {
        let clientList = parseClientsList(response.data)
        clientList = clientList.slice(0, 1)
        clientList = await clientList.map(async client => {
            const profileInfo = await parseClientProfileInfo(client.profileUrl)
            console.log(profileInfo)
        })
    }
}
const parseClientProfileInfo = async (profileUrl) => {
    const [response, error] = await handlePromise(axios.get(profileUrl))
    if (error) {
        throw error
    }
    if (response && response.status === 200) {
        const profileInfo = {}
        const $ = cheerio.load(response.data)

        /*profileInfo["description"] = $(`#form1 > div > div > div > div > div > div > div > div.col-sm-12`).first().text()
        profileInfo["description"] = profileInfo["description"].toString().trim().replace(/\n/g, " ");
       */

        profileInfo["name"] = $(`#basic_details > tbody > tr:nth-child(1) > td`).first().text()
        profileInfo["name"] = profileInfo["name"].toString().trim()

        profileInfo["activity"] = $(`#basic_details > tbody > tr:nth-child(2) > td`).first().text()
        profileInfo["activity"] = profileInfo["activity"].toString().trim()

        profileInfo["CIN"] = $(`#basic_details > tbody > tr:nth-child(3) > td`).first().text()
        profileInfo["CIN"] = profileInfo["CIN"].toString().trim()

        profileInfo["registrationDate"] = $(`#basic_details > tbody > tr:nth-child(4) > td`).first().text()
        profileInfo["registrationDate"] = profileInfo["registrationDate"].toString().trim()

        profileInfo["category"] = $(`#basic_details > tbody > tr:nth-child(5) > td`).first().text()
        profileInfo["category"] = profileInfo["category"].toString().trim()

        profileInfo["subCategory"] = $(`#basic_details > tbody > tr:nth-child(6) > td`).first().text()
        profileInfo["subCategory"] = profileInfo["subCategory"].toString().trim()

        profileInfo["class"] = $(`#basic_details > tbody > tr:nth-child(7) > td`).first().text()
        profileInfo["class"] = profileInfo["class"].toString().trim()

        profileInfo["ROC"] = $(`#company_status > tbody > tr:nth-child(1) > td`).first().text()
        profileInfo["ROC"] = profileInfo["ROC"].toString().trim()

        profileInfo["status"] = $(`#company_status > tbody > tr:nth-child(2) > td > span`).first().text()
        profileInfo["status"] = profileInfo["status"].toString().trim()

        profileInfo["isCompanyListed"] = $(`#company_status > tbody > tr:nth-child(3) > td`).first().text()
        profileInfo["isCompanyListed"] = profileInfo["isCompanyListed"].toString().trim()
        console.log(profileInfo)


    }
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

        // client name
        clientInfo["name"] = nameElement.first().text()
        clientInfo["name"] = clientInfo["name"].toString().trim()

        // client state
        clientInfo["state"] = $(this).find(`td:nth-child(2) a`).first().text()
        clientInfo["state"] = clientInfo["state"].toString().trim()

        //client updated date
        clientInfo["updatedDate"] = $(this).find(`td:nth-child(3)`).first().text()
        clientInfo["updatedDate"] = clientInfo["updatedDate"].toString().trim()

        clientList.push(clientInfo)
    })
    return clientList
}

loadHomePage(homePageUrl()).then(console.table).catch(error => {
    console.error(error)
})