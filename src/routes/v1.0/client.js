const express = require('express');
const router = express.Router();

const {deleteClients, getClients, postClients} = require('../../controller/client')
const {CLIENT} = require('../../constants/APICONSTANTS')

router.route(CLIENT)
    /*
    * GET clients/	List out all clients or
    * GET clients?q=[term]	Search for a client (based on id/ name/ CIN/ email)
    * */

    .get(getClients.getAllClients)

    /**
     * POST clients/	Create a new client
     */
    .post(postClients.addNewClient)

router.route(`${CLIENT}/:client-id`)
    /**
     * GET clients/[id]	Show one client
     */
    .get(getClients.getClient)
    /**
     * POST clients/[id]	Update a client
     */
    .post(postClients.updateClient)
    /**
     * DELETE clients/[id]	Delete a client
     */
    .delete(deleteClients.deleteClient)

module.exports = router;
