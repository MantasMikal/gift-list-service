import test from 'ava'
import removeDuplicatesByProperty from '../lib/remove-duplicates-by-property.js'

test('LIB:removeDuplicatesByProperty - should remove duplicate props', async(test) => {
	test.plan(1)
	const obj = [{ name: '1' }, { name: '2' }, { name: '1' }]
	const actual = removeDuplicatesByProperty(obj, 'name')
	const expected = [{ name: '1' }, { name: '2' }]
	test.deepEqual(actual, expected, 'Does not remove objects')
})


test('LIB:removeDuplicatesByProperty - should throw if parameters missing', async(test) => {
	test.plan(1)
	const obj = {foo: 'bar'}
	try {
		removeDuplicatesByProperty(obj, 'name')
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'Missing parameters', 'incorrect error message')
	}
})
