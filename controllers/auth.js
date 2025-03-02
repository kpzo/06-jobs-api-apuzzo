const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');

// Register user
const register = async (req, res) => {
    try{
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ 
    user: { id: user._id, name: user.name, role: userRole }, 
    token, 
    role: userRole });
} catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
}
if (error.code && error.code === 11000) {
    return res.status(StatusCodes.CONFLICT).json({ error: "Duplicate value error: A user with this email already exists." });
}
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Invalid Email");
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Password");
    }

    // Use the stored user role instead of a hardcoded function
    const userRole = user.role

    // Generate JWT Token
    const token = user.createJWT();
    if (!token) {
        throw new Error("Failed to create JWT token");
    }

    // Log the role-based access control
    if (userRole === "admin") {
        console.log("Access granted to admin section.");
    } else {
        console.log("Access denied to admin section.");
    }

    // Return success response
    res.status(StatusCodes.OK).json({ 
        user: { id: user._id, name: user.name, role: user.role }, 
        token 
    });
};



module.exports = {
  register,
  login,
};
