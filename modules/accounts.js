import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'

const saltRounds = 10

/**
 * Represents user
 */
class Accounts {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql =
        'CREATE TABLE IF NOT EXISTS users\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, email TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
   * Registers a new user
   * @param {String} user the chosen username
   * @param {String} pass the chosen password
   * @returns {Boolean} true if the new user has been added
   */
	async register(user, pass, email) {
		Array.from(arguments).forEach((val) => {
			if (val.length === 0) throw new Error('missing field')
		})
		let sql = 'SELECT COUNT(id) as records FROM users WHERE user = $1;'
		const data = await this.db.get(sql, user)
		if (data.records !== 0)
			throw new Error(`username "${user}" already in use`)
		sql = 'SELECT COUNT(id) as records FROM users WHERE email = $1;'
		const emails = await this.db.get(sql, email)
		if (emails.records !== 0)
			throw new Error(`email address "${email}" is already in use`)
		pass = await bcrypt.hash(pass, saltRounds)
		sql = 'INSERT INTO users(user, pass, email) VALUES($1, $2, $3)'
		const values = [user, pass, email]
		await this.db.run(sql, values)
		return true
	}

	/**
   * Checks to see if a set of login credentials are valid
   * @param {String} username the username to check
   * @param {String} password the password to check
   * @returns {Number} user id if credentials are valid
   */
	async login(username, password) {
		let sql = 'SELECT count(id) AS count FROM users WHERE user = $1;'
		const records = await this.db.get(sql, username)
		if (!records.count) throw new Error(`username "${username}" not found`)
		sql = 'SELECT id, pass FROM users WHERE user = $1;'
		const record = await this.db.get(sql, username)
		const valid = await bcrypt.compare(password, record.pass)
		if (valid === false)
			throw new Error(`invalid password for account "${username}"`)
		return record.id
	}

	/**
   * Retrieves an user by id
   * @param {Number} id id of the user
   * @returns {Object} user object
   */
	async getById(id) {
		if (!id || isNaN(id)) throw Error('invalid or missing id')
		const sql = 'SELECT * FROM users WHERE id = $1'
		return await this.db.all(sql, id)
	}

	/**
	 * Closes database connection
	 */
	async close() {
		await this.db.close()
	}
}

export { Accounts }
