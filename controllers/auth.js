/**
 * Middleware that checks if user is authnenticated
 * @param {Object} ctx Koa request/response context object
 * @param {Function} next The Koa next callback
 */
const auth = async(ctx, next) => {
	if (ctx.hbs.authorised !== true) {
		return ctx.redirect('/login?msg=You need to log in to do this action')
	}
	await next()
}

export default auth
