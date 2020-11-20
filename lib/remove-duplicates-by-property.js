/**
 * Removes duplicate objects from array by property
 * @param {Array} array of objects
 * @param {String} prop property that should be used for comparison
 * @returns {Array} of unique objects
 */
const removeDuplicatesByProperty = (array, prop) => {
	if(!Array.isArray(array) || !prop) throw Error('Missing parameters')
	const flag = {}
	const unique = []
	array.forEach(el => {
		if(!flag[el[prop]]) {
			flag[el[prop]] = true
			unique.push(el)
		}
	})
	return unique
}

export default removeDuplicatesByProperty
