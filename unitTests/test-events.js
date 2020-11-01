import test from 'ava'
import { Events } from '../modules/events.js'

// TODO
// How to mock file uploads?

const mockEvents = [
	{
		eventId: 1,
		userId: 1,
		title: 'Title',
		description: 'Description',
		date: '11/12/2020'
	},
	{
		eventId: 2,
		userId: 2,
		title: 'Title2',
		description: 'Description2',
		date: '11/12/2020'
	},
]

test('EVENTS : add new event', async(test) => {
	test.plan(1)
	const events = await new Events()
	const addEvent = await events.add(
		mockEvents[0]
	)
	test.is(addEvent, 1, 'unable to add event')
	events.close()
})

test('EVENTS : error if date missing' , async(test) => {
	test.plan(1)
	const events = await new Events()

	try {
		await events.add({...mockEvents[0], date: undefined})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		events.close()
	}
})

test('EVENTS : error if title missing' , async(test) => {
	test.plan(1)
	const events = await new Events()

	try {
		await events.add({...mockEvents[0], title: undefined})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		events.close()
	}
})

test('EVENTS : error if userId missing' , async(test) => {
	test.plan(1)
	const events = await new Events()

	try {
		await events.add({...mockEvents[0], userId: undefined})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		events.close()
	}
})

test('EVENTS : error if file is bigger than 5MB' , async(test) => {
	test.plan(1)
	const events = await new Events()
	try {
		await events.add({...mockEvents[0], fileSize: 50000000})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'image is too big', 'incorrect error message')
	} finally {
		events.close()
	}
})

test('EVENTS : return all events', async(test) => {
	test.plan(1)
	const events = await new Events()

	await events.add(mockEvents[0])
	await events.add(mockEvents[1])

	const allEvents = await events.all()
	test.is(allEvents.length, 2, 'does not return all added events')

	events.close()
})

test('EVENTS : should use placeholder image if no image is suplied', async(test) => {
	test.plan(1)
	const events = await new Events()

	await events.add(mockEvents[0])

	const allEvents = await events.all()
	test.is(allEvents[0].thumbnail, 'public/images/thumbnail_placeholder.jpg', 'does not use placeholder')

	events.close()
})

