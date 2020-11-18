import sqlite from 'sqlite-async'
import handleImageUpload from '../lib/image-upload.js'
import { eventDatabaseSetup } from '../lib/test-setup-sql-queries.js'

/**
 * Represents events
 */
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
					status TEXT,\
          FOREIGN KEY(userId) REFERENCES users(id)\
        );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
   * Retrieves all events
   * @returns {Array} array containing all events in the database
   */
	async all() {
		const sql = 'SELECT * FROM events'
		return await this.db.all(sql)
	}

	/**
   * Adds new event
   * @param {Number} data.userId user ID in the database
   * @param {String} data.title event title
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
			const sql = 'INSERT INTO events(userId, title, description, date, thumbnail, status)\
			VALUES($1, $2, $3, $4, $5, "Active")'
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
   * @param {Number} id of the event
   * @returns {Object} an event object
   */
	async getById(id) {
		console.log('Getting event with id', id)
		if (!id || isNaN(id)) throw Error('invalid or missing')
		const sql = 'SELECT * FROM events WHERE id = $1'
		return await this.db.get(sql, id)
	}

	/**
	 * Updates event status by id
	 * @param {Number} id of the event
	 * @param {String} status current status of the event
	 * @returns {Object} updated event object if the operation successful
	 */
	async updateStatusById(id, status) {
		if(!id || isNaN(id) || !status) throw Error('Missing or inavild fields')
		const sql = 'UPDATE events SET status = $1 WHERE id = $2;'
		const values = [status, id]
		try {
			await this.db.run(sql, values)
			return await this.getById(id)
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
	 * Gets the event owner by event Id
	 * @param {Number} id of the event
	 * @returns {Object} user object
	 */
	async getEventOwner(id) {
		if(!id || isNaN(id)) throw Error('Missing or invalid fields')
		const sql = 'SELECT users.* FROM events INNER JOIN users ON events.userId = users.id WHERE events.id = $1'
		try {
			const user = await this.db.get(sql, id)
			return user
		} catch (err) {
			console.log(err)
			throw err
		}
	}


	/**
	 * Retrieves all users that have agreed to pledge gifts
	 * for an event
	 * @param {Number} id event id
	 * @returns {Array} array of users
	 */
	async getPledgedGiftsUsers(id) {
		if(!id || isNaN(id)) throw Error('Missing or invalid fields')
		const sql = 'SELECT users.* FROM gifts\
			INNER JOIN users ON gifts.user = users.user WHERE gifts.eventId = $1'
		return await this.db.all(sql, id)
	}

	/**
	 * Test setup
	 */
	async setUpTestDatabase() {
		if(process.env.NODE_ENV !== 'development') return
		try {
			await this.db.exec(eventDatabaseSetup)
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
	 * Closes database connection
	 */
	async close() {
		await this.db.close()
	}
}

export { Events }
