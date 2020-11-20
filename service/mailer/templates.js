/**
 * Mailer service to handle email templates
 * @module service/mailer
 */

/**
 * Creates an email template to be sent
 * to the event owner when someone pledges a gift
 * @param {String} user
 * @param {Object} gift
 * @returns {Object} body as html and email subject
 */
export const createGiftPledgeTemplate = (user, gift, eventUrl) => {
	const bodyHtml = `
	<p>${user} agreed to pledge one of your items</p>
  <p>Item name: ${gift.name}</p>
	<p>Item price: ${gift.price || 'Price is not specified'}</p>
	<a href="${eventUrl}">Go to the event page</a>
  `
	const subject = 'One of your items has been pledged!'
	return { bodyHtml, subject }
}

/**
 * Creates an email template to be sent
 * to users that have pledged the gifts in an event
 * @param {String} eventTitle event title
 * @returns {Object} body as html and email subject
 */
export const createGiftCompleteTemplate = (eventOwner, giftName) => {
	const bodyHtml = `
  ${eventOwner} has received your gift of ${giftName}! Thank you :)
  `
	const subject = `${eventOwner} has received your gift!`

	return { bodyHtml, subject }
}
