const colors = require('colors/safe');
const diff = require('diff');
const kirjad = require('./kirjad');

console.log(kirjad);
const log = console.log;

const printDiff = (one, other) => {
	const res = diff.diffChars(one, other);
	return res.map((part) => {
		var color = part.added ? 'green' :
			part.removed ? 'red' : 'white';
		return colors[color](part.value);
	}).join('');
};

const printDiffs = (arr) => {
	return arr.map((part) => {
		var color = part.added ? 'green' :
			part.removed ? 'red' : 'white';
		return colors[color](part.value);
	}).join('');
};

const diffWithLast = (val, idx, arr) => {
	return printDiff(arr[idx - 1] || '', arr[idx]);
};

const inverseDiffs = (diffArray) => {
	return diffArray
		.filter((obj) => {
			return !obj.removed;
		})
		.map((obj) => obj.value).join('');
};

const analyze = (key) => {
	const def = kirjad[key];
	def.steps = typeof def.steps === 'string' ?
		def.steps.trim().split('\n').map((step) => step.trim()).filter((s) => !!s) :
		def.steps;

	console.log('def', def.steps);
	const name = def.name;
	log('analyzing', key, 'belonging to', name);
	log('length diff', name.length - key.length);
	const steps = (new Array(11)).fill('').map((val, idx) => {
		log('val', val, idx);
		return def.steps[idx] || key.substr(0, idx + 1);
	});
	steps[10] = def.steps[10] || name;
	if (def.steps.length) {
		log('steps:\n' + steps.map(diffWithLast).join('\n'));
	} else {
		log('steps:\n' + steps.join('\n'));
	}

	log();

	const res = diff.diffChars('WarDiasnA', 'Mariana')
		.flatMap((obj) => {
			if (obj.count === 1) {
				return obj;
			} else if (obj.count === obj.value.length) {
				return obj.value.split('')
					.map((letter) => ({
						...obj,
						count: 1,
						value: letter,
					}));
			} else {
				throw new Error('blaj');
			}
		});
	log(res);
	const partial = res.filter((obj) => (!obj.added && !obj.removed) || Math.random() > 0.99);
	log('WarDiasnA');
	log('Mariana');
	log(printDiffs(res));
	log(printDiffs(partial));
	log(inverseDiffs(res));
	log(inverseDiffs(partial));
};

const bind = (nr, min = 0, max = 1) => {
	return Math.max(Math.min(nr, 1), 0);
};

const isUnChanged = (obj) => {
	return !obj.added && !obj.removed;
};
const splitDiffs = (diffList) => {
	// log(diffList);
	return diffList
		.flatMap((obj) => {
			if (obj.count === 1) {
				return obj;
			} else if (obj.count === obj.value.length) {
				return obj.value.split('')
					.map((letter) => ({
						...obj,
						count: 1,
						value: letter,
					}));
			} else {
				throw new Error('Should never happen');
			}
		});
};
const stepTowards = (from, to, { amount, allowAllChanges } = { amount: 1, allowAllChanges: false }) => {
	log('####', amount);
	if (from === to || amount === 1) {
		allowAllChanges = true;
	}
	amount = bind(amount, 0, 1);
	const isChosenChange = (obj) => {
		const wantChange = Math.random() < amount;
		if (obj.added) {
			return wantChange;
		}
		if (obj.removed) {
			if (!wantChange) {
				obj.removed = false;
			}
			return true;
		}
		return true;
	};
	const res = splitDiffs(diff.diffChars(from, to));
	// log(res);

	let changed = null;

	while (changed === null || (!allowAllChanges && changed === to)) {
		const partial = res
			.filter(isChosenChange);
		changed = inverseDiffs(partial);
	}

	log(from);
	log(to);
	return changed;
};

log(stepTowards('61rs1En & Hebr1', 'Kirsten & Henri', { amount: 0.0 }));
log(stepTowards('61rs1En & Hebr1', 'Kirsten & Henri', { amount: 0.2 }));
log(stepTowards('61rs1En & Hebr1', 'Kirsten & Henri', { amount: 0.5 }));
log(stepTowards('61rs1En & Hebr1', 'Kirsten & Henri', { amount: 0.8 }));
log(stepTowards('61rs1En & Hebr1', 'Kirsten & Henri', { amount: 1.0 }));

process.exit();

const keys = Object.keys(kirjad);
const byFirstLetter = keys.map((key) => key.substr(0, 1)).reduce((res, val) => {
	res[val] = (res[val] || 0) + 1;

	return res;
}, {});
const bySecondLetter = keys.map((key) => key.substr(0, 2)).reduce((res, val) => {
	res[val] = (res[val] || 0) + 1;

	return res;
}, {});
log('first letter defines', byFirstLetter);
log('second letter defines', bySecondLetter);

const key = keys[1];

analyze(key);
