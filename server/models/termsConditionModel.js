import mongoose from 'mongoose';

const termsConditionSchema = new mongoose.Schema({
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    content: {
        acceptanceTerms: {
            type: String,
            required: true
        },
        useLicense: {
            type: String,
            required: true
        },
        disclaimer: {
            type: String,
            required: true
        },
        limitations: {
            type: String,
            required: true
        },
        userConduct: {
            type: String,
            required: true
        },
        termination: {
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

const TermsCondition = mongoose.model('TermsCondition', termsConditionSchema);
export default TermsCondition;
