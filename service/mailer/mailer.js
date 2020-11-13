import nodemailer from 'nodemailer'

/**
 *
 * @param {Array} recipients email addresses of recipients
 * @param {Object} template email template that contains, email as html, email as text and subject
 */
const mailTo = async(recipients, {subject, bodyHtml }) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.zoho.eu',
		port: 465,
		auth: {
			user: 'mikalaum@zohomail.eu',
			pass: process.env.MAILER_PASSWORD
		}
	})

	const data = {
		from: 'mikalaum@zohomail.eu',
		to: recipients,
		subject: subject,
		html: bodyHtml
	}

	transporter.sendMail(data, (err, info) => {
		console.log('Info:', JSON.stringify(info))
		if(err) throw err
		return info
	})
}

export default mailTo
