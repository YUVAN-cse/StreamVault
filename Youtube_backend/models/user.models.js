
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },

    fullName: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        required: true

    },

    coverImage: {
        type: String,
    },

    watchHistory: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    refreshToken: {
        type: String,
        default: null
    }

}, { timestamps: true });



userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
};


userSchema.methods.generateRefreshToken = async function () {
    const refreshToken = jwt.sign(
        { userId: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );

    this.refreshToken = refreshToken;
    await this.save();

    return refreshToken;
};


userSchema.methods.clearRefreshToken = async function () {
    this.refreshToken = null;
    await this.save();
};

userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
};


export const User  = mongoose.model('User', userSchema);