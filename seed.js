const sqlite3 = require(`sqlite3`).verbose()
const main_util = require('./util/main_util')

const db = new sqlite3.Database(`todo.db`)

//DATABASE SEEDING
db.serialize(() => {

	// FIELDS
	const listsFields = `id Str NOT NULL UNIQUE, `
					  + `name Str, `
					  + `todo_count Int, `
					  + `PRIMARY KEY(id)`

	const todosFields = `id Str NOT NULL UNIQUE, `
					  + `text Str, `
					  + `active Int, `
					  + `list_ref Str, `
					  + `PRIMARY KEY(id)`


	db.run(`DROP TABLE IF EXISTS lists;`)
	db.run(`CREATE TABLE lists (${listsFields})`)

	db.run(`DROP TABLE IF EXISTS todos;`)
	db.run(`CREATE TABLE todos (${todosFields})`)


	// Seed Lists & Todos Tables
	let listColumns = `id, name, todo_count`
	let todoColumns = `id, text, active, list_ref`


	// SEEDS
	for (var i = 0; i < 5; i++) {
		let ref = main_util.genUUID();

		db.run(`INSERT INTO lists(${listColumns}) VALUES ("${ref}", "List_${i}", "2");`)

		db.run(`INSERT INTO todos(${todoColumns}) VALUES ("${main_util.genUUID()}", "task #${i}", "1", "${ref}");`)
		db.run(`INSERT INTO todos(${todoColumns}) VALUES ("${main_util.genUUID()}", "task #${i}.5", "1", "${ref}");`)
	}


})
db.close()


// Log Results
console.log(`\x1b[36m%s\x1b[0m`, `Finished DB Seed!`)
