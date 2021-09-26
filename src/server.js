'use strict';

const 
	express = require('express'),
	app = express(),
	marked = require('marked'),
	routes = require('./routes'),
	fs = require('fs');

	app.get('/', function (req, res) {
		const
			path = './README.md',
			file = fs.readFileSync(path, 'utf8');
		res.send(marked(file.toString()));
	});

	app.use(routes.Matches);

module.exports = app;