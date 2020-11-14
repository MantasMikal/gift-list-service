/** @module Gifts */

import sqlite from 'sqlite-async'
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
					FOREIGN KEY(eventId) REFERENCES events(id),\
					FOREIGN KEY(user) REFERENCES users(user)\
        );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
   * Adds a new gift
   * @returns {Boolean} true if operation was successful
   */
	async add({eventId, name, url, price}) {
		Array.from([name, eventId]).forEach((val) => {
			if (!val) throw Error('missing field')
		})
		try {
			const sql = 'INSERT INTO gifts (eventId, name, price, url)\
			VALUES($1, $2, $3, $4);'
			const values = [eventId, name, price, url]
			await this.db.run(sql, values)
			return true
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
   * retrieves all gifts of an event
   * @param {Number} id id of the event
   * @returns {Object} returns all gifts associated with event id
   */

	async getEventGifts(id) {
		if(!id || isNaN(id)) {
			throw Error('invalid or missing id')
		}
		const sql = 'SELECT * FROM gifts WHERE eventId = $1'
		return await this.db.all(sql, id)
	}

	/**
	 * Retrieves all users that have agreed to pledge gifts
	 * for an event
	 * @param {Number} id event id
	 * @returns {Array} array of users
	 */
	async getEventPledgedGiftsUsers(id) {
		if(!id || isNaN(id)) throw Error('Missing or invalid fields')
		const sql = 'SELECT users.* FROM gifts INNER JOIN users ON gifts.user = users.user WHERE gifts.eventId = $1'
		const users = await this.db.all(sql, id)
		return users
	}

	/**
   * Gets gift by id
   * @param {Number} id id of the gift
   * @returns {Object} returns the gift
   */

	async getById(id) {
		if(!id || isNaN(id)) {
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
   * @returns {Object} returns gift if operation was successful
   */

	async pledgeGift(giftId, user, eventId) {
		if(!user) throw Error('missing or invalid field')
		Array.from([giftId, eventId]).forEach((val) => {
			if (!val || isNaN(val)) throw Error('missing or invalid field')
		})

		try {
			const sql = 'UPDATE gifts SET user = $1 WHERE (id = $2 AND eventId = $3);'
			const values = [user, giftId, eventId]
			await this.db.run(sql, values)
			return await this.getById(giftId)
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	async close() {
		await this.db.close()
	}
}

export { Gifts }
