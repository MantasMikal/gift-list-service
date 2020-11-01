/**
 * Adds new gift field
 * @param {Object} e event
*/
const addNewGiftField = (e) => {
	e.preventDefault()
	const template = `
	<div class="new-event__gift-list-fields" id='gift-list-fields'>
		<div class="new-event__gift-list-field">
			<div class="new-event__field new-event__field--gift-list">
				<label class="new-event__field-label" for='name'>Name</label>
				<input type='text' name='name' placeholder="Name of the gift" value=""
					required />
			</div>
			<div class="new-event__field new-event__field--gift-list">
				<label class="new-event__field-label" for='price'>Price £</label>
				<input min='0' step=".01" type='number' name='price' placeholder="0" value="" required />
			</div>
			<div class="new-event__field new-event__field--gift-list">
				<label class="new-event__field-label" for='url'>Link</label>
				<input type='url' name='url' value="" required />
			</div>
		</div>
	</div>`
	const fieldWrapper = document.getElementById('gift-list-fields')
	fieldWrapper && fieldWrapper.insertAdjacentHTML('beforeend', template)
}
