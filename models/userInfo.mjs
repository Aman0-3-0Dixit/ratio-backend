import { Schema, model } from 'mongoose';
import validator from 'validator';

const userInfoSchema = Schema({
    _id: Schema.Types.ObjectId,
    phoneNumber: {
        type: String,
        trim: true,
        required: [true, 'Please enter your mobile number.'],
        unique: true,
        match: [/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/, "Please enter a valid phone number."]
    },
    firstName: {
        type: String,
        required: [true, 'Please enter your first name.'],
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please enter your date of birth']
    },
    gender: {
        type: String,
        required: [true, 'Please select gender'],
        enum: ['Male', 'Female']
    },
    homeCity: {
        type: String,
        required: [true, 'Please enter your home city'],
        maxLength: 100
    },
    partnerPreferences: {
        genderPreference: {
            type: String,
            enum: ['Male','Female','Both','Nonbinary']
        },
        partnerAge: {
            type: Number,
            min: [18, 'Age must be at least 18.']
        }
    },
    cuisinePreferences: {
        type: [String],
        validate: { validator: (val) => val.length <= 2, message: 'Select upto 2 options' }
    },
    bio: {
        type: String,
        maxLength: 300
    },
    university: {
        type: String,
        maxLength: 100
    },
    profession: {
        type: String,
        maxLength: 50
    },
    ethnicity: {
        type: [String],
        validate: { validator: (val) => val.length <= 2, message: 'Select upto 2 options' }
    },
    interests: {
        type: [String],
        validate: { validator: (val) => val.length <= 2, message: 'Select upto 3 options' }
    },

    musicPrompt: [{
        promptHead: {
            type: String,
            required: true
        },
        promptResponse: {
            type: String,
            maxLength: 300
        }
    }],   

    themeSong: {
        type: String
    },

    writtenPrompt: {
        type: String,
        maxLength: 500
    },

    images: {
        type: [String],
        required: true,
        validate: { validator: (val) => val.length >= 3, message: 'Pick at least 3 photos'}
    },
    location: {
        type: String,
        enum: ["Allow Once","Allow While Using App","Don't allow"],
    },
    notifications: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default model('UserInfo', userInfoSchema);