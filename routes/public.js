/**
 * Public routes
 * Handles HomePage and Authentication
 * @module PublicRoutes
 */

import Router from 'koa-router'
import bodyParser from 'koa-body'

const publicRouter = new Router()
publicRouter.use(bodyParser({multipart: true}))

import { Accounts } from '../modules/accounts.js'
import { Events } from '../modules/events.js'
import { validateUser } from '../controllers/validation.js'

const dbName = 'website.db'

/**
 * The home page.
 *
 * @name Home Page
 * @route {GET} /
 */
publicRouter.get('/', async ctx => {
	const events = await new Events(dbName)
	try {
		const allEvents = await events.all()
		ctx.hbs.data = { events: allEvents }
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
publicRouter.get('/register', async ctx => await ctx.render('register', ctx.hbs))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 * @bodyparam {String} user username
 * @bodyparam {String} pass password
 * @bodyparam {String} email email
 */
publicRouter.post('/register', validateUser, async ctx => {
	const account = await new Accounts(dbName)
	const {user, pass, email} = ctx.request.body
	try {
		await account.register(user, pass, email)
		ctx.redirect(`/login?msg=New user "${user}" added, you need to log in`)
	} catch(err) {
		ctx.hbs.data = { error: err.message, body: ctx.request.body }
		await ctx.render('register', ctx.hbs)
	} finally {
		account.close()
	}
})

publicRouter.get('/postregister', async ctx => await ctx.render('validate'))

publicRouter.get('/validate/:user/:token', async ctx => {
	try {
		console.log('VALIDATE')
		console.log(`URL --> ${ctx.request.url}`)
		if(!ctx.request.url.includes('.css')) {
			console.log(ctx.params)
			const milliseconds = 1000
			const now = Math.floor(Date.now() / milliseconds)
			const account = await new Accounts(dbName)
			await account.checkToken(ctx.params.user, ctx.params.token, now)
			ctx.hbs.data = { msg: `Account "${ctx.params.user}" has been validated` }
			await ctx.render('login', ctx.hbs)
		}
	} catch(err) {
		await ctx.render('login', ctx.hbs)
	}
})

/**
 * The user login page.
 *
 * @name Login Page
 * @route {GET} /login
 */
publicRouter.get('/login', async ctx => {
	await ctx.render('login', ctx.hbs)
})

/**
 * Script to authenticate returning users
 *
 * @name Login Script
 * @route {POST} /login
 * @bodyparam {String} user username
 * @bodyparam {String} pass password
 */
publicRouter.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.data = { body: ctx.request.body }
	try {
		const body = ctx.request.body
		const id = await account.login(body.user, body.pass)
		console.log('Logged in as', id, body.user)
		ctx.session.authorised = true
		ctx.session.userId = id
		ctx.session.user = body.user
		ctx.session.email = body.email
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=You are now logged in`)
	} catch(err) {
		ctx.hbs.data = { error: err.message }
		await ctx.render('login', ctx.hbs)
	} finally {
		account.close()
	}
})

/**
 * Script to log out
 *
 * @name LogOut Script
 * @route {GET} /logout
 */
publicRouter.get('/logout', async ctx => {
	ctx.session.authorised = null
	delete ctx.session.user
	delete ctx.session.userId
	delete ctx.session.email
	ctx.redirect('/?msg=You are now logged out')
})

export { publicRouter }
