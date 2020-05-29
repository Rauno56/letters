const assert = require('assert');
const fs = require('fs');
const lodash = require('lodash');
require('string.prototype.matchall').shim();

const { log } = require('./log.js');

const N = 2;
const COLUMN = {
	name: 0,
	hash: 1,
	link: 2,
};
const hashRegExp = /^[a-zA-Z0-9_-]*$/;

const assertLink = (input) => {
	new URL(input);
	return input;
};
const assertHash = (input) => {
	if (input === null || input.length !== 11 || !hashRegExp.test(input)) {
		throw new Error(`Invalid hash value: ${JSON.stringify(input)}`);
	}
	return input;
};
const assertName = (input) => {
	assert.strictEqual(typeof input, 'string');
	return input;
};

const getHashStartGen = (n) => {
	return (obj) => {
		return obj.hash && obj.hash.substr(0, n);
	};
};

const getMatchString = getHashStartGen(N);

const parseEntriesFromString = (content) => {
	return content
		.split('\n')
		.filter((row) => row.trim() !== '')
		.map((row) => {
			const columns = row.split('\t');
			const name = assertName(columns[COLUMN.name]);
			const link = assertLink(columns[COLUMN.link]);
			const hash = assertHash(columns[COLUMN.hash]);

			return {
				name,
				hash,
				link,
				match: getMatchString({ hash }),
			};
		});
};

const getFirstValue = (value) => {
	assert(value.length === 1);
	return value[0];
};

const loadFromEnv = (varName) => {
	const value = process.env[varName];
	if (typeof value !== 'string') {
		throw new Error(`Environment var "${varName}" is unset`);
	}
	const data = Buffer.from(value, 'base64').toString('utf8');

	return parseEntriesFromString(data);
};

const loadFromFile = (filePath) => {
	const data = fs.readFileSync(filePath, 'utf8');

	return parseEntriesFromString(data);
};

const load = () => {
	const defaultEnvironmentVariable = 'LETTERS_DATA';
	const defaultFilePath = './data.raw';

	if (process.env[defaultEnvironmentVariable]) {
		log.info('loading from env');
		return loadFromEnv(defaultEnvironmentVariable);
	}

	log.info('loading from file');
	return loadFromFile(defaultFilePath);
};

const format = (result) => {
	result = result.filter((obj) => (!!obj.hash && !!obj.match));

	const t = lodash.groupBy(result, getMatchString);

	Object.entries(t)
		.forEach(([key, value]) => {
			if (value.length === 1) {
				return [key, value];
			}
			console.error(value);
			assert.fail('Multiple matches for a beginning');
		});

	const hashMap = lodash.mapValues(lodash.groupBy(result, 'hash'), getFirstValue);
	const matchMap = lodash.mapValues(lodash.groupBy(result, 'match'), (value) => {
		return getFirstValue(value).name;
	});

	return {
		hashMap,
		matchMap,
	};
};

module.exports = {
	loadFromEnv,
	loadFromFile,
	load: lodash.memoize(() => {
		const data = load();
		return format(data);
	}),
};
