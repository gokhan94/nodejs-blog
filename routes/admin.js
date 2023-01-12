const express = require('express')
const router = express.Router()
const {authorizePermissions} = require('../middleware/authentication')


router.get('/', authorizePermissions('admin'), (req, res) => {
    return res.json({ user: req.user });
})

module.exports = router