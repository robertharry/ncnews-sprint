const connection = require('../db/connection');

exports.selectUserById = (username) => {
    return connection
    .select('*')
    .from('users')
    .where('username', username)
    .then(user => {
        if(!user.length){ 
            return Promise.reject({status: 404, msg: 'Not found'}) 
        } else return user
    })
}