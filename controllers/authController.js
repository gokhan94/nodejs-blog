const User = require('../models/User')
const Token = require('../models/Token')
const jwt = require('jsonwebtoken')
const  sendMail  = require('../utils/sendMail')
const crypto = require('crypto')

const register = async (req, res) => {
    const { email, name, password } = req.body
    try {
        const emailAlreadyExists = await User.findOne({email: email})
        if(emailAlreadyExists){
            res.render('error', {
                message: "The email has already been received. Please sign up with another e-mail address.",
            })
            return
            //return res.redirect('/auth/login')
        }

        const alreadyName = await User.findOne({ name: name })

        if(alreadyName){
            res.render('error', {
                message: "This name has already been taken.",
            })
            return
        }

        const isFirstAccount = (await User.countDocuments({})) === 0
        const role = isFirstAccount ? 'admin' : 'user'

        const verificationEmailToken = crypto.randomBytes(40).toString('hex')

        const origin = 'http://localhost:3000'
        const verifyEmail = `${origin}/auth/verify-email/${verificationEmailToken}`;

        const message = `<p>Please confirm your email by clicking on the following link : 
        <a href="${verifyEmail}">Verify Email</a> </p>`;

        const user = await User.create({ email, name, password, role, verificationEmailToken })

        await sendMail({
            to: user.email,
            subject: 'Email Confirmation',
            html: `hello ${name} <h1>Verificitaon token: ${verificationEmailToken}</h1>,
            ${message}`
          })
        res.redirect('/')

    }catch(e){
        console.log(e)
    }
}

const verifyEmail = async (req, res) => {
    const token = req.params.id
    
    const user = await User.findOne({ verificationEmailToken: token})

    if (!user) {
        res.render('error', {
            message: "No such user found",
        })
        return
    }

    if (user.verificationEmailToken !== token) {
        res.render('error', {
            message: "No matching token value found",
        })
        return
    }

    user.isVerifiedEmail = true
    user.verificationEmailToken = ''

    await user.save()

    res.render('success', {
        message: "Email verified",
    })

}

const forgotPassword = async (req, res) => {

const { email } = req.body

if(!email) {
    res.render('error', {
        message: "Email not found",
    })
    return 
}

const user = await  User.findOne({ email })

if(user){

    /*let token = await Token.findOne({ user: user._id })
    if (!token) {
        token = await new Token({
            user: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save()
    }*/

    // new create hash password
    const hashPassword = crypto.randomBytes(40).toString('hex')
    // 'https://nodejs-blog-rouge.vercel.app'
    // 'http://localhost:3000'
    const origin = 'https://nodejs-blog-rouge.vercel.app'

    const resetURL = `${origin}/auth/reset-password?token=${hashPassword}&email=${email}`

    const resetLink = `<p>Please confirm your email by clicking on the following link : 
    <a href="${resetURL}">reset password</a> </p>`

    await sendMail({
        to: user.email,
        subject: 'Reset Passsword',
        html: `hello ${user.name} <h1>Reset password: ${resetLink}</h1>`
      })

      user.passwordResetToken = hashPassword
      await user.save()

      res.render('success', {
        message: "password reset link sent to your email account",
    })

}else {
    res.render('error', {
        message: "An error occured",
    })
}

}

const resetPassword  =  async (req, res) => {

const token =  req.params.token
const { password } = req.body

const user = await User.findOne({ passwordResetToken:token })

    if(token === user.passwordResetToken){
        user.password = password
        user.passwordResetToken = ''
        await user.save()

        res.render('success', {
            message: "password reset",
    })  
    }else{
        res.render('error', {
            message: "An error occured",
        })
    }

    

}

const login = async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) { 
        res.render('error', {
            message: "Your email or password is incorrect",
        })
        return
    }

    const user = await User.findOne({ email })
    
    if (!user) { 
        res.render('error', {
            message: "No such user found",
        })
        return
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) { 
        res.render('error', {
            message: "Passwords do not match",
        })
        return
    }

    if (!user.isVerifiedEmail) {
        res.render('error', {
            message: "Please verify your email",
        })
        return
    }

    let refreshToken = ''
    // Is the token available in the database 
    const existingToken = await Token.findOne({ user: user._id })
    if(existingToken){
        refreshToken = existingToken.refreshToken
        const tokenRefresh = jwt.sign({  name: user.name, userId: user._id, role: user.role, refreshToken:refreshToken }, process.env.JWT_SECRET, {expiresIn:'60d'})
        
        const one = 1000 * 60 * 60 * 24 * 30
        res.cookie('refreshToken', tokenRefresh, {
            httpOnly: true,
            expires: new Date(Date.now() + one),
            secure: true,
            sameSite: 'lax'
        })
        return res.redirect('/')
    }

    // create new refresh token 
    refreshToken = crypto.randomBytes(40).toString('hex')
    // create jwt token
    const refreshTokenJWT = jwt.sign({  name: user.name, userId: user._id, role: user.role, refreshToken:refreshToken }, process.env.JWT_SECRET, {expiresIn:'60d'})

    await Token.create({ refreshToken: refreshToken, user: user._id })

    const oneDay = 1000 * 60 * 60 * 24 * 30
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: true,
        sameSite: 'lax'
    }).redirect('/')
}

const logout = async (req, res) => {
    await Token.findOneAndDelete({ user: req.user.userId })

    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })

    res.redirect('/')

}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
    verifyEmail
}