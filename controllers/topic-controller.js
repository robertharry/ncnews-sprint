const { fetchTopics, addTopic } = require('../models/topic-models')

exports.getTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics })
        })
        .catch(next)
};

exports.postTopic = (req, res, next) => {
    const body = req.body
    addTopic(body)
        .then(([topic]) => {
            res.status(201).send({ topic })
        })
        .catch(next)
};