const {
	API_BASE,
} = require('./config.js');

const toUrl = (key) => {
	return `${API_BASE}/${key}/:code`;
};

const sleep = (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

module.exports = {
	toUrl,
	sleep,
};
