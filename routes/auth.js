const express = require('express')
const router = express.Router()
const { register, login, forgotPassword, resetPassword, verifyEmail, logout } = require('../controllers/authController')
const { isLoggedIn, authorization } = require('../middleware/authentication')

router.get('/', isLoggedIn, (req, res) => {
    res.render('register', {
        title: 'Register Page'
      })
})

router.post('/register',isLoggedIn, register)

router.get('/login', isLoggedIn, (req, res) => {
  res.render('login', {
      title: 'Login Page'
    })
})

router.post('/login', isLoggedIn, login)

router.get('/logout', authorization, logout)

router.get('/forgot-password', isLoggedIn, (req, res) => {
  res.render('forgotPassword', {
      title: 'Reset Password'
    })
})

router.post('/forgot-password', isLoggedIn, forgotPassword)

router.get('/reset-password', isLoggedIn, async (req, res) => {

 const token = req.query.token
 const email = req.query.email

  res.render('resetPassword', {
      title: 'Reset Password',
      token: token,
      email: email
    })
})

router.post('/reset-password/:token/:email', isLoggedIn, resetPassword)

router.get('/verify-email/:id', verifyEmail)

module.exports = router