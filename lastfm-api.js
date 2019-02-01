

// Your API key
const api = '61c4395fb5ee48c51c6739315dc075c8';
const secret = '3e892d41293e6bca7e9da8979a6c3479';

const getToken = url => {
	return new Promise((resolve, reject) => {

		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);

		console.log(xhr);

		xhr.onload = () => {
			if(xhr.status == 200) {
				const xmlDOC = xhr.responseXML;
				const token = xmlDOC.querySelector('token').innerHTML;
				resolve(token);
			} else {
				const error = new Error(xhr.statusText);
		        error.code = xhr.status;
		        reject(error);
			}
		};

	    xhr.send();
	});
};

const getSig = token => {
	return new Promise((resolve, reject) => {
  		const str = "api_key" + api + "methodauth.getsessiontoken" + token + secret;
  		const sigKey = md5(str);

  		resolve([sigKey, token]);
	});
};

const getSession = (sig, token) => {
	console.log('ttt', token);
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		console.log(api, token, sig);
		xhr.open('GET', "http://ws.audioscrobbler.com/2.0/?method=auth.getsession&token=" + token + "&api_key=" + api + "&api_sig=" + sig, false);
		// xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');

		// xhr.ontimeout = function () {
	 //        console.error("The request for " + 'url' + " timed out.");
	 //    };

		xhr.onload = () => {

			if(xhr.readyState != 4) return;
			if(xhr.status == 200) {
				const data = xhr.responseXML;
				var key = data.querySelector("key").innerHTML;

				resolve(key);
			} else {
				let server = false;
			}
		};
		// xhr.timeout = 20000;
		xhr.send(null);
	});
};


getToken('http://ws.audioscrobbler.com/2.0/?method=auth.gettoken&api_key=' + api)
  .then(token => {
  	return getSig(token);
  })
  .then(([sig, token]) => {
  	console.log(token);
  	console.log(sig);
  	return getSession(sig, token);
  })
  .then(key => {
  	console.log('key', key)
  })
  .catch(error => {
  	return alert(`Rejected: ${error}`);
  });

// const promise = new Promise((resolve, reject) => {
// 	const apiKey = '61c4395fb5ee48c51c6739315dc075c8';
// 	const secretKey = '3e892d41293e6bca7e9da8979a6c3479';
// 	setTimeout(() => {
// 	    resolve("result");
//     }, 1000);
// });

// promise.then(() => {

// })

