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
    console.log(response)
    if (response && response.status === 200) {
        const clientList = parseClientsList(response.data)

    }
}
const parseClientProfileInfo = async (profileUrl) => {
    const [response,error] = await handlePromise(axios.get(profileUrl))

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