var ntlm = require('request-simple-ntlm');

var options = {
	url: <URL>,
	username: <Username>,
	password: <Password>,
	request: {
		headers: {
			'Accept': 'application/json'
		}
	}
};

ntlm.fetch(options, function(err, resp, body) {
	console.log(err, body);
}, function(err) {
	 console.log('Error is : ', err);
});

ntlm.stream(options, function(request) {
	request.pipe(process.stdout);
}, function(err) {
	 console.log('Error is : ', err);
});
