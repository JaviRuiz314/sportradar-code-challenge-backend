'use strict';

const 
	express = require('express'),
	app = express(),
	cors = require('cors'),
	marked = require('marked'),
	routes = require('./routes'),
	fs = require('fs');

	app.use(cors());

	app.get('/', function (req, res) {
		const
			path = './README.md',
			file = fs.readFileSync(path, 'utf8');
		res.send(marked(file.toString()));
	});

	app.use(routes.Matches);

module.exports = app;