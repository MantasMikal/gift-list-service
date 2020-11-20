import test from 'ava'
import mailTo from '../service/mailer/mailer.js'

import dotenv from 'dotenv'
dotenv.config()

const emailTemplate = {
	subject: 'Subject',
	bodyPlainText: 'Body in plain text',
	bodyHtml: '<p>Body in html</p>',
}

test('MAILER:mailTo should send an email', async(test) => {
	test.plan(1)
	try {
		const status = await mailTo(['example@example.com'], emailTemplate)
		if (status.accepted) test.pass('Email was sent')
		else if (status.rejected) test.fail('Email was rejected')
	} catch (err) {
		test.fail('Could not send an email.', err)
	}
})

test('MAILER:mailTo - error if email address missing', async(test) => {
	test.plan(1)
	try {
		await mailTo([], emailTemplate)
		test.fail('Error not thrown')
	} catch (err) {
		test.is(err.message, 'No recipients defined', 'incorrect error message')
	}
})
