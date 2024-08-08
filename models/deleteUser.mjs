import { Schema, model } from 'mongoose';

const deleteUserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    phoneNumber: {
        type: String,
        trim: true,
        required: [true, 'Please enter your mobile number.'],
        unique: true,
        match: [/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/, "Please enter a valid phone number."]
    },
    createdAt: {
        type: Number,
        default: Date.now,
    }
});

deleteUserSchema.pre('save', function (next) {
    this.createdAt = new Date(this.createdAt).getTime();
    next();
});

export default model('DeleteUser', deleteUserSchema);