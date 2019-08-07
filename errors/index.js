exports.pathError = (req, res, next) => {
    res.status(404).send({msg: 'Path does not exist'})
}

exports.send405Error = (req, res, next) => {
    res.status(405).send({msg: 'Method not allowed!'})
};

exports.customErrors = (err, req, res, next) => {
    //console.log(err.msg)
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
    //console.log(err)
    const errCodes = {
        '22P02': 'Bad request',
        '23503': 'Not found in table',
        '42703': 'Cannot sort by column that does not exist'
    }
    if (errCodes[err.code]) {
        res.status(400).send({ msg: errCodes[err.code] })
    }else next(err)
};

exports.otherErrors = (err, req, res, next) => {
    res.status(500).send({msg: 'Unhandled server error'})
}