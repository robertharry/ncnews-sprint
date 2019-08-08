const {fetchEndpoints} = require('../models/api-model')

exports.sendApiRoutes = (req, res, next) => {
    
    fetchEndpoints()
    .then(endpoints => {
        res.status(200).send(endpoints)
    })   
}