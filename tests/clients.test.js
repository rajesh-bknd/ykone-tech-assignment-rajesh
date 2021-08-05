const path = require('path')
require('dotenv').config({path: path.join(__dirname, "../", ".env")})

const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)
const {newClient,randomString} = require('./data/clients')
const {CLIENTS} = require('../src/constants/APICONSTANTS')
const connection = require('../src/database/mongo')
const mongoose = require('mongoose');

afterAll(() => {
    // close mongo database connection after all tests
    mongoose.connection.close()
})
describe(`Create and get client`, () => {
    let CIN = null
    test(`Creat client`, async () => {
        const response = await request.post(CLIENTS).send(newClient()).set('Accept', 'application/json')
        const body = response.body
        expect(response.status).toBe(201)
        expect(body.status).toEqual('success')
        expect(body.data).toBeDefined()
        expect(body.data._id).toBeDefined()
        expect(body.data.CIN).toBeDefined()
        CIN = body.data.CIN
    })
    test(`Get client by CIN `, async () => {
        const response = await request.get(`${CLIENTS}/${CIN}`).send(newClient()).set('Accept', 'application/json')
        const body = response.body
        expect(response.status).toBe(200)
        expect(body.status).toEqual('success')
        expect(body.data).toBeDefined()
        expect(body.data._id).toBeDefined()
        expect(body.data.CIN).toEqual(CIN)
    })
    test(`Update client by CIN`, async () => {
        const client = newClient()
        client.subCategory = randomString()
        client.name = randomString()
        const response = await request.post(`${CLIENTS}/${CIN}`).send(client).set('Accept', 'application/json')
        const body = response.body
        expect(response.status).toBe(200)
        expect(body.status).toEqual('success')
        expect(body.data).toBeDefined()
        expect(body.data.nModified).toBeDefined()
        expect(body.data.nModified).toBeGreaterThan(0)
    })
    test(`Delete a client by CIN `, async () => {
        const client = newClient()
        client.subCategory = randomString()
        client.name = randomString()
        const response = await request.delete(`${CLIENTS}/${CIN}`).set('Accept', 'application/json')
        const body = response.body
        expect(response.status).toBe(200)
        expect(body.status).toEqual('success')
        expect(body.data).toBeDefined()
        expect(body.data.deletedCount).toBeDefined()
        expect(body.data.deletedCount).toBeGreaterThan(0)
    })
    test(`Get client by CIN `, async () => {
        const response = await request.get(`${CLIENTS}/${CIN}`).send(newClient()).set('Accept', 'application/json')
        const body = response.body
        expect(response.status).toBe(200)
        expect(body.status).toEqual('failed')
        expect(body.message).toEqual(`No data found`)
    })
})