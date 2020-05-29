let input  = 'arl djHd';
let output = 'Karl & Kai';

const getTrigrams = (s) => {
	const n = 3;
	if (s.length < 3) {
		return [];
	}
	var r = [];
	for (var i = 0; i <= s.length - n; i++)
		r.push(s.substring(i, i + n));
	return r;
};

const getMinByMetric = (m1, m2, e1, e2) => {
	if (m2 > m1) return e2;
	return e1;
};

const getFirstDifferent = (a1, a2) => {
	const shorterArray = getMinByMetric(a1.length, a2.length, a1, a2);
	for (let i = 0; i < Math.max(a1.length, a2.length); i++) {
		if (a1[i] !== a2[i]) {
			return i;
		}
	}
};

const differ = (input, output, n) => {
	if (typeof n !== 'number') n = 10;
	if (input === output || n-- <= 0) return;
	// console.log(input, '->', output);
	const trigrams = {
		input: getTrigrams(`__${input}__`),
		output: getTrigrams(`__${output}__`),
	};
	// console.log(trigrams.input.length);
	// console.log(trigrams.output.length);

	const firstDifferent = getFirstDifferent(trigrams.input, trigrams.output);

	// console.log(trigrams.input[firstDifferent], '->', trigrams.output[firstDifferent]);

	const toReplace = new RegExp(
		trigrams.input[firstDifferent]
			.replace(/^_+/, '^')
			.replace(/_+$/, '$')
	);

	const replacement = trigrams.output[firstDifferent].replace(/_+/, '');

	console.log(trigrams.input[firstDifferent], '->', toReplace, '->', replacement);

	const changed = input.replace(toReplace, replacement);

	console.log('\t\t', changed);

	return differ(changed, output, n);
};

console.log(differ(input, output));

const JaroWrinker  = function (s1, s2) {
	var m = 0;

	// Exit early if either are empty.
	if ( s1.length === 0 || s2.length === 0 ) {
		return 0;
	}

	// Exit early if they're an exact match.
	if ( s1 === s2 ) {
		return 1;
	}

	var range     = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1,
		s1Matches = new Array(s1.length),
		s2Matches = new Array(s2.length);

	for (let i = 0; i < s1.length; i++ ) {
		var low  = (i >= range) ? i - range : 0,
			high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);

		for (let j = low; j <= high; j++ ) {
			if ( s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j] ) {
				++m;
				s1Matches[i] = s2Matches[j] = true;
				break;
			}
		}
	}

	// Exit early if no matches were found.
	if ( m === 0 ) {
		return 0;
	}

	// Count the transpositions.
	let k = 0;
	let n_trans = 0;

	for (let i = 0; i < s1.length; i++ ) {
		if ( s1Matches[i] === true ) {
			let j;
			for (j = k; j < s2.length; j++ ) {
				if ( s2Matches[j] === true ) {
					k = j + 1;
					break;
				}
			}

			if ( s1[i] !== s2[j] ) {
				++n_trans;
			}
		}
	}

	var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3,
		l      = 0,
		p      = 0.1;

	if ( weight > 0.7 ) {
		while ( s1[l] === s2[l] && l < 4 ) {
			++l;
		}

		weight = weight + l * p * (1 - weight);
	}

	return weight;
};

