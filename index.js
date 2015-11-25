'use strict';

var async = require('async');
var url = require('url');
var request = require('request');
var ntlm = require('./lib/ntlm');
var _ = require('underscore');

 var defaults = {
 	workstation: '',
 	domain: ''
 }

 function makeRequest(stream, options, callback){
	
 	options = _.extend(defaults, options);
	var reqOptions = _.extend({}, options.request);
	reqOptions.url = reqOptions.url || options.url;

	async.waterfall([
		function ($){
			var type1msg = ntlm.createType1Message(options);

			// build type1 request:
			var type1options = {
				headers:{
					'Connection' : 'keep-alive',
					'Authorization': type1msg
				},
				timeout: options.timeout || 0,
				forever: true			
			};
			type1options.url = reqOptions.url;

			// add timeout option:
			if(reqOptions.timeout) 
				type1options.timeout = reqOptions.timeout;

			// send type1 message to server:
			request(type1options, $);
		},

		function (res, body, $){
			if(!res.headers['www-authenticate'])
				return $(new Error('www-authenticate not found on response of second request'));

			// parse type2 message from server:
			var type2msg = ntlm.parseType2Message(res.headers['www-authenticate']);

			// create type3 message:
			var type3msg = ntlm.createType3Message(type2msg, options);

			// build type3 request:
			var type3options = {
				headers: {
					'Connection': 'Close',
					'Authorization': type3msg
				},
				followRedirect: false,
				forever: true
			};
			type3options.url = reqOptions.url;

			// pass along other options:
			type3options.headers = _.extend(type3options.headers, reqOptions.headers);
			type3options = _.extend(type3options, _.omit(reqOptions, 'headers'));

			// send type3 message to server:
			if (stream) {
				$(request(type3options));
			} else {
				request(type3options, $);
			}
		}
	], callback);
}

exports.stream = function(options, callback) {
	makeRequest(true, options, callback);
}

exports.fetch = function(options, callback) {
	makeRequest(false, options, callback);
}

exports.ntlm = ntlm; //if you want to use the NTML functions yourself
