import mongoose from 'mongoose';

const profileLikeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userFrom: {
        type: String,
        required: true
    },
    userTo: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        default: Date.now,
    }
});

profileLikeSchema.pre('save', function (next) {
    this.createdAt = new Date(this.createdAt).getTime();
    next();
});

profileLikeSchema.index({ userFrom: 1, userTo: 1 }, { unique: true });

const ProfileLike = mongoose.model('ProfileLike', profileLikeSchema);

export default ProfileLike;