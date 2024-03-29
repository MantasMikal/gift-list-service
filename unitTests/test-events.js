import test from 'ava'
import { Events } from '../modules/events.js'

const mockEvents = [
	{
		userId: 1,
		title: 'Title',
		description: 'Description',
		date: '11/12/2020',
		thumbnail: 'thumbnail_placeholder.jpg'
	},
	{
		userId: 1,
		title: 'Title2',
		description: 'Description2',
		date: '11/12/2020',
		thumbnail: 'thumbnail_placeholder.jpg'
	},
]

test('EVENTS:add - add new event', async(test) => {
	test.plan(1)
	const events = await new Events()
	const addEvent = await events.add(
		mockEvents[0]
	)
	test.is(addEvent, 1, 'unable to add event')
	events.close()
})

test('EVENTS:add - error if date missing' , async(test) => {
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

test('EVENTS:add - error if title missing' , async(test) => {
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

test('EVENTS:add - error if userId missing' , async(test) => {
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

test('EVENTS:add : should return id of added event', async(test) => {
	test.plan(1)
	const events = await new Events()
	const eventId = await events.add(mockEvents[0])
	test.is(eventId, 1, 'does not return added event id')
	events.close()
})

test('EVENTS:all - return all events', async(test) => {
	test.plan(1)
	const events = await new Events()

	await events.add(mockEvents[0])
	await events.add(mockEvents[1])
	const allEvents = await events.all()

	const expectedEvents = [
		{id: 1, ...mockEvents[0]},
		{id: 2, ...mockEvents[1]}
	]

	test.deepEqual(allEvents, expectedEvents, 'does not return all added events')
	events.close()
})

test('EVENTS:all - should use placeholder image if no image is suplied', async(test) => {
	test.plan(1)
	const events = await new Events()

	await events.add({...mockEvents[0], thumbnail: undefined})

	const allEvents = await events.all()
	test.is(allEvents[0].thumbnail, 'thumbnail_placeholder.jpg', 'does not use placeholder')

	events.close()
})

test('EVENTS:getById - should return event by id', async(test) => {
	test.plan(1)
	const events = await new Events()

	await events.add(mockEvents[0])
	await events.add(mockEvents[1])

	const allEvents = await events.getById(1)

	const expectedEvents = {id: 1, ...mockEvents[0]}

	test.deepEqual(allEvents, expectedEvents, 'does not return all events by id')
	events.close()
})

test('EVENTS:getEventOwner - returns the event owner', async(test) => {
	test.plan(1)
	const events = await new Events()

	await events.setUpTestDatabase()
	const user = await events.getEventOwner(1)
	test.deepEqual(user, {
		id: 1,
		user: 'jeff',
		pass: 'password',
		email: 'jeff@email.com'
	})
	events.close()
})


test('EVENTS:getEventOwner - should error if id is invalid', async(test) => {
	test.plan(1)
	const events = await new Events()
	await events.setUpTestDatabase()
	try {
		await events.getEventOwner('inv\alid')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'Missing or invalid fields', 'incorrect error message')
	} finally {
		events.close()
	}
})

test('EVENTS:getEventOwner - should return undefined if event does not exist', async(test) => {
	test.plan(1)
	const events = await new Events()
	await events.setUpTestDatabase()
	const user = await events.getEventOwner(777)
	test.deepEqual(user, undefined)
	events.close()
})
