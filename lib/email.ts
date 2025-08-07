import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetUrl: string
) => {
  const transporter = createTransporter()

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@lumaskin.com',
    to: email,
    subject: 'LumaSkin - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">LumaSkin</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You requested a password reset for your LumaSkin account. Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="color: #667eea; word-break: break-all; margin-bottom: 20px;">
            ${resetUrl}
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 1 hour for security reasons.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated email from LumaSkin. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Password reset email sent successfully to:', email)
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}

// Send welcome email
export const sendWelcomeEmail = async (email: string, name: string) => {
  const transporter = createTransporter()

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@lumaskin.com',
    to: email,
    subject: 'Welcome to LumaSkin!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">LumaSkin</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to LumaSkin, ${name}! 🎉</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining LumaSkin! We're excited to help you on your skincare journey.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            With LumaSkin, you can:
          </p>
          
          <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <li>Track your skincare routine</li>
            <li>Get personalized product recommendations</li>
            <li>Monitor your skin progress</li>
            <li>Access expert skincare advice</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Get Started
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions, feel free to reach out to our support team.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Best regards,<br>
            The LumaSkin Team
          </p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Welcome email sent successfully to:', email)
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw error for welcome email as it's not critical
  }
}
