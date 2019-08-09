
exports.send405Error = (req, res, next) => {
    res.status(405).send({ msg: 'Method not allowed!' })
};

exports.customErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
    const errCodes = {
        '22P02': 'Bad request',
        '23503': 'Not found in table',
        '42703': 'Cannot sort by column that does not exist',
        '23502': 'Invalid input'
    }
    if (err.code === '23503') {
        res.status(404).send({ msg: errCodes[err.code] })
    }
    else if (errCodes[err.code]) {
        res.status(400).send({ msg: errCodes[err.code] })
    } else next(err)
};

exports.otherErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Unhandled server error' })
};