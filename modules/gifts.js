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
					price INTEGER NOT NULL, \
          url TEXT NOT NULL,\
          FOREIGN KEY(eventId) REFERENCES events(id)\
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
		Array.from([name, url, price, eventId]).forEach((val) => {
			if (!val) throw Error('missing field')
		})

		try {
			const sql = `INSERT INTO gifts(eventId, name, price, url)\
			VALUES(${eventId}, "${name}", ${price}, "${url}")`

			await this.db.run(sql)

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
		console.log('getEventGifts -> id', id)
		if(!id || isNaN(id)) {
			throw Error('invalid or missing id')
		}

		const sql = `SELECT * FROM gifts WHERE eventId = ${id}`
		return await this.db.all(sql)
	}

	async close() {
		await this.db.close()
	}
}

export { Gifts }
