const express = require(`express`)
const bodyParser = require(`body-parser`)
const genUUID = require(`./util/main_util`).genUUID

// Database Setup
const sqlite3 = require(`sqlite3`).verbose()
const db = new sqlite3.Database(`./todo.db`)


module.exports = (function() {
	`use strict`;

	const router = express.Router()
		  router.use(bodyParser.json()) // support json encoded bodies
		  router.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

	// ROUTES
	// -------------------------------------------------------------- //
	router.get(`/`, (req, res) => {
		res.send(`API HOME`);
	})


	// get lists
	router.get(`/lists`, (req, res) => {
		let lists = []

		db.each(`SELECT * FROM lists`, (err, row) => {
			if(err !== null) {
				console.log(err);
			} else {
				lists.push(row);
			}
		}, function() { res.send(lists) })

	})

	// get list
	router.get(`/list/:id`, (req, res) => {
		let list

		db.each(`SELECT * FROM lists WHERE id="${req.params.id}"`, (err, row) => {
			if(err !== null) {
				console.log(err);
			} else {
				list = row;
			}
		}, function() { res.send(list) })

	})

	// get list
	router.get(`/list/:id/todos`, (req, res) => {
		let todos = []

		db.each(`SELECT * FROM todos WHERE list_ref="${req.params.id}"`, (err, row) => {
			if(err !== null) {
				console.log(err);
			} else {
				todos.push(row);
			}
		}, function() { res.send(todos) })

	})


	// get todos
	router.get(`/todos`, (req, res) => {
		let todos = []

		db.each(`SELECT * FROM todos`, (err, row) => {
			if(err !== null) {
				console.log(err);
			} else {
				todos.push(row);
			}
		}, function() { res.send(todos) })

	})

	// get todo
	router.get(`/todo/:id`, (req, res) => {
		let todo

		db.each(`SELECT * FROM todos WHERE id="${req.params.id}"`, (err, row) => {
			if(err !== null) {
				console.log(err);
			} else {
				todo = row;
			}
		}, function() { res.send(todo) })
	})


	// post list
	router.post(`/list`, (req, res) => {
		let newList = {
			id: genUUID(),
			name: req.body.text,
			todo_count: 0
		}

		db.run(`INSERT INTO lists(id, name, todo_count) VALUES ("${newList.id}", "${newList.name}", "${newList.todo_count}");`)

		res.send(newList)
	})

	// post todo
	router.post(`/todo`, (req, res) => {
		let newTodo = {
			id: genUUID(),
			text: req.body.text,
			active: 1,
			list_ref: req.body.list_ref
		}

		db.run(`INSERT INTO todos(id, text, active, list_ref) VALUES ("${newTodo.id}", "${newTodo.text}", "${newTodo.active}", "${newTodo.list_ref}");`)
		db.run(`UPDATE lists SET todo_count = todo_count + 1 WHERE id="${newTodo.list_ref}"`)

		res.send(newTodo)
	})

	// put list
	router.put(`/list`, (req, res) => {
		let updatedList = {
			id: req.body.id,
			name: req.body.text,
			todo_count: req.body.count
		}

		db.run(`UPDATE lists SET name="${req.body.text}", todo_count="${req.body.count}" WHERE id="${req.body.id}"`)

		res.send(updatedList)
	})

	// put todo
	router.put(`/todo`, (req, res) => {
		let updatedTodo = {
			id: req.body.id,
			text: req.body.text,
			active: req.body.active,
			list_ref: req.body.list_ref
		}

		db.run(`UPDATE todos SET text="${req.body.text}", active="${req.body.active}", list_ref="${req.body.list_ref}" WHERE id="${req.body.id}"`)

		res.send(updatedTodo)
	})

	// delete list
	router.delete(`/list`, (req, res) => {

		db.run(`DELETE FROM lists WHERE id="${req.body.id}"`)

		res.send(req.body.id)
	})

	// delete todo
	router.delete(`/todo`, (req, res) => {

		db.run(`DELETE FROM todos WHERE id="${req.body.id}"`)
		db.run(`UPDATE lists SET todo_count = todo_count - 1 WHERE id="${req.body.list_ref}"`)

		res.send(req.body.id)
	})


	return router;
})()