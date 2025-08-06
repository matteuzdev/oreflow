// backend/config/brevo.js
const Brevo = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

module.exports = apiInstance;
