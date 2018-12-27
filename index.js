'use strict';

const request = require('request');
const ntlm = require('./lib/ntlm');

function makeRequest(stream, options, callback) {
    options = {
        url: options.url || '',
        username: options.username || '',
        password: options.password || '',
        workstation: options.workstation || '',
        domain: options.domain || '',
        request: options.request || {}
    };

    const reqOptions = options.request;
    reqOptions.url = reqOptions.url || options.url;

    function makeType1Request($) {
        const type1msg = ntlm.createType1Message(options);

        // build type1 request:
        const type1options = Object.assign(reqOptions, {
            followRedirect: false,
            forever: true,
            headers: Object.assign(reqOptions.headers || {}, {
                'Connection': 'keep-alive',
                'Authorization': type1msg
            })
        });

        // send type1 message to server:
        request(type1options, $);
    }

    function makeType3Request(authenticateHeader, $) {
        // parse type2 message from server:
        const type2msg = ntlm.parseType2Message(authenticateHeader, $);
        if (!type2msg) {
            return;
        }

        // create type3 message:
        const type3msg = ntlm.createType3Message(type2msg, options);

        // build type3 request:
        const type3options = Object.assign(reqOptions, {
            followRedirect: false,
            forever: true,
            headers: Object.assign(reqOptions.headers || {}, {
                'Connection': 'Close',
                'Authorization': type3msg
            })
        });

        // send type3 message to server:
        if (stream) {
            $(request(type3options));
        } else {
            request(type3options, $);
        }
    }

    makeType1Request(function (error, response) {
        if (error) {
            return callback(error);
        }

        if (!response.headers['www-authenticate']) {
            return callback(new Error('www-authenticate not found on response of second request'));
        }

        makeType3Request(response.headers['www-authenticate'], callback);
    });
}

exports.stream = function (options, callback) {
    makeRequest(true, options, callback);
};

exports.fetch = function (options, callback) {
    makeRequest(false, options, callback);
};

exports.ntlm = ntlm; //if you want to use the NTML functions yourself