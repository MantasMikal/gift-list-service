/** @module Events */

import sqlite from "sqlite-async";
import mime from "mime-types";
import fs from "fs-extra";

class Events {
  constructor(dbName = ":memory:") {
    return (async () => {
      this.db = await sqlite.open(dbName);
      const sql =
        "CREATE TABLE IF NOT EXISTS events(\
          id INTEGER PRIMARY KEY AUTOINCREMENT,\
          userId INTEGER NOT NULL,\
					title TEXT NOT NULL,\
					description TEXT, \
          date INTEGER NOT NULL, \
          thumbnail TEXT,\
          FOREIGN KEY(userId) REFERENCES users(id)\
        );";
      await this.db.run(sql);
      return this;
    })();
  }

  /**
   * retrieves all events
   * @returns {Array} returns array containing all events in the database
   */
  async all() {
    const sql = "SELECT * FROM events";
    return await this.db.all(sql);
  }

  /**
   * Adds new event
   * @param {Number} userId user ID in the database
   * @param {String} titke event title
   * @param {String} description event description
   * @param {Date} date date of the event
   * @param {String} fileType file type of the image thumbnail
   * @param {String} filePath path to the file
   * @returns {Number} returns the inserted event ID
   */
  async add(data) {
    console.log("Adding new event", data);
    const {
      userId,
      title,
      description,
      date,
      fileType,
      filePath,
      fileName,
      fileSize,
		} = data;

    Array.from([title, date, userId]).forEach((val) => {
      if (!val) throw Error("missing field");
    });
  
		if(fileSize > 5000000) throw Error("image is too big")

    let formattedFileName;
    const formattedDate = new Date(date).toLocaleDateString();

    if (fileName) {
      formattedFileName = `${Date.now()}.${mime.extension(fileType)}`;
      await fs.copy(filePath, `public/images/${formattedFileName}`);
    } else {
      formattedFileName = 'public/images/thumbnail_placeholder.jpg'
    }

    try {
      const sql = `INSERT INTO events(userId, title, description, date, thumbnail)\
			VALUES(${userId}, "${title}", "${description}", "${formattedDate}", "${formattedFileName}")`;
      const { lastID } = await this.db.run(sql);
      return lastID;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async close() {
    await this.db.close();
  }
}

export { Events };
