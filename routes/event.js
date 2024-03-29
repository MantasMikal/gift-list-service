/**
 * Event routes
 * Handles Event specific routes
 * @module EventRoutes
 */

import Router from 'koa-router'
import { Events } from '../modules/events.js'
import { Gifts } from '../modules/gifts.js'
import mailTo from '../service/mailer/mailer.js'
import { createGiftCompleteTemplate, createGiftPledgeTemplate } from '../service/mailer/templates.js'
import { validateEvent } from '../controllers/validation.js'
import auth from '../controllers/auth.js'

const eventRouter = new Router({ prefix: '/event' })
const dbName = 'website.db'


/**
 * The event creation page
 * @name NewEvent Page
 * @route {GET} /event/new
 */
eventRouter.get('/new', auth, async(ctx) => {
	try {
		await ctx.render('new-event', ctx.hbs)
	} catch (err) {
		ctx.hbs.data = { error: err.message }
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The event creation script
 * @name NewEvent Script
 * @route {POST} /event/new
 * @bodyparam {String} title event title
 * @bodyparam {String} description event description
 * @bodyparam {Date} date date of the event
 * @bodyparam {String} gifts an array of gift objects as JSON
 */
eventRouter.post('/new', auth, validateEvent, async(ctx) => {
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
 *
 * @name Event Page
 * @queryparam id id of the event
 * @route {GET} /event/:id
 */
eventRouter.get('/:id', async(ctx) => {
	const events = await new Events(dbName)
	const gifts = await new Gifts(dbName)
	try {
		const event = await events.getById(ctx.params.id)
		const giftList = await gifts.getEventGifts(ctx.params.id)
		// Check what actions available to the user
		giftList.forEach(gift => {
			gift.canComplete = event.userId === ctx.session.userId && gift.user && gift.status !== 'Complete'
			gift.isCompleted = gift.status === 'Complete'
		})
		ctx.hbs.data = { event: event, gifts: giftList }
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
 * the event gift status update script
 * that sets gift status to complete
 * and sends an email to the donor
 *
 * @name CompleteEvent Script
 * @queryparam id id of the event
 * @queryparam id id of the gift
 * @route {POST} /event/:id/complete
 */
eventRouter.post('/complete/:id/:giftId', auth, async(ctx) => {
	const { id, giftId } = ctx.params
	const { userId } = ctx.session
	const events = await new Events(dbName)
	const gifts = await new Gifts(dbName)
	try {
		const eventOwner = await events.getEventOwner(id)
		if(eventOwner.id !== userId) return ctx.redirect(`/event/${id}/?msg=You must be event owner`)
		const gift = await gifts.updateStatusById(giftId, 'Complete')
		const donor = await gifts.getGiftDonor(giftId)
		await mailTo([donor.email], createGiftCompleteTemplate(eventOwner.user, gift.name))
		return ctx.redirect(`/event/${id}/?msg=Gift status has been updated!`)
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally {
		events.close()
		gifts.close()
	}
})


/**
 * Script that handles gift pledges
 * assigns user to the gift that will be pledged
 * sends an email to the event owner
 *
 * @name PledgeGift Script
 * @queryparam eventId id of the event
 * @queryparam giftId id of the gift
 * @route {POST} /event/:id/complete
 */
eventRouter.post('/pledge/:eventId/:giftId', auth, async(ctx) => {
	const { user } = ctx.session
	const { eventId, giftId } = ctx.params
	const eventUrl = `https://${ctx.host}/event/${eventId}`
	const gifts = await new Gifts(dbName)
	const events = await new Events(dbName)
	try {
		const gift = await gifts.pledgeGift(giftId, user, eventId)
		const eventOwner = await events.getEventOwner(eventId)
		await mailTo([eventOwner.email], createGiftPledgeTemplate(user, gift, eventUrl))
		return ctx.redirect(`/event/${eventId}/?msg=You agreed to pledge the gift!`)
	} catch (err) {
		console.log(err)
		ctx.hbs.data = { error: err.message, body: ctx.request.body }
		await ctx.render('error', ctx.hbs)
	} finally {
		gifts.close()
	}
})

export { eventRouter }
