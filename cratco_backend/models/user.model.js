import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 30,
      required: [true, 'Username is required!'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required!'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    authMethod: {
      type: String,
      enum: ['local', 'google'],
      required: true,
      default: 'local',
    },
    password: {
      type: String,
      required: function () {
        return this.authMethod === 'local';
      },
      minLength: 8,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
