const OTPAuth = require("otpauth");

// Create a new TOTP object.
let totp = new OTPAuth.TOTP({
  issuer: "ACME",
  label: "AzureDiamond",
  algorithm: "SHA1",
  digits: 6,
  period: 300, //5 minutes
  secret: "NB2W45DFOIZA", // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
});

function generateToken () {
  return totp.generate();
}

function validateToken(token){
  return totp.validate({ token, window: 1 });
}

module.exports = {
  generateToken,
  validateToken
}