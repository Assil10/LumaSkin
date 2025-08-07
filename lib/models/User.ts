import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  refreshToken: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
})

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ resetPasswordToken: 1 })

// Virtual for password confirmation (not stored in DB)
userSchema.virtual('confirmPassword')
  .get(function() {
    return this._confirmPassword
  })
  .set(function(value) {
    this._confirmPassword = value
  })

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Instance method to get public profile (without sensitive data)
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.resetPasswordToken
  delete userObject.resetPasswordExpires
  delete userObject.refreshToken
  return userObject
}

// Static method to find user by email
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() })
}

// Static method to find user by reset token
userSchema.statics.findByResetToken = function(token: string) {
  return this.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  })
}

export default mongoose.models.User || mongoose.model('User', userSchema)
