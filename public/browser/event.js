/* eslint-disable no-unused-vars */

/**
 * Adds new gift field
 * @param {Number} userId event owner id
 * @param {Number} eventId event id
 */
const handleEventStatus = async(eventId) => {
	const response = await fetch(`/event/${eventId}/complete`, {
		method: 'POST',
		redirect: 'follow',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if(response.redirected) {
		window.location.href = response.url
	}
}
