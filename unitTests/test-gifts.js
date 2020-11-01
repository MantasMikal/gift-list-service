import test from 'ava'
import { Gifts } from '../modules/gifts.js'

const mockGifts = [
	{
		eventId: 1,
		name: 'Title',
		price: 123,
		url: 'https://google.com'
	},
	{
		eventId: 1,
		name: 'Title2',
		price: 123,
		url: 'https://google.com'
	},
]

test('GIFTS : add new gift', async(test) => {
	test.plan(1)
	const gifts = await new Gifts()
	const addGift = await gifts.add(
		mockGifts[0]
	)
	test.is(addGift, true, 'unable to add event')
	gifts.close()
})

test('GIFTS : error if url missing' , async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	try {
		await events.add({...mockGifts[0], url: undefined})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		events.close()
	}
})

test('GIFTS : error if name missing' , async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	try {
		await gifts.add({...mockGifts[0], name: undefined})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		events.close()
	}
})

test('GIFTS : error if eventId missing' , async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	try {
		await gifts.add({...mockGifts[0], eventId: undefined})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		events.close()
	}
})

test('GIFTS : error if price missing' , async(test) => {
	test.plan(1)
	const gifts = await new Gifts()

	try {
		await gifts.add({...mockGifts[0], price: undefined})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		events.close()
	}
})
