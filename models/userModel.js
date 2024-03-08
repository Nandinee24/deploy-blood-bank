const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, 'role is required'],
        enum: ['organization', 'donar', 'hospital', 'admin']
    },
    name: {
        type: String,
        required: function () {
            if (this.role === 'user ' || this.role === ' admin') {
                return true;
            }
            return false;
        }
    },
    organizationName: {
        type: String,
        required: function () {
            if (this.role === 'organization') {
                return true;
            }
            return false;
        },
    },
    hospitalName: {
        type: String,
        required: function () {
            if (this.role === 'hospital') {
                return true;
            }
            return false;
        },
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    website: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'address is required'],

    },
    phone: {
        // type: Number,
        // // required: [true, 'phone number is required'],
        // required: function () {
        //     if (this.phone.length === 10) {
        //         return true;
        //     }
        //     return false;
        // },
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (v) {
                // Regular expression to match exactly 10 digits
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Please enter a 10-digit number.`
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema)
