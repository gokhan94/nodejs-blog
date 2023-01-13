const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 5,
    maxlength: 20,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  profileImage: {
    type: String,
    default: '/image/avatar.jpg',
  },
  description: {
    type: String,
    default: null,
  },
  job: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user',
  },
  verificationEmailToken: String,
  isVerifiedEmail: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: {
    type: String,
  },
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt    = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
};


module.exports = mongoose.model('User', UserSchema)
