const { log } = require('../_lib/log.js');
const apiFn = require('../_lib/api.js').try;

module.exports = async (req, res) => {
	const { success, response, error } = await apiFn(req.query.code);
	log.debug({
		code: req.query.code,
		success,
		response,
		error,
	});
	if (success) {
		res.status(200).json(response);
	} else {
		res.status(400).json({ error });
	}
};
