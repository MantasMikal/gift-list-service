/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 */

import {Validator, ValidationError} from 'jsonschema'

import eventSchema from '../schemas/event.json'
import userShema from '../schemas/user.json'

/**
 * Wrapper that returns a Koa middleware validator for a given schema.
 * @param {object} schema - The JSON schema object
 * @param {string} resource - The name of the resource
 * @returns {function} - A Koa middleware handler taking (ctx, next) params
 */
const makeKoaValidator = (schema, resource) => {
	const v = new Validator()
	const validationOptions = {
		throwError: true,
		propertyName: resource
	}

	/**
   * Koa middleware handler function to do validation
   * @param {object} ctx - The Koa request/response context object
   * @param {function} next - The Koa next callback
   * @throws {ValidationError} a jsonschema library exception
   */
	const handler = async(ctx, next) => {
		try {
			v.validate(ctx.request.body, schema, validationOptions)
			await next()
		} catch (error) {
			if (error instanceof ValidationError) {
				console.error(error)
				ctx.status = 400
				return ctx.redirect(`${ctx.originalUrl}?msg=Validation error`)
			} else {
				throw error
			}
		}
	}
	return handler
}

export const validateEvent = makeKoaValidator(eventSchema.definitions.event, 'event')
export const validateUser = makeKoaValidator(userShema.definitions.user, 'user')
