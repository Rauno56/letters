const pino = require('pino');
const { LOG_DATA } = require('./const.js');

const log = pino();
const httpLogger = require('pino-http')({
	logger: log,

	serializers: {
		err: pino.stdSerializers.err,
		req: (req) => {
			return {
				url: req.url,
				method: req.method,
				code: req.params && req.params.code,
			};
		},
		res: (res) => {
			return {
				status: res.statusCode,
				...res.raw[LOG_DATA],
			};
		},
	},
});

module.exports = {
	log,
	httpLogger,
};
