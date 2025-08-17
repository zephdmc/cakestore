const nodemailer = require('nodemailer');
const ErrorResponse = require('../utils/ErrorResponse');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send email
exports.sendEmail = async ({ email, subject, template, context }) => {
    try {
        if (!email || !subject) {
            throw new ErrorResponse('Email and subject are required', 400);
        }

        // If template is provided, render it
        let html = '';
        if (template) {
            const templatePath = path.join(__dirname, `../templates/${template}.ejs`);
            const templateStr = fs.readFileSync(templatePath, 'utf-8');
            html = ejs.render(templateStr, context);
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject,
            html: html || `<p>${context.message || 'Thank you for your order'}</p>`,
            text: html ? html.replace(/<[^>]*>/g, '') : (context.message || 'Thank you for your order')
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (err) {
        console.error('Email sending failed:', err);
        throw err;
    }
};