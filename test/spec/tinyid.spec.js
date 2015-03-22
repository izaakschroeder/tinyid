
'use strict';

var tinyid = require('tinyid');

describe('tinyid', function() {

	it('should derp', function() {
		var inst = new tinyid();
		inst.decode(inst.encode(5));
	});

	it('should herp', function() {
		var inst = tinyid();
		inst.decode(inst.encode(5));
	});

	describe('.encode', function() {
		it('should work', function() {
			var enc = tinyid.encode('abcdef', 'fcdabe', 5);
			var dec = tinyid.decode('abcdef', 'fcdabe', enc);
			expect(dec).to.equal(5);
		});
	});

	describe('.decode', function() {
		it('should work', function() {
			var enc = tinyid.encode('abcdef', 'fcdabe', 0);
			var dec = tinyid.decode('abcdef', 'fcdabe', enc);
			expect(dec).to.equal(0);
		});
	});
});
