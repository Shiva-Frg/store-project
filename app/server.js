const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const { AllRoutes } = require('./router/router')

class Application {
  #app = express()
  #DB_URl
  #PORT

  constructor(port, db_url) {
    this.#PORT = port
    this.#DB_URl = db_url
    this.createServer()
    this.configApplication()
    this.connectToMongoDb()
    this.createRoutes()
    this.errorHandling()
  }

  configApplication() {
    this.#app.use(express.json())
    this.#app.use(express.urlencoded({ extended: true }))
    this.#app.use(express.static(path.join(__dirname, '..', 'public')))
  }

  createServer() {
    const http = require('http')
    http
      .createServer(this.#app)
      .listen(this.#PORT, () =>
        console.log('server run on: http://localhost:' + this.#PORT)
      )
  }

  connectToMongoDb() {
    mongoose
      .connect(this.#DB_URl)
      .then(() => console.log('server connected to mongodb'))
      .catch((err) => {
        throw err
      })
  }

  createRoutes() {
    this.#app.use(AllRoutes)
  }

  errorHandling() {
    this.#app.use((req, res, next) => {
      res.status(404).json({
        statusCode: res.statusCode,
        message: 'Not Found!',
      })
    })

    this.#app.use((error, req, res, next) => {
      const statusCode = error.status || 500
      const message = error.message || 'internalServerError'
      res.json({
        statusCode,
        message,
      })
    })
  }
}

module.exports = Application
