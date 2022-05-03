var express = require('express');
var router = express.Router();
const axios = require('axios').default;


router.get('/hydrants', async function(req, res) {

    let url = "https://www.gatineau.ca/upload/donneesouvertes/Lieux%20publics%20norme.json";
    let aResponse = await axios.get(url);

    res.header("Content-Type", "application/json");
    res.send(aResponse.data);

});

module.exports = router;