'use strict';

const app = require('./server');
require('dotenv').config();

app.listen(process.env.PORT, async () => {
	console.log(`Middleware running on port ${process.env.PORT}...`);
});

