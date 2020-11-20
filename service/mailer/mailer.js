/**
 * Mailer service to handle email sending
 * @module service/mailer
 */

import nodemailer from 'nodemailer'

/**
 * Sends an email
 * @param {Array} recipients email addresses of recipients
 * @param {String} subject email subject
 * @param {String} bodyHtml email body
 * @returns {Object} status of the email
 */
const mailTo = async(recipients, { subject, bodyHtml }) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.zoho.eu',
		port: 465,
		auth: {
			user: 'mikalaum@zohomail.eu',
			pass: process.env.MAILER_PASSWORD,
		},
	})
	const data = {
		from: 'mikalaum@zohomail.eu',
		to: recipients,
		subject: subject,
		html: bodyHtml,
	}
	return await sendEmail(transporter, data)
}

/**
 * Wrapper for sending emails that returns a promise
 * @param {Object} transporter Nodemailer transporter object
 * @param {Object} data data to be send
 */
const sendEmail = async(transporter, data) =>
	new Promise((resolve, reject) => {
		transporter.sendMail(data, (err, info) => {
			if (err) reject(err)
			resolve(info)
		})
	})

export default mailTo
