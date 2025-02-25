const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { setToken } = require('../public');



const user = JSON.parse(localStorage.getItem("user"));

// Register user
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const userRole = user.role || "guest";
  const token = user.createJWT();
  setToken(token); // updated to use the created token
  res.status(StatusCodes.CREATED).json({ user: { id: user.id, name: user.name }, token, role: userRole });
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    // ✅ Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Invalid Email");
    }

    // ✅ Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Password");
    }

    // ✅ Use the stored user role instead of a hardcoded function
    const userRole = user.role || "guest"; // Default to 'guest' if role is missing

    // ✅ Generate JWT Token
    const token = user.createJWT();
    if (!token) {
        throw new Error("Failed to create JWT token");
    }

    // ✅ Log the role-based access control
    if (userRole === "admin") {
        console.log("Access granted to admin section.");
    } else {
        console.log("Access denied to admin section.");
    }

    // ✅ Return success response
    res.status(StatusCodes.OK).json({ 
        user: { name: user.name, role: userRole }, 
        token 
    });
};


module.exports = {
  register,
  login,
};
