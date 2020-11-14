import Router from 'koa-router'
import { Events } from '../modules/events.js'
import { Gifts } from '../modules/gifts.js'
import mailTo from '../service/mailer/mailer.js'
import { createEventCompleteTemplate, createGiftPledgeTemplate } from '../service/mailer/templates.js'
import removeDuplicatesByProperty from '../lib/remove-duplicates-by-property.js'

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
	try {
		const event = await events.getById(id)
		const giftList = await gifts.getEventGifts(id)
		ctx.hbs.data = { event: event, gifts: giftList }
		ctx.hbs.canComplete = event.status !== 'Complete' && event.userId === ctx.session.userId
		await ctx.render('event', ctx.hbs)
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally {
		events.close()
		gifts.close()
	}
})

eventRouter.post('/:id/complete', async(ctx) => {
	const { id } = ctx.params
	const events = await new Events(dbName)
	try {
		const { title } = await events.updateStatusById(id, 'Complete')
		const users = await events.getEventPledgedGiftsUsers(id)
		const uniqueUsers = removeDuplicatesByProperty(users, 'id')
		await mailTo(uniqueUsers.map(usr => usr.email), createEventCompleteTemplate(title))
		return ctx.redirect(
			`/event/${id}/?msg=Event status has been updated!`
		)
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally {
		events.close()
	}
})

eventRouter.post('/pledge/:eventId/:giftId', async(ctx) => {
	const { eventId, giftId } = ctx.params
	const gifts = await new Gifts(dbName)
	const events = await new Events(dbName)
	try {
		const gift = await gifts.pledgeGift(giftId, ctx.session.user, eventId)
		const eventOwner = await events.getEventOwner(eventId)
		await mailTo([eventOwner.email], createGiftPledgeTemplate(ctx.session.user, gift))
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
