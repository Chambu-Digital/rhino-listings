import nodemailer from 'nodemailer';

// Shared transporter factory

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.ZOHO_HOST,
    port: parseInt(process.env.ZOHO_PORT),
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"${name}" <${process.env.ZOHO_USER}>`,
      replyTo: email,
      to: process.env.ZOHO_USER,
      subject: subject || 'New Website Inquiry',
      text: `Message from ${name} (${email})${phone ? ` | Phone: ${phone}` : ''}:\n\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr/>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    res.json({ message: 'Message sent successfully!', success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
};

// Admin sends email directly to a client
export const sendToClient = async (req, res) => {
  try {
    const { toEmail, toName, subject, message } = req.body;

    if (!toEmail || !subject || !message) {
      return res.status(400).json({ message: 'toEmail, subject, and message are required.' });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Rhino Linings Nairobi" <${process.env.ZOHO_USER}>`,
      to: `"${toName || toEmail}" <${toEmail}>`,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br/>')}</p>
             <br/><hr/>
             <p style="font-size:12px;color:#888;">Rhino Linings Nairobi | info@rhinoliningsnairobi.co.ke | +254 727 877 651</p>`,
    });

    res.json({ message: 'Email sent to client successfully!', success: true });
  } catch (error) {
    console.error('Send to client error:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
};

export const testEmailConfig = async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({ message: 'Email configuration is valid.', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Email config test failed.', error: error.message });
  }
};
