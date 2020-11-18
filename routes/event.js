/**
 * Event routes
 * Handles Event specific routes
 * @module EventRoutes
 */

import Router from 'koa-router'
import { Events } from '../modules/events.js'
import { Gifts } from '../modules/gifts.js'
import mailTo from '../service/mailer/mailer.js'
import { createEventCompleteTemplate, createGiftPledgeTemplate } from '../service/mailer/templates.js'
import removeDuplicatesByProperty from '../lib/remove-duplicates-by-property.js'

const eventRouter = new Router({ prefix: '/event' })
const dbName = 'website.db'

/**
 * The event details page
 *
 * @name Event Page
 * @param id id of the event
 * @route {GET} /event/:id
 */
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

/**
 * The event creation page
 *
 * @name NewEvent Page
 * @route {GET} /event/new
 */
eventRouter.get('/new', async(ctx) => {
	try {
		console.log(ctx.hbs)
		if (ctx.hbs.authorised !== true)
			return ctx.redirect('/login?msg=You need to log in&referrer=/event/new')
		await ctx.render('new-event', ctx.hbs)
	} catch (err) {
		ctx.hbs.data = { error: err.message }
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The event creation script
 *
 * @name NewEvent Script
 * @route {POST} /event/new
 */
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
		ctx.hbs.data = { error: err.message }
		await ctx.render('error', ctx.hbs)
	} finally {
		events.close()
		gifts.close()
	}
})

/**
 * The event details page
 * @name EventDetails Page
 * @route {POST} /event/:id
 */
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

/**
 * The event status update script
 * Sets event status to complete
 * Sends an email to all participants
 *
 * @name CompleteEvent Script
 * @param id id of the event
 * @route {POST} /event/:id/complete
 */
eventRouter.post('/:id/complete', async(ctx) => {
	const { id } = ctx.params
	const events = await new Events(dbName)
	try {
		const { title } = await events.updateStatusById(id, 'Complete')
		const users = await events.getPledgedGiftsUsers(id)
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

/**
 * Script that handles gift pledges
 * Assigns user to the gift that will be pledged
 * Sens an email to the event owner
 *
 * @name CompleteEvent Script
 * @param eventId id of the event
 * @param giftId id of the gift
 * @route {POST} /event/:id/complete
 */
eventRouter.post('/pledge/:eventId/:giftId', async(ctx) => {
	const { eventId, giftId } = ctx.params
	const eventUrl = `https://${ctx.host}/event/${eventId}`
	const gifts = await new Gifts(dbName)
	const events = await new Events(dbName)
	try {
		const gift = await gifts.pledgeGift(giftId, ctx.session.user, eventId)
		const eventOwner = await events.getEventOwner(eventId)
		await mailTo([eventOwner.email], createGiftPledgeTemplate(ctx.session.user, gift, eventUrl))
		return ctx.redirect(
			`/event/${eventId}/?msg=You agreed to pledge the gift!`
		)
	} catch (err) {
		console.log(err)
		ctx.hbs.data = { error: err.message, body: ctx.request.body }
		await ctx.render('error', ctx.hbs)
	} finally {
		gifts.close()
	}
})

export { eventRouter }
