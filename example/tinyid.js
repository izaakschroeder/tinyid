
'use strict';

var tinyid = require('..');

for (var i = 0; i < 5; ++i) {
	var enc = tinyid.encode('abcdef', 'fcdabe', i);
	var dec = tinyid.decode('abcdef', 'fcdabe', enc);
	console.log(enc, '==', dec, '==', i);
}
