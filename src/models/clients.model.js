const mongoose = require('mongoose')
const CLIENT_SCHEMA = `clients`
const COLUMNS = {
    ID: "_id",
    NAME: "name",
    ACTIVITY: "activity",
    CIN: "CIN",
    REGISTRATION_DATE: "registrationDate",
    CATEGORY: "category",
    SUB_CATEGORY: "subCategory",
    CLASS: "class",
    ROC: "ROC",
    STATUS: "status",
    IS_COMPANY_LISTED: "isCompanyListed",
    AUTHORIZED_CAPITAL: "authorizedCapital",
    PAID_UP_CAPITAL: "paidUpCapital",
    CONTACT_DETAIL: "contactDetail",
    STATE: "state",
    ZIP_CODE: "zipCode",
    ADDRESS: "address",
    EMAIL: "email",
    COUNTRY: "country"
}
const clientSchema = new mongoose.Schema({
    [COLUMNS.NAME]: {
        "type": "String",
        "required": true
    },
    [COLUMNS.ACTIVITY]: {
        "type": "String"
    },
    [COLUMNS.CIN]: {
        "type": "String",
        "required": true,
        "unique": true
    },
    [COLUMNS.REGISTRATION_DATE]: {
        "type": "Date"
    },
    [COLUMNS.CATEGORY]: {
        "type": "String"
    },
    [COLUMNS.SUB_CATEGORY]: {
        "type": "String"
    },
    [COLUMNS.CLASS]: {
        "type": "String"
    },
    [COLUMNS.ROC]: {
        "type": "String"
    },
    [COLUMNS.STATUS]: {
        "type": "String"
    },
    [COLUMNS.IS_COMPANY_LISTED]: {
        "type": "String"
    },
    [COLUMNS.AUTHORIZED_CAPITAL]: {
        "type": "Number"
    },
    [COLUMNS.PAID_UP_CAPITAL]: {
        "type": "Number"
    },
    [COLUMNS.CONTACT_DETAIL]: {
        [COLUMNS.STATE]: {
            "type": "String"
        },
        [COLUMNS.ZIP_CODE]: {
            "type": "String",
            "required": true,
        },
        [COLUMNS.COUNTRY]: {
            "type": "String"
        },
        [COLUMNS.ADDRESS]: {
            "type": "String"
        },
        [COLUMNS.EMAIL]: {
            "type": "String"
        }
    }
})

module.exports = {
    columns: COLUMNS,
    clientSchemaName: CLIENT_SCHEMA,
    clientSchema: mongoose.model(CLIENT_SCHEMA, clientSchema)
}
