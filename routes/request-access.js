const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");
require("dotenv").config(); // Ensure environment variables are loaded

// POST /request-access
// Request access level change
router.post("/", async (req, res) => {
    try {
        // Extract token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Verify and decode JWT
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);

        const userEmail = decoded.email;
        const userName = decoded.name;
        const userRole = decoded.role;

        if (!userEmail || !userName) {
            return res.status(400).json({ error: "User details not found in token" });
        }

        // Setup email transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                redirectURI: process.env.REDIRECT_URI,
            }
        });

        // Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "katherineapuzzo@gmail.com",
            subject: "Access Level Change Request",
            text: `Hello Admin,

I would like to request an access level change to "staff."

User Details:
- Name: ${userName}
- Email: ${userEmail}
- Current Role: ${userRole}

Thank you,
${userName}
`,
        };

        // ✅ Send Email
        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully to Admin");
        res.status(200).json({ message: "Request sent successfully." });

    } catch (error) {
        console.error("Error sending request:", error);
        res.status(500).json({ error: "Failed to send request. Please try again later." });
    }
});

module.exports = router, localStorage;
