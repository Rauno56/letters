const {
	hashMap,
	matchMap,
} = require('./data.js').load();

const findMatch = (input) => {
	if (typeof input !== 'string') {
		return null;
	}
	let l = 0;
	while (l++ < input.length) {
		const match = matchMap[input.substr(0, l)];
		if (match) {
			return match;
		}
	}
};

const E = {
	try: (input) => {
		const response = findMatch(input);
		if (response) {
			return { success: true, response };
		}
		return { success: false, error: 'No match found' };
	},
	check: async (input) => {
		if (typeof input !== 'string') {
			return { success: false, error: 'Invalid code type' };
		}
		if (input.length !== 11) {
			return { success: false, error: 'Invalid code length' };
		}
		if (hashMap[input]) {
			const name = hashMap[input].name;
			return { success: true, name, response: hashMap[input].link };
		}

		const caseInsensitiveMatch = Object.keys(hashMap).filter((key) => {
			return key.toLowerCase() === input.toLowerCase();
		});

		if (caseInsensitiveMatch.length > 0) {
			return { success: false, error: 'Invalid character case in code' };
		}

		return { success: false, error: 'Invalid code' };
	},
};

module.exports = E;
