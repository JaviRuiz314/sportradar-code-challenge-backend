'use strict';

const axios = require('axios');


function createHTTPRequest(httpMethod, httpUrl) {
	return axios({
		method: httpMethod,
		url: httpUrl
	  });
}

module.exports = { createHTTPRequest }