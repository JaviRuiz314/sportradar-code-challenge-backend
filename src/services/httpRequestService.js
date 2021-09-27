'use strict';

const axios = require('axios');


function createAHTTPRequest(httpMethodmethod, httpUrl) {
	return axios({
		method: httpMethodmethod,
		url: httpUrl
	  });
}

module.exports = { createAHTTPRequest }