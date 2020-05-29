const { log } = require('../_lib/log.js');
const apiFn = require('../_lib/api.js').check;

module.exports = async (req, res) => {
	const { success, response, name, error } = await apiFn(req.query.code);
	log.info({
		code: req.query.code,
		name,
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
