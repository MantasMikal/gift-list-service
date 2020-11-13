import mime from 'mime-types'
import fs from 'fs-extra'

/**
 * Function that handles image upload
 * Uploads an image to 'public/images/uploads' with current date in ms as file name
 * If file is undefined returns a placeholder instead
 * @param {File} file the image file
 * @returns {String} file with path
 */
const handleImageUpload = async(file) => {
	let formattedFileName
	if (file && file.name) {
		formattedFileName = `/uploads/${Date.now()}.${mime.extension(file.type)}`
		await fs.copy(file.path, `public/images${formattedFileName}`)
	} else {
		formattedFileName = 'thumbnail_placeholder.jpg'
	}

	return formattedFileName
}

export default handleImageUpload
