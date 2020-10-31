
import sqlite from 'sqlite-async'

class Events {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS events(\
          id INTEGER PRIMARY KEY AUTOINCREMENT,\
          userid INTEGER NOT NULL,\
          title TEXT NOT NULL,\
          datecreated INTEGER NOT NULL, \
          thumbnail TEXT,\
          FOREIGN KEY(userid) REFERENCES users(id)\
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
    const allEvents = await this.db.all(sql)
    for(const i in allEvents){
      if(!allEvents[i].thumbnail) allEvents[i].thumbnail = 'thumbnail_placeholder.jpg'
      const dateTime = new Date(allEvents[i].datecreated)
      const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
      allEvents[i].datecreated = date
    }

    return allEvents
  }
  
	async close() {
		await this.db.close()
	}
}

export { Events }
