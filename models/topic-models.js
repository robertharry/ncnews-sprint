const connection = require('../db/connection');

exports.fetchTopics = () => {
    return connection
    .select('*')
    .from('topics')
};

exports.addTopic = (body) => {
    return connection('topics')
    .insert(body)
    .returning('*')
    .then(topic => {
        if(!topic[0].slug.length){
            return Promise.reject({status:400, msg:'No topic inserted'})
        } else return topic
    })
};