const passwordReset = {
  html: (otp, name) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset OTP</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #4caf50;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        background-color: #f0f0f0;
        padding: 15px;
        border-radius: 5px;
        letter-spacing: 4px;
        margin: 20px 0;
      }
      .footer {
        font-size: 13px;
        color: #888888;
        text-align: center;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hello,${name}</p>
        <p>
          We received a request to reset the password for your account. Please use
          the following OTP to proceed:
        </p>

        <div class="otp">${otp}</div>

        <p>This OTP is valid for 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>

        <p>Thanks,<br />The Support Team</p>
      </div>
      <div class="footer">
        &copy; 2025 Your Company. All rights reserved.
      </div>
    </div>
  </body>
</html>
`,
};

module.exports = passwordReset;
