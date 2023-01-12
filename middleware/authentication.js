const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const User = require('../models/User')

const tokenVerify = ( token ) => jwt.verify(token, process.env.JWT_SECRET)

const authorization = async (req, res, next) => {

    const {token, refreshToken} = req.cookies
    
    try {
    if (token) {
        const payload = tokenVerify(token)
        req.user = payload
        return next()
    }

    const payload = tokenVerify(refreshToken)
    
    const existingToken = await Token.findOne({
      user: payload.userId,
      refreshToken: payload.refreshToken,
    })

    const refreshTokenJWT = jwt.sign({  name: payload.name, userId: payload.userId, role: payload.role, refreshToken:existingToken.refreshToken }, process.env.JWT_SECRET, {expiresIn:'50d'})

    const oneDay = 1000 * 60 * 60 * 24 * 30
    
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: true,
        sameSite: 'lax'
    })

    req.user = payload
    next();

    } catch(e) {
      return res.redirect('/');
    }
  }


  const checkUser = async (req, res, next) => {
    const token = req.cookies.refreshToken
     
    if (token) {
      const user = tokenVerify(token)
      //const user = await User.findById(payload.userId)
      res.locals.userInfo = user
      return next()

    } else {
      res.locals.userInfo = null
      next()
    }
  }

  const authorizePermissions = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.redirect('/')
      }
      next()
    }
  }

  const isLoggedIn = ( req, res, next ) => {
    if(!req.cookies.token){
      return next()
    }else{
      return res.redirect('/')
    }
  }


  module.exports = { authorization, isLoggedIn, checkUser, authorizePermissions }