let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    favoriteBook: {
        type: String,
        trim: true,
        required: false
    },
    password: {
        type: String,
        required: true
    }
})

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

// has password before saving to database
userSchema.pre('save', function (next) {
    let user = this;
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