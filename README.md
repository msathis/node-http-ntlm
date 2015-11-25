# request-simple-ntlm

__request-simple-ntlm__ is a Node.js library to do HTTP NTLM authentication using [request](https://github.com/request/request)

It's a fork from [httpntlm](https://github.com/SamDecrock/node-http-ntlm) which is again a port from the Python libary [python-ntml](https://code.google.com/p/python-ntlm/)

## Install

You can install __request-simple-ntlm__ using the Node Package Manager (npm):

    npm install request-simple-ntlm

## How to use

An example can be found in __test__ directory.

```js
var ntlm = require('request-simple-ntlm');

var options = {
    url: "https://someurl.com",
    username: 'username',
    password: 'password',
    workstation: 'something',
    domain: '',
    request: {

    }
};

//For just fetching content. Same arguments as request library's callback method.
ntlm.fetch(options, function (err, res, body){
    if(err) return console.warn(err);

    console.log(body);
});

//For streaming the content. Returns request object.
ntlm.stream(options, function (request){
    request.pipe(process.stdout);
});
```

It supports both __http__ and __https__.

## Options

- `url:`      _{String}_   URL to connect. (Required)
- `username:` _{String}_   Username. (Required)
- `password:` _{String}_   Password. (Required)
- `workstation:` _{String}_ Name of workstation or `''`.
- `domain:`   _{String}_   Name of domain or `''`.
- `request:` _{Object}_    Request library options (headers, cookies etc you can pass) 


## More information
* [httpntlm](https://github.com/SamDecrock/node-http-ntlm)
* [python-ntlm](https://code.google.com/p/python-ntlm/)
* [NTLM Authentication Scheme for HTTP](http://www.innovation.ch/personal/ronald/ntlm.html)
* [LM hash on Wikipedia](http://en.wikipedia.org/wiki/LM_hash)


## License (MIT)

Copyright (c) Sathis <https://github.com/msathis/>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
