const emailVerification = {
  html: (otp, name) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <h1 style="font-size: 24px; color: #333333; margin: 0;">🔐 Email Verification</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0;">
              <p style="font-size: 16px; color: #555555; margin: 0;">
                Hello <strong>${name}</strong>,<br/><br/>
                Use the OTP below to verify your email address:
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 0;">
              <div style="display: inline-block; font-size: 32px; font-weight: bold; background-color: #f0f0f0; color: #222; padding: 15px 30px; border-radius: 8px; letter-spacing: 4px;">
                ${otp}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0;">
              <p style="font-size: 14px; color: #888888;">
                This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 30px;">
              <p style="font-size: 14px; color: #aaaaaa;">
                &copy; 2025 Social Media. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
};

module.exports = emailVerification;
