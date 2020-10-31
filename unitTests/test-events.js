
import test from 'ava'
import { Events } from '../modules/events.js'

test('EVENTS : return all events', async test => {
	test.plan(1)
	const account = await new Events()

	// TODO:
	// Implement this once added functionality to add events

	test.pass()
	account.close()
})
