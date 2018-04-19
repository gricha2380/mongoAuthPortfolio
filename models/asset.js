let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let assetSchema = new mongoose.Schema({
    exchange:{
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: Number,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    purchasePrice:{
        type: Number,
        required: true,
        trim: true
    },
    quantity:{
        type: Number,
        required: true,
        trim: true
    },
    symbol:{
        type: String,
        required: true,
        trim: true
    },
    type:{
        type: String,
        required: true,
        trim: true
    },
    updated:{
        type: Date,
        default: Date.now
    }
})

// authenticate input against database documents
assetSchema.statics.authenticate = (name, password, callback) => {
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
assetSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err,hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
})

let Asset = mongoose.model('Asset', assetSchema)
module.exports = Asset;