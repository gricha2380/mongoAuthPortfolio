let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    carrier: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    assets : { type : Array , "default" : [] },
    snapshots : { type : Array , "default" : [] },
    password: {
        type: String,
        required: true
    },
    assetCount: {
        type: Number,
        required: false,
        "default" : 0
    },
    emailDelivery: {
        type: Boolean,
        required: true,
        "default" : true
    },
    emailFrequency: {
        type: Number,
        required: false,
        "default" : 1
    },
    textDelivery: {
        type: Boolean,
        required: true,
        "default" : true
    },
    textFrequency: {
        type: Number,
        required: false,
        "default" : 1
    },
    created: { 
        type: Date,
        default: Date.now
    }
},{ autoIndex: false })

userSchema.set('toObject', { virtuals: true }); // please make them normal objects...

// authenticate input against database documents
userSchema.statics.authenticate = (name, password, callback) => {
    User.findOne({ name: name})
    .exec((error, user) => {
        if (error) {
            return callback(error);
        } else if (!user) {
            let err = new Error('User not found...')
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, (error, result) =>{
            if (result === true) {
                return callback(null, user);
            } else {
                return callback();
            }
        })
    })
}

// hash password before saving to database
userSchema.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        console.log('password not modified');
        return next();
    }

    bcrypt.hash(user.password, 10, function (err,hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
})

let User = mongoose.model('User', userSchema)
module.exports = User;