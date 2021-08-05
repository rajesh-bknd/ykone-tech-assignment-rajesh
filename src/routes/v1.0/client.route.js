const express = require('express');
const router = express.Router();

const {deleteClients, getClients, postClients} = require('../../controller/client')
const dispatch = require('../../middleware/dispatchMiddleware')

router.route('')
    /*
    * GET clients/	List out all clients or
    * GET clients?q=[term]	Search for a client (based on id/ name/ CIN/ email)
    * */
    .get(dispatch(getClients.getAllClients))
    /**
     * POST clients/    Create a new client
     */
    .post( dispatch(postClients.addNewClient))

router.route(`/:clientId`)
    /*
    * GET clients / [id] Show one client
    *  */
    .get(dispatch(getClients.getClient))
    /*
    * POST clients / [id] Update a client
    * */
    .post(dispatch(postClients.updateClient))
    /**
     * DELETE clients / [id] Delete a client
     */
    .delete(dispatch(deleteClients.deleteClient))


module.exports = router;
