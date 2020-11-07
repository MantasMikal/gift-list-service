/** @module Events */

import sqlite from 'sqlite-async'
import handleImageUpload from '../lib/image-upload.js'

class Events {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql =
        'CREATE TABLE IF NOT EXISTS events(\
          id INTEGER PRIMARY KEY AUTOINCREMENT,\
          userId INTEGER NOT NULL,\
					title TEXT NOT NULL,\
					description TEXT, \
          date INTEGER NOT NULL, \
          thumbnail TEXT,\
          FOREIGN KEY(userId) REFERENCES users(id)\
        );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
   * retrieves all events
   * @returns {Array} returns array containing all events in the database
   */
	async all() {
		const sql = 'SELECT * FROM events'
		return await this.db.all(sql)
	}

	/**
   * Adds new event
   * @param {Number} data.userId user ID in the database
   * @param {String} data.tilke event title
   * @param {String} data.description event description
   * @param {Date} data.date date of the event
   * @param {String} data.fileType file type of the image thumbnail
   * @param {String} data.filePath path to the file
   * @param {String} data.fileName name of the file
   * @returns {Number} returns the inserted event ID
   */
	async add(data) {
		Array.from([data.title, data.date, data.userId]).forEach((val) => {
			if (!val) throw Error('missing field')
		})
		const formattedDate = new Date(data.date).toLocaleDateString()
		const fileName = await handleImageUpload(data.thumbnail)
		try {
			const sql = 'INSERT INTO events(userId, title, description, date, thumbnail)\
			VALUES($1, $2, $3, $4, $5)'
			const values = [data.userId, data.title, data.description, formattedDate, fileName]
			const { lastID } = await this.db.run(sql, values)
			return lastID
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
   * Retrieves an event by id
   * @param {Number} id id of the event
   * @returns {Object} returns an event
   */
	async getById(id) {
		console.log('Getting event with id', id)
		if (!id || isNaN(id)) throw Error('invalid or missing')
		const sql = 'SELECT * FROM events WHERE id = $1'
		return await this.db.all(sql, id)
	}

	async close() {
		await this.db.close()
	}
}

export { Events }
