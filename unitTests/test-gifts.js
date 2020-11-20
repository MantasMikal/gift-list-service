import test from 'ava'
import { Gifts } from '../modules/gifts.js'

const mockGifts = [
	{
		eventId: 1,
		name: 'Title',
		price: 123,
		user: null,
		url: 'https://google.com',
	},
	{
		eventId: 1,
		name: 'Title2',
		price: 123,
		user: null,
		url: 'https://google.com',
	},
	{
		eventId: 3,
		name: 'Title3',
		price: 1234,
		user: null,
		url: 'https://google.com',
	},
]

test('GIFTS:add - add new gift', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	const addedGift = await gifts.getById(1)
	const expectedGift = {id: 1, ...mockGifts[0]}
	test.deepEqual(addedGift, expectedGift, 'unable to add gift')
	gifts.close()
})

test('GIFTS:add - error if name missing', async(test) => {
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

test('GIFTS:add - error if eventId missing', async(test) => {
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

test('GIFTS:getEventGifts - error retrieving event gifts if id is missing', async(test) => {
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

test('GIFTS:getEventGifts - error if event id is not a number', async(test) => {
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

test('GIFTS:getEventGifts - should return empty array if no events exist', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	const eventGifts = await gifts.getEventGifts(1)
	test.deepEqual(eventGifts, [])
	gifts.close()
})

test('GIFTS:getEventGifts : should retrieve all gifts associated with event', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	await gifts.add(mockGifts[1])
	const eventGifts = await gifts.getEventGifts(1)
	const expectedGifts = [
		{ id: 1, ...mockGifts[0] },
		{ id: 2, ...mockGifts[1] },
	]
	test.deepEqual(eventGifts, expectedGifts)
	gifts.close()
})

test('GIFTS:pledgeGift - should correctly update user by eventId and giftId', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	await gifts.add(mockGifts[1])
	await gifts.add(mockGifts[2])
	await gifts.pledgeGift(3, 'jeff', 3)
	const gift = await gifts.getEventGifts(3)
	const expectedGift = [{ id: 3, ...mockGifts[2], user: 'jeff' }]
	test.deepEqual(gift, expectedGift, 'user was not updated')
})

test('GIFTS:pledgeGift -  should correctly update user by eventId and giftId', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	await gifts.add(mockGifts[1])
	await gifts.add(mockGifts[2])
	await gifts.pledgeGift(3, 'jeff', 3)
	const gift = await gifts.getEventGifts(3)
	const expectedGift = [{ id: 3, ...mockGifts[2], user: 'jeff' }]
	test.deepEqual(gift, expectedGift, 'gift was not updated')
})

test('GIFTS:pledgeGift -  should return updated gift', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	const gift = await gifts.pledgeGift(1, 'jeff', 1)
	const expectedGift = { id: 1, ...mockGifts[0], user: 'jeff' }
	test.deepEqual(gift, expectedGift, 'gift was not returned')
})

test('GIFTS:pledgeGift - error if eventId missing', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	try {
		await gifts.pledgeGift(1, 'jeff', null)
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'missing or invalid field', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS:pledgeGift - error if user missing', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	try {
		await gifts.pledgeGift(1, null, 1)
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'missing or invalid field', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS:getById - error if id missing', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	try {
		await gifts.getById(undefined)
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'invalid or missing id', 'incorrect error message')
	} finally {
		gifts.close()
	}
})

test('GIFTS:getById -  should return gift by id', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	await gifts.add(mockGifts[0])
	const gift = await gifts.getById(1)
	const expectedGift = { id: 1, ...mockGifts[0] }
	test.deepEqual(gift, expectedGift, 'gift was not returned')
})
