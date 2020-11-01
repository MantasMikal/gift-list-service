import test from 'ava'
import { Gifts } from '../modules/gifts.js'

const mockGifts = [
	{
		eventId: 1,
		name: 'Title',
		price: 123,
		url: 'https://google.com',
	},
	{
		eventId: 1,
		name: 'Title2',
		price: 123,
		url: 'https://google.com',
	},
]

test('GIFTS : add new gift', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	const addGift = await gifts.add(mockGifts[0])
	test.is(addGift, true, 'unable to add event')
	gifts.close()
})

test('GIFTS : error if url missing', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	try {
		await gifts.add({ ...mockGifts[0], url: undefined })
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS : error if name missing', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	try {
		await gifts.add({ ...mockGifts[0], name: undefined })
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS : error if eventId missing', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	try {
		await gifts.add({ ...mockGifts[0], eventId: undefined })
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS : error if price missing', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	try {
		await gifts.add({ ...mockGifts[0], price: undefined })
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS : error retrieving event gifts if id is missing', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	await gifts.add(mockGifts[1])
	try {
		await gifts.getEventGifts()
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'invalid or missing id', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS : error if retrieving event gifts id is not a number', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	await gifts.add(mockGifts[1])
	try {
		await gifts.getEventGifts('boop')
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'invalid or missing id', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS : should return empty array if no events exist', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	const eventGifts = await gifts.getEventGifts(1)

	test.deepEqual(eventGifts, [])
	gifts.close()
})

test('GIFTS : should retrieve all gifts associated with event', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	await gifts.add(mockGifts[1])

	const eventGifts = await gifts.getEventGifts(1)
	const expectedGifts = [
		{id: 1, ...mockGifts[0]},
		{id: 2, ...mockGifts[1]},
	]

	test.deepEqual(eventGifts, expectedGifts)
	gifts.close()
})
