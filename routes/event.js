import Router from 'koa-router'

import { Accounts } from '../modules/accounts.js'
import { Events } from '../modules/events.js'
import { Gifts } from '../modules/gifts.js'

const eventRouter = new Router({ prefix: '/event' })

const dbName = 'website.db'

eventRouter.get('/new', async(ctx) => {
	try {
		console.log(ctx.hbs)
		if (ctx.hbs.authorised !== true)
			return ctx.redirect('/login?msg=you need to log in&referrer=/event/new')
		await ctx.render('new-event', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

eventRouter.post('/new', async(ctx) => {
	const events = await new Events(dbName)
	const gifts = await new Gifts(dbName)
	const giftList = JSON.parse(ctx.request.body.gifts)
	try {
		ctx.request.body.userId = ctx.session.userId
		ctx.request.body.thumbnail = ctx.request.files.thumbnail
		const eventId = await events.add(ctx.request.body)
		giftList.forEach(async(gift) => await gifts.add({ eventId, ...gift }))

		return ctx.redirect('/?msg=New event has been added')
	} catch (err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		events.close()
		gifts.close()
	}
})

eventRouter.get('/:id', async(ctx) => {
	const { id } = ctx.params
	const events = await new Events(dbName)
	const gifts = await new Gifts(dbName)
	const users = await new Accounts(dbName)
	try {
		const event = await events.getById(id)
		const giftList = await gifts.getEventGifts(id)
		ctx.hbs.event = event[0]
		ctx.hbs.gifts = giftList
		await ctx.render('event', ctx.hbs)
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally {
		events.close()
		gifts.close()
		users.close()
	}
})

eventRouter.post('/pledge/:eventId', async(ctx) => {
	const { eventId } = ctx.params
	const { user } = ctx.session
	console.log('Pledging gift user', user)
	const { giftId } = ctx.request.body
	const gifts = await new Gifts(dbName)
	try {
		await gifts.pledgeGift(giftId, user, eventId)
		return ctx.redirect(
			`/event/${eventId}/?msg=You agreed to pledge the gift!`
		)
	} catch (err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('error', ctx.hbs)
	} finally {
		gifts.close()
	}
})

export { eventRouter }
