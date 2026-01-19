import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "ISP Billing <billing@isp.com>",
      to: to,
      subject: subject,
      html: html,
    });
    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
