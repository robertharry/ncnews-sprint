const connection = require('../db/connection');

exports.selectUserById = (username) => {
    return connection
    .select('*')
    .from('users')
    .where('username', username)
}