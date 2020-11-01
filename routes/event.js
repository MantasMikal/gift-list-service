
import Router from 'koa-router'
import extractGiftList from '../lib/extract-gifts.js'

import { Events } from '../modules/events.js'
import { Gifts } from '../modules/gifts.js'

const eventRouter = new Router({ prefix: '/event' })

const dbName = 'website.db'

eventRouter.get('/new', async ctx => {
	try {
		console.log(ctx.hbs)
		if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/event/new')
		await ctx.render('new-event', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

eventRouter.post('/new', async ctx => {
	console.log('Adding new event', ctx.request.body)
	const events = await new Events(dbName)
	const gifts = await new Gifts(dbName)
	const giftList = extractGiftList(ctx.request.body)

	try {
		ctx.request.body.userId = ctx.session.userId
		if(ctx.request.files.thumbnail.name) {
			ctx.request.body.filePath = ctx.request.files.thumbnail.path
			ctx.request.body.fileName = ctx.request.files.thumbnail.name
			ctx.request.body.fileType = ctx.request.files.thumbnail.type
			ctx.request.body.fileSize = ctx.request.files.thumbnail.size
		}

		const eventId = await events.add(ctx.request.body)
		giftList.forEach(async(gift) => await gifts.add({eventId, ...gift}))

		return ctx.redirect('/?msg=New event has been added')

	} catch (err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('error', ctx.hbs)
	} finally {
		events.close()
	}
})

eventRouter.get('/:id', async ctx => {
	const { id } = ctx.params

	const events = await new Events(dbName)
	const gifts = await new Gifts(dbName)

	try {
		const event = await events.getById(id)
		console.log('event', event, id)
		const giftList = await gifts.getEventGifts(id)

		ctx.hbs.event = event[0]
		ctx.hbs.gifts = giftList
		await ctx.render('event', ctx.hbs)
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})

export { eventRouter }
