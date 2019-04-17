const axios = require('axios');

require('dotenv').config();

function getSiteKey() {
  return process.env.RECAPTCHA_SITE_KEY;
}

function getSecretKey() {
  return process.env.RECAPTCHA_SECRET_KEY;
}

async function verifyToken(token) {
  const secretKey = getSecretKey();

  let recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify?';
  recaptchaUrl += `secret=${secretKey}&`;
  recaptchaUrl += `response=${token}`;

  const response = await axios.post(recaptchaUrl, {});

  return response.data.success;
}

function validate() {
  return async (req, res, next) => {
    const token = req.body['g-recaptcha-response'];
    const isTokenValid = await verifyToken(token);

    if (isTokenValid) {
      next();
    } else {
      const err = new Error('reCAPTCHA validation failed. Please try again.');
      err.code = 'RecaptchaFailed';
      next(err);
    }
  };
}

module.exports = {
  getSiteKey,
  getSecretKey,
  verifyToken,
  validate,
};
