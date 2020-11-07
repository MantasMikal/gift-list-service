/* eslint-disable no-unused-vars */

/**
 * New field template
 * @param {Event} i index of the event
 * @returns {String} html of a new field
 */
const newGiftFieldTemplate = (i) => `
	<div class="new-event__gift-list-fields" id='gift-list-fields'>
		<div class="new-event__gift-list-field">
			<div class="new-event__field new-event__field--gift-list">
				<label class="new-event__field-label" for='name'>Name</label>
				<input id='gift-name-${i}' type='text' name='name' placeholder="Name of the gift" value=""
					required />
			</div>
			<div class="new-event__field new-event__field--gift-list">
				<label class="new-event__field-label" for='price'>Price £</label>
				<input id='gift-price-${i}' min='0' step=".01" type='number' name='price' placeholder="0" value="" />
			</div>
			<div class="new-event__field new-event__field--gift-list">
				<label class="new-event__field-label" for='url'>Link</label>
				<input id='gift-url-${i}' type='url' name='url' value="" />
			</div>
		</div>
	</div>
`

/**
 * Adds new gift field
 * @param {Event} e event
 */
const addNewGiftField = (e) => {
	e.preventDefault()
	const fieldWrapper = document.getElementById('gift-list-fields')
	const currentFieldCount = document.querySelectorAll('.new-event__gift-list-field').length

	fieldWrapper &&
        fieldWrapper.insertAdjacentHTML('beforeend', newGiftFieldTemplate(currentFieldCount))
}

/**
 * Extracts gift fields form data,
 * Stringifies it, adds to a hidden field
 * and submits the form
 * @param {Event} e event
 */
window.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('event-form')
	form.addEventListener('submit', (e) => {
		const formGiftFields = document.querySelectorAll('.new-event__gift-list-field')
		const hiddenInputField = document.getElementById('gifts')
		const data = []

		// Prevent submit for the first time
		// To add gifts to the hidden field
		if(!hiddenInputField.value) e.preventDefault()

		formGiftFields.length && formGiftFields.forEach((_, i) => {
			data.push({
				name: document.getElementById(`gift-name-${i}`).value,
				price: document.getElementById(`gift-price-${i}`).value,
				url: document.getElementById(`gift-url-${i}`).value
			})
		})

		// Resubmit the form with the newly added field data
		hiddenInputField.setAttribute('value', JSON.stringify(data))
		form.submit()
	})
})
