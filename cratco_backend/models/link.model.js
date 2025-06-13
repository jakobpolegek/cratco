import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Link name is required!'],
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    originalAddress: {
        type: String,
        required: [true, 'Original address is required!'],
        unique: false,
        trim: true,
        minLength: 4,
        maxLength: 130,
    },
    customAddress: {
        type: String,
        required: [true, 'Custom address is required!'],
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required!'],
        validate: {
            validator: function (v) {
                return v <= new Date();
            },
            message: 'Start date must be in the past!'
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        default: function () {
            const renewalPeriod = 31;
            const date = new Date(this.startDate || new Date());
            date.setDate(date.getDate() + renewalPeriod);
            return date;
        },
        validate: {
            validator: function (v) {
                return v > this.startDate;
            },
            message: 'Renewal date must be after start date!'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, {timestamps: true});

linkSchema.pre('save', function (next) {
    if (this.renewalDate < new Date()) {
        this.status = 'inactive';
    }

    next();
});

const Link = mongoose.model('Link', linkSchema);

export default Link;