/**
 * Utility to extract list of gifts from the form fields.
 * Gift data from forms comes in key: array of values pairs
 * This function extracts those values and groups them.
 *
 * @param {Object} data object with entries of event
 * @returns {Array} of gifts
 */

const extractGiftList = (data) => {
	const attributes = ['name', 'price', 'url']
	if (Array.isArray(data['name'])) {
		return data['name'].map((_, i) => {
			const list = {}
			attributes.forEach((attr) => {
				list[attr] = data[attr][i]
			})

			return list
		})
	} else {
		return [{name: data['name'], price: data['price'], url: data['url']}]
	}
}

export default extractGiftList
