const mongoose = require('mongoose')

const friendsSchema = mongoose.Schema({
  user: { type: String, required: true },
  friends: { type: [String] }
})

module.exports = mongoose.model('Friends', friendsSchema)
