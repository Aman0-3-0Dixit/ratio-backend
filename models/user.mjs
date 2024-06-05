import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    phoneNumber: {
        type: String,
        trim: true,
        required: [true, 'Please enter your mobile number.'],
        unique: true,
        match: [/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/, "Please enter a valid phone number."]
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

const User = model('User', userSchema);

export default User;