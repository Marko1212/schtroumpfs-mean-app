const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Friends = require('../models/Friends')

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        role: req.body.role
      })
      user.save()
        .then(() => {
          const friends = new Friends({ user: req.body.email })
          friends.save()
            .then(() => res.status(201).json({ message: 'User saved !' }))
            .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Unknown email or password' })
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: 'Unknown email or password' })
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'DLM6q8Ld0J8rrSK41LmG',
              { expiresIn: '24h' }
            ),
            expiresIn: '86400'
          })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getAll = (req, res, next) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error }))
}

exports.getRoles = (req, res, next) => {
  User.find()
    .then(users => res.status(200).json(User.schema.path('role').enumValues))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }))
}

exports.modifyUser = (req, res, next) => {
  if (req.body.password !== '' && req.body.password != null) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        console.log(req.body.password)
        req.body.password = hash
        console.log(req.body.password)
        User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'User modified !' }))
          .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(500).json({ error }))
  } else {
    delete req.body.password
    User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !' }))
      .catch(error => res.status(400).json({ error }))
  }
}
