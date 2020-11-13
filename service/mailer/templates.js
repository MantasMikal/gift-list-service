/**
 * Creates an email template to be sent
 * to the event owner when someone pledges a gift
 * @param {String} user
 * @param {Object} gift
 * @returns {Object} body as html and email subject
 */
export const createGiftPledgeTemplate = (user, gift) => {
	const bodyHtml = `
  <p>Item name: ${gift.name}</p>
  <p>Item price: ${gift.price || 'Price is not specified'}</p>
  `
	const subject = `${user} agreed to pledge one of your items`
	return { bodyHtml, subject }
}

/**
 * Creates an email template to be sent
 * to users that have pledged the gifts in an event
 * @param {String} eventTitle event title
 * @returns {Object} body as html and email subject
 */
export const createEventCompleteTemplate = (eventTitle) => {

	const bodyHtml = `
  ${eventTitle} was completed! Thank you for agreeing to pledge the gifts :)
  `
	const subject = `${eventTitle} was completed!`

	return { bodyHtml, subject }
}