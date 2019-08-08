const {fetchEndpoints} = require('../models/api-model')

exports.sendApiRoutes = (req, res, next) => {
    
    fetchEndpoints()
    .then(endpoints => {
        console.log(endpoints, '<--- endpoint')
        res.status(200).send(endpoints)
    })
    .catch(next)
}