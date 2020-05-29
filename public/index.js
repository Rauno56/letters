const getApiAddr = () => {
	const host = window.location.host;
	if (host.includes('localhost') && !host.includes(':3000')) {
		return 'http://localhost:3000';
	}
	return '/api';
};

const API = getApiAddr();
const SPACE = '&nbsp;';

const jsonRequest = async (url) => {
	const response = await fetch(url);
	const body = await response.json();
	return {
		response,
		body,
	};
};

const askServer = (() => {
	let lastId = 1;
	let completedId = -1;

	const start = () => lastId++;
	const done = (id) => {
		if (completedId < id) {
			completedId = id;
			return true;
		}
	};

	return async (endpoint, input) => {
		const id = start();
		const { response, body } = await jsonRequest(`${API}/${endpoint}/${input}`);
		if (done(id)) {
			return {
				success: (response.status >= 200 && response.status < 300),
				response: body,
			};
		} else {
			return Promise.reject(new Error('Late response'));
		}
	};
})();

const getGreeting = async (input) => {
	input = typeof input === 'string' ? input.trim() : '';
	if (input === '') {
		return { success: false, text: SPACE };
	}

	if (input.length === 11) {
		const resp = await askServer('check', input);
		if (resp.success) {
			window.location = resp.response;
			return { success: true, text: `<a href=${resp.response}>${resp.response}</a>` };
		}
		return { success: false, text: 'Tundmatu kood.' };
	}
	return { success: false, text: SPACE };
};

window.onload = function () {
	const greeting = document.querySelector('#greeting');
	const inputBox = document.querySelector('input');
	const placeholder = document.querySelector('#box-background');
	const body = document.querySelector('body');

	inputBox.classList.remove('loading');
	greeting.innerHTML = SPACE;

	async function updateGreeting(evt) {
		const length = this.value.length;

		if (length === 11) {
			this.classList.add('loading');
		} else {
			this.classList.remove('loading');
		}

		// errors if responses come out of order
		const { text: newGreeting, success } = await getGreeting(this.value);

		if (length === 11 && !success) {
			this.classList.remove('loading');
		}

		greeting && (greeting.innerHTML = newGreeting) || console.warn('greeting not set.');
	}

	function updatePlaceholder() {
		const L = 11;
		const l = this.value.length;
		const value = SPACE.repeat(l) + '_'.repeat(L - l);
		placeholder.innerHTML = value;
	}

	updateGreeting.call(inputBox);
	updatePlaceholder.call(inputBox);

	inputBox.addEventListener('input', updateGreeting);
	inputBox.addEventListener('input', updatePlaceholder);

	inputBox.focus();

	body.classList.remove('hidden');
};
