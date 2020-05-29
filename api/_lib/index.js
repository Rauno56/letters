const express = require('express');
const app = express();
const {
	PORT,
	FOR_REAL,
} = require('./config.js');
const { LOG_DATA } = require('./const.js');
const { log, httpLogger } = require('./log.js');
const { toUrl } = require('./utils.js');
const E = require('./api.js');

const throwError = (code, message) => {
	const e = new Error(message);
	e.code = code;

	throw e;
};

const endpoints = Object.keys(E);

app.use(require('helmet')());
const allowedOrigins = new Set([
	'http://localhost:1234',
	'http://localhost:3000',
]);

app.use((req, res, next) => {
	if (allowedOrigins.has(req.headers.origin)) {
		res.header('Access-Control-Allow-Origin', req.headers.origin);
	}
	httpLogger(req, res);
	next();
});

app.get('/', (req, res) => {
	res.json({
		endpoints: endpoints.map(toUrl),
	});
});

endpoints.forEach((endpoint) => {
	app.get(toUrl(endpoint), async (req, res) => {
		const { success, response, name, error } = await E[endpoint](req.params.code);
		res[LOG_DATA] = {
			code: req.params.code,
			success,
			name,
			response,
			error,
		};
		if (success) {
			res.json(response);
		} else {
			throwError(400, error);
		}
	});
});


app.use((req, res) => {
	throwError(404, 'Not found');
});

app.use((err, req, res, next) => {
	// log.error(err);
	res.status(err.code || 500);
	res.send({
		error: err.message,
	});
});

app.listen(PORT, () => {
	log.info({
		env: {
			FOR_REAL: process.env.FOR_REAL,
			PORT,
		},
		forReal: FOR_REAL,
	}, 'listening');
});
