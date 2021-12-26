const express = require('express')
const router = express.Router()

const friendsCtrl = require('../controllers/friends')

router.get('/:user', friendsCtrl.getFriends)
router.put('/add', friendsCtrl.addFriend)
router.put('/remove', friendsCtrl.removeFriend)

module.exports = router
