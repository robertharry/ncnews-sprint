const express = require('express');
const app = express();
const apiRouter = require('./routers/api-router');
const { customErrors, psqlErrors, otherErrors, send405Error} = require('./errors/index')
const cors = require('cors');
app.use(express.json());
app.use(cors());

app.use('/api', apiRouter).all(send405Error)


app.use(customErrors)
app.use(psqlErrors)
app.use(otherErrors)

module.exports = app;