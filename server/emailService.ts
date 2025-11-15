// mat1gr/rosariodenim/ROSARIODENIM-cefd39a742f52a93c451ebafdb5a8b992e99e78c/server/emailService.ts
// server/emailService.ts
import nodemailer from 'nodemailer';
import { Order, CartItem } from '../server/types/index.js';

// This service is responsible for sending all application emails.
// It's configured to use Ethereal for testing by default.
// Ethereal is a fake SMTP service that captures emails and lets you preview them in a web interface.

// 1. Create a Nodemailer transporter
// We are creating a test account with Ethereal. In a real production environment,
// you would replace this with your actual SMTP server details (e.g., from Gmail, SendGrid, etc.)
// It's highly recommended to store these credentials in your .env file.
// Example for Gmail:
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

let transporter: nodemailer.Transporter;

const initializeEmailService = async () => {
  // Create a test account only if we don't have one yet
  if (transporter) {
    return;
  }
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('📧 Ethereal test account created successfully.');
    // Show the generic Ethereal messages page; individual message preview URLs are available after sending via nodemailer.getTestMessageUrl(info)
    console.log('   Preview URL: https://ethereal.email/messages');

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  } catch (error) {
    console.error('Failed to create Ethereal test account:', error);
  }
};

// Call initialization
initializeEmailService();

// 2. Define email sending functions

/**
 * Generates a simple HTML body for the order confirmation email.
 * @param order The order object.
 * @returns HTML string for the email body.
 */
const generateOrderConfirmationHTML = (order: Order): string => {
  const itemsList = order.items
    .map(
      (item: CartItem) =>
        `<li>${item.product.name} (Talle: ${item.size}) - Cantidad: ${item.quantity} - Precio: $${item.product.price}</li>`
    )
    .join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <h1 style="color: #333;">¡Gracias por tu compra, ${order.customerName}!</h1>
      <p>Tu pedido #${order.id} ha sido confirmado y lo estamos preparando.</p>
      
      <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Resumen del Pedido</h2>
      <ul>
        ${itemsList}
      </ul>
      <p style="font-size: 1.2em; font-weight: bold;">Total: $${order.total}</p>
      
      <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Información de Envío</h2>
      <p>
        ${order.shippingStreetName} ${order.shippingStreetNumber || ''}<br>
        ${order.shippingCity}, ${order.shippingProvince}, ${order.shippingPostalCode}<br>
        ${order.shippingApartment || ''}<br>
        ${order.shippingDescription || ''}
      </p>

      <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
        Recibirás otra notificación cuando tu pedido sea enviado.
      </p>
    </div>
  `;
};

/**
 * Sends an order confirmation email to the customer.
 * @param order The complete order object.
 */
export const sendOrderConfirmation = async (order: Order): Promise<void> => {
  if (!transporter) {
    console.error('Email transporter is not initialized. Cannot send email.');
    return;
  }

  const mailOptions = {
    from: '"Rosario Denim" <no-reply@rosariodenim.com>',
    to: order.customerEmail,
    subject: `Confirmación de tu pedido #${order.id}`,
    html: generateOrderConfirmationHTML(order),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${order.customerEmail}`);
    // Log the URL to preview the sent email on Ethereal
    console.log(`   Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    console.error(`❌ Failed to send order confirmation email:`, error);
  }
};