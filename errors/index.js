
exports.send405Error = (req, res, next) => {
    res.status(405).send({msg: 'Method not allowed!'})
};

exports.customErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
    const errCodes = {
        '22P02': 'Bad request'
    }
    if (errCodes[err.code]) {
        res.status(400).send({ msg: errCodes[err.code] })
    }else next(err)
};

exports.otherErrors = (err, req, res, next) => {
    res.status(500).send({msg: 'Unhandled server error'})
}