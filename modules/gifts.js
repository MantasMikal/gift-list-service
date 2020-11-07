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
		console.log('Adding new gift', {name, url, price})
		Array.from([name, eventId]).forEach((val) => {
			if (!val) throw Error('missing field')
		})
		try {
			const sql = 'INSERT INTO gifts (eventId, name, price, url)\
			VALUES($1, $2, $3, $4 );'
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
		const sql = `SELECT * FROM gifts WHERE eventId = ${id}`
		return await this.db.all(sql)
	}

	/**
   * Assigns user to the gift of the event
	 * to mark it as pledged
   * @param {Number} giftId id of the gift
	 * @param {String} user username of the user
	 * @param {Number} eventId id of the event
   * @returns {Boolean} returns true if operation was successful
   */

	async pledgeGift(giftId, user, eventId) {
		if(!user) throw Error('missing or invalid field')
		Array.from([giftId, eventId]).forEach((val) => {
			if (!val || isNaN(val)) throw Error('missing or invalid field')
		})

		try {
			const sql = `UPDATE gifts SET user = "${user}" WHERE (id = ${giftId} AND eventId = ${eventId});`
			await this.db.all(sql)
			return true
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
