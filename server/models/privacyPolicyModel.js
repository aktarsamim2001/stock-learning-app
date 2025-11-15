import mongoose from 'mongoose';

const privacyPolicySchema = new mongoose.Schema({
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    content: {
        informationCollected: {
            type: String,
            required: true
        },
        informationUsage: {
            type: String,
            required: true
        },
        informationSharing: {
            type: String,
            required: true
        },
        dataSecurity: {
            type: String,
            required: true
        },
        userRights: {
            type: String,
            required: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);
export default PrivacyPolicy;
