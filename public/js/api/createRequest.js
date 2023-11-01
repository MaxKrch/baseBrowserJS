/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

//Возможно, нужно будет немного переписать позже

const createUrlForGetRequest = (url, data) => {

	let fullUrl = `${url}?`;
	let i = 1;
	const count = Object.keys(data).length;

	for(let key in data) {
		fullUrl += `${key}=${data[key]}`;
		if(i < count) {
			fullUrl += `&`
		}
		i++;
	}

	return fullUrl;
}


const createBodyForPostRequest = (data) => {
	const body = new FormData();
	for(let key in data) {
		body.append(key, data[key])
	}

	return body;
}

const createRequest = (options = {}) => {
	const { url, data, method, callback } = options;

	let fullUrl;
	let body;
	
	const xhr = new XMLHttpRequest();

	if(method === 'GET') {
		fullUrl = createUrlForGetRequest(url, data);
	} else {
		fullUrl = url;
		body = createBodyForPostRequest(data);
	}


	xhr.addEventListener('load', () => {
		let error = null;
		if(xhr.response.success === false) {
			error = xhr.response.error;
		} 

		callback(error, xhr.response)

	})

	try {
		xhr.open(method, fullUrl);
		xhr.responseType = 'json';

		if(method === 'GET') {
			xhr.send();
		} else {
			xhr.send(body);
		}
	} catch (err) {
		callback(err);
	}
};

