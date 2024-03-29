import sqlite from 'sqlite-async'
import { giftDatabaseSetup } from '../lib/test-setup-sql-queries.js'

/**
 * Represents gifts
 */
class Gifts {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql =
        'CREATE TABLE IF NOT EXISTS gifts(\
          id INTEGER PRIMARY KEY AUTOINCREMENT,\
					eventId INTEGER NOT NULL,\
					name TEXT NOT NULL,\
					price INTEGER, \
					url TEXT,\
					user TEXT,\
					status TEXT NOT NULL, \
					FOREIGN KEY(eventId) REFERENCES events(id),\
					FOREIGN KEY(user) REFERENCES users(user)\
        );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
   * Adds a new gift
   * @param {Number} eventId id of the event
   * @param {String} name name of the gift
   * @param {String} url url where to buy the gift
   * @param {Number} price price of the gift
   * @returns {Boolean} true if operation was successful
   */
	async add({ eventId, name, url, price }) {
		Array.from([name, eventId]).forEach((val) => {
			if (!val) throw Error('missing field')
		})
		try {
			const sql =
        'INSERT INTO gifts (eventId, name, price, url, status)\
			VALUES($1, $2, $3, $4, "Active");'
			const values = [eventId, name, price, url]
			await this.db.run(sql, values)
			return true
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
   * Retrieves all gifts of an event
   * @param {Number} id id of the event
   * @returns {Array} array of gifts associated with event id
   */
	async getEventGifts(id) {
		if (!id || isNaN(id)) {
			throw Error('invalid or missing id')
		}
		const sql = 'SELECT * FROM gifts WHERE eventId = $1'
		return await this.db.all(sql, id)
	}

	/**
   * Gets gift by id
   * @param {Number} id id of the gift
   * @returns {Object} returns the gift object
   */
	async getById(id) {
		if (!id || isNaN(id)) {
			throw Error('invalid or missing id')
		}
		const sql = 'SELECT * FROM gifts WHERE id = $1'
		return await this.db.get(sql, id)
	}

	/**
   * Assigns user to the gift of the event
   * to mark it as pledged
   * @param {Number} giftId id of the gift
   * @param {String} user username of the user
   * @param {Number} eventId id of the event
   * @returns {Object} returns gift object if operation was successful
   */
	async pledgeGift(giftId, user, eventId) {
		if (!user) throw Error('missing or invalid field')
		Array.from([giftId, eventId]).forEach((val) => {
			if (!val || isNaN(val)) throw Error('missing or invalid field')
		})

		try {
			const sql =
        'UPDATE gifts SET user = $1 WHERE (id = $2 AND eventId = $3);'
			const values = [user, giftId, eventId]
			await this.db.run(sql, values)
			return await this.getById(giftId)
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
   * Updates the gift status
   * @param {Number} giftId id of the gift
   * @param {String} status status of the gift ("Active" | "Complete")
   * @returns {Object} updated gift if successfull
   */
	async updateStatusById(giftId, status) {
		if (!giftId || isNaN(giftId) || !status)
			throw Error('missing or invalid field')
		try {
			const sql = 'UPDATE gifts SET status = $1 WHERE id = $2;'
			await this.db.run(sql, [status, giftId])
			return await this.getById(giftId)
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	async getGiftDonor(giftId) {
		if (!giftId || isNaN(giftId)) throw Error('missing or invalid field')
		try {
			const sql =
        'SELECT users.* FROM gifts INNER JOIN users ON gifts.user = users.user WHERE gifts.id = $1'
			return await this.db.get(sql, giftId)
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
   * Test setup
   */
	async setUpTestDatabase() {
		if (process.env.NODE_ENV !== 'development') return
		try {
			await this.db.exec(giftDatabaseSetup)
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

export { Gifts }
