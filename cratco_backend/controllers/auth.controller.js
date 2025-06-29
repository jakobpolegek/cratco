import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN, JWT_SECRET} from '../config/env.js';

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {name, email, password} = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser) {
      const error = new Error('User already exists');
      error.status = 409;
      throw error;
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
        [{name, email, password: hashedPassword}],
        {session}
    );
    const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: {token, user: newUsers[0]},
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      const error = new Error('Invalid credentials.');
      error.status = 401;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials.');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign({userId: user._id}, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name || '',
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const socialLogin = async (req, res, next) => {
  try {
    const {email, name, provider} = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email from social provider is required.',
      });
    }

    let user = await User.findOne({email});

    if (user) {
      if (user.authMethod !== provider) {
        return res.status(403).json({
          success: false,
          message: `You have already signed up with your email and password. Please log in using that method.`,
        });
      }
    } else {
      user = await User.create({
        name,
        email,
        authMethod: provider,
      });
    }

    const token = jwt.sign({userId: user._id}, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const userDTO = {_id: user._id, name: user.name, email: user.email};

    res.status(200).json({success: true, data: {token, user: userDTO}});
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res
        .status(200)
        .json({success: true, message: 'User logged out successfully!'});
  } catch (error) {
    next(error);
  }
};
