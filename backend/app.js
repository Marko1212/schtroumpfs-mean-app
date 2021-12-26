const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const userRoutes = require('./routes/user')
const friendsRoutes = require('./routes/friends')

const app = express()

const uri = 'mongodb+srv://' +
            process.env.DB_USER + ':' +
            process.env.DB_PASSWORD + '@' +
            process.env.DB_CLUSTER + '/' +
            process.env.DB_NAME + '?retryWrites=true&w=majority'

mongoose.connect(
  uri,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  res.status(200).send('Schtroumpf backend')
})

app.use('/api', userRoutes)
app.use('/api/friends', friendsRoutes)

module.exports = app
