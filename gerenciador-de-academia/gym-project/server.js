const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')

const server = express()

server.set("view engine", "html")

nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})

//habilitar o req.body
server.use(express.urlencoded({ extended: true }))
server.use(express.static("public"))
server.use(routes)

server.listen(5000, function() {

})