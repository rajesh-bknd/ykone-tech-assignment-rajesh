const Joi = require('joi')

const clientValidationSchema = Joi.object({
    "name": Joi.string().regex(/^[A-Z a-z0-9&]+$/).required().trim(),
    "profileUrl": Joi.string().uri().required(),
    "activity": Joi.string().trim(),
    "CIN": Joi.string().alphanum().regex(/^[A-Za-z0-9]+$/).length(21).required().trim(),
    "registrationDate": Joi.date(),
    "category": Joi.string().trim(),
    "subCategory": Joi.string().trim(),
    "class": Joi.string().trim(),
    "ROC": Joi.string().trim(),
    "status": Joi.string().trim(),
    "isCompanyListed": Joi.string().trim(),
    "authorizedCapital": Joi.number(),
    "paidUpCapital": Joi.number(),
    "contactDetail": {
        "state": Joi.string().trim(),
        "zipCode": Joi.string().length(6).required(),
        "country": Joi.string().trim(),
        "address": Joi.string().trim(),
        "email": Joi.string().email({tlds: {allow: false}})
    }
})

exports.validateClientSchema = (client) => {
    return clientValidationSchema.validate(client)
}