const Friends = require('../models/Friends')

exports.addFriend = (req, res, next) => {
  Friends.updateOne(
    { user: req.body.email }, { $addToSet: { friends: [req.body.id] } })
    .then(() => res.status(200).json({ message: 'Friend list modified !' }))
    .catch(error => res.status(400).json({ error }))
}

exports.removeFriend = (req, res, next) => {
  Friends.updateOne(
    { user: req.body.email }, { $pullAll: { friends: [req.body.id] } })
    .then(() => res.status(200).json({ message: 'Friend list modified !' }))
    .catch(error => res.status(400).json({ error }))
}

exports.getFriends = (req, res, next) => {
  Friends.findOne({ user: req.params.user })
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }))
}
