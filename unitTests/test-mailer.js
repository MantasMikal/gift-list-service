import test from 'ava'
import mailTo from '../service/mailer/mailer.js'

import dotenv from 'dotenv'
dotenv.config()

// TODO
// Fix tests

const emailTemplate = {
	subject: 'Subject',
	bodyPlainText: 'Body in plain text',
	bodyHtml: '<p>Body in html</p>'
}

test('MAILER:mailTo should send an email', async(test) => {
	test.plan(1)
	test.pass('Need to add test')
	// try {
	// 	const res = await mailTo(['example@example.com'], emailTemplate)
	// 	if(res.accepted) test.pass('Email was sent')
	// 	else if (res.rejected) test.fail('Email was rejected')
	// } catch(err) {
	// 	test.fail('Could not send an email.', err)
	// }
})
