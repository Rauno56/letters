const E = require('./_lib/api.js');
const { toUrl } = require('./_lib/utils.js');

const endpoints = Object.keys(E);

module.exports = (req, res) => {
	res.json({
		endpoints: endpoints.map(toUrl),
	});
};
