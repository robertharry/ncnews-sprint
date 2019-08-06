const express = require('express');
const app = express();
const apiRouter = require('./routers/api-router');
const { customErrors, psqlErrors, otherErrors } = require('./errors/index')
app.use(express.json());

app.use('/api', apiRouter)

app.use(customErrors)
app.use(psqlErrors)
app.use(otherErrors)

module.exports = app;