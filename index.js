const express = require(`express`)
const logger = require(`morgan`)
const api = express()
const http = require(`http`)
const path = require(`path`)

/* This will allow db to run your api smoothly but it won't break other execution environment */
const host = process.env.HOST || `localhost`
const port = process.env.PORT || process.argv[2] || 1337

const routes = require(`./server.js`)

api.use(logger(`dev`))


api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// api.set(`rdts`, path.join(__dirname, `rdts`))

// Setting routes
api.use(`/`, routes)

api.listen(port, host, function () {
	console.log(`API listening on port ${host}:${port}`)
})