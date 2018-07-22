'use strict';

var argv = require('yargs-parser')(process.argv.slice(2))

var port = argv.p
var uName = argv.u
var pass = argv.k

if(!uName || !pass || !port){
    console.error('args error,needs [-u:username ,-k:password ,-p:port]')
    return
}

var
	socks5 = require('./lib'),
	server = socks5.createServer({
		authenticate : function (username, password, socket, callback) {
			// verify username/password
			if (username !== uName || password !== pass) {
				// respond with auth failure (can be any error)
				return setImmediate(callback, new Error('invalid credentials'));
			}

			// return successful authentication
			return setImmediate(callback);
		}
	});

// start listening!
server.listen(port);

console.log('s5 proxy start')
console.log('port: ' + port)
console.log('username: ' + uName)
console.log('password: ' + pass)



// When a reqest arrives for a remote destination
server.on('proxyConnect', function (info, destination) {
	console.log('connected to remote server at %s:%d', info.host, info.port);
});

// When an error occurs connecting to remote destination
server.on('proxyError', function (err) {
	console.error('unable to connect to remote server');
	console.error(err);
});

// When a proxy connection ends
server.on('proxyEnd', function (response, args) {
	console.log('socket closed with code %d', response);
});
