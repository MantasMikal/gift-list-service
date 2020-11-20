/**
 * Query that sets up basic data to test events module
 */
export const eventDatabaseSetup = `
  CREATE TABLE IF NOT EXISTS users
  (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, email TEXT);
  INSERT INTO users(user, pass, email) VALUES("jeff", "password", "jeff@email.com");
  INSERT INTO users(user, pass, email) VALUES("jeff2", "password2", "jeff2@email.com");
  INSERT INTO events(userId, title, description, date, thumbnail, status)
  VALUES(1, "Event Title","Description", 1605194313409, "thumbnail_placeholder.jpg", "Active");
  CREATE TABLE IF NOT EXISTS gifts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId INTEGER NOT NULL,
    name TEXT NOT NULL,
    price INTEGER, 
    url TEXT,
    user TEXT,
    FOREIGN KEY(eventId) REFERENCES events(id),
    FOREIGN KEY(user) REFERENCES users(user)
  );
  INSERT INTO gifts (eventId, user, name, price, url)
  VALUES(1, "jeff", "Gift 1", 12, "https://google.com");
  INSERT INTO gifts (eventId, user, name, price, url)
  VALUES(1, "jeff2", "Gift 2", 11, "https://google.com");
`
