const randomString = () => {
    const length = 21
    const chars = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
exports.randomString = randomString

exports.newClient = () => {

    return {
        "contactDetail": {
            "state": " KARNATAKA",
            "zipCode": "560094",
            "country": "INDIA",
            "address": "3RD FLOOR, NO.10.OLD NO.236 SANJAYNAGAR,RMV EXTENSION 2ND STAGE BANGALORE BANGALORE KA 560094 IN ",
            "email": "contact@web2net.in"
        },
        "profileUrl": "https://www.companydetails.in/company/aaruhi-financial-services-private-limited",
        "name": "rajesh FINANCIAL SERVICES PRIVATE LIMITED",
        "activity": "ACTIVITIES AUXILIARY TO FINANCIAL INTERMEDIATION",
        "CIN": randomString(),
        "registrationDate": "2021-08-02T18:30:00.000Z",
        "category": "COMPANY LIMITED BY SHARES",
        "subCategory": "NON-GOVT COMPANY",
        "class": "super",
        "ROC": "bg",
        "status": "ACTIVE",
        "isCompanyListed": "UnListed",
        "authorizedCapital": 1000000,
        "paidUpCapital": 100000
    }
}