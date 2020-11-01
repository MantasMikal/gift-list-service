/** @module Gifts */

import sqlite from 'sqlite-async'

class Gifts {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql =
        'CREATE TABLE IF NOT EXISTS gifts(\
          id INTEGER PRIMARY KEY AUTOINCREMENT,\
          eventid INTEGER NOT NULL,\
					name TEXT NOT NULL,\
					price INTEGER NOT NULL, \
          url TEXT NOT NULL,\
          FOREIGN KEY(eventid) REFERENCES events(id)\
        );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
   * Adds new event
   * @returns {Boolean} true if operation was successful
   */
	async add(eventId, {name, url, price}) {
		console.log('Adding new gift', {name, url, price})
		Array.from([name, url, price, eventId]).forEach((val) => {
      if (!val) throw Error("missing field");
		});    

		try {
			const sql = `INSERT INTO gifts(eventid, name, price, url)\
			VALUES(${eventId}, "${name}", ${price}, "${url}")`

			await this.db.run(sql)

			return true
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	async close() {
		await this.db.close()
	}
}

export { Gifts }
