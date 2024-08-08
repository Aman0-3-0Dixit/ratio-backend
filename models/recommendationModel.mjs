import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    recommendations: [{
        userId: { 
            type: String, 
            required: true
        },
        score: { 
            type: Number, 
            required: true 
        }
    }],
    createdAt: {
        type: Number,
        default: Date.now,
    },
    updatedAt: {
        type: Number,
        default: Date.now,
    }
});

recommendationSchema.pre('save', function (next) {
    this.createdAt = new Date(this.createdAt).getTime();
    this.updatedAt = new Date(this.updatedAt).getTime();
    next();
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;