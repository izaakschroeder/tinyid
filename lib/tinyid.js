
'use strict';

var _ = require('lodash');

/**
 * Create a new tinyid generator.
 * @constructor
 * @param {Object} options Configuration options.
 * @param {String} options.wheel Randomized letters used in the encoding.
 * @param {Number} options.padding Minimum length of the output.
 */
function Generator(options) {
	if (this instanceof Generator === false) {
		return new Generator(options);
	}
	if (_.isString(options)) {
		options = {
			wheel: options
		};
	}
	_.assign(this, Generator.defaults, options);
	this.alphabet = Generator.wheelToAlphabet(this.wheel);
}

Generator.defaults = {
	wheel: 'NPUV5KLQ9AH7BWX6G8JYZ2RSD34CEFTM',
	padding: 4
};

Generator.encode = function _encode(options, input) {
	if (arguments.length === 1) {
		input = options;
		options = null;
	}
	var generator = new Generator(options);
	return generator.encode(input);
};

Generator.decode = function _decode(options, input) {
	if (arguments.length === 1) {
		input = options;
		options = null;
	}
	var generator = new Generator(options);
	return generator.decode(input);
};

Generator.wheelToAlphabet = function wheelToAlphabet(wheel) {
	return wheel.split('').sort().join('');
};

Generator.toBase = function toBase(base, input) {
	if (input === 0) {
		return base[0];
	} else {
		var result = '';
		while (input > 0) {
			//Must make sure result is in the correct order
			result = base[input % base.length] + result;
			input = Math.floor(input / base.length);
		}
		return result;
	}
};

Generator.fromBase = function fromBase(base, input) {
	var result = 0;
	for (var i = 0; i < input.length; ++i) {
		result *= base.length;
		result += base.indexOf(input.charAt(i));
	}
	return result;
};

Generator.pad = function pad(input, target, character) {
	while (input.length < target) {
		input = character + input;
	}
	return input;
};

/**
 * Rotate a string based on some fixed point offset within it. So if you have
 * "ab|cde" you get "|cdeab". The fixed point becomes the start of the string.
 * @param {String} wheel The input string.
 * @param {Number} offset How much to rotate by.
 * @returns {String} The resultant rotation.
 */
Generator.rotate = function rotate(wheel, offset) {
	return wheel.substring(offset) + wheel.substring(0, offset);
};

/**
 * Get the alphabet index of the character at last position in the string. This
 * is used to determine the offset used in the encoding wheel.
 * @param {String} alphabet Input alphabet.
 * @param {String} value Input value.
 * @returns {Number} Resultant offset.
 */
Generator.offset = function offset(alphabet, value) {
	return alphabet.indexOf(value.charAt(value.length - 1));
};

Generator.prototype.wheelie = function wheelie(value) {
	return Generator.rotate(this.wheel, Generator.offset(this.alphabet, value));
};

Generator.prototype.mix = function mix(value) {
	var result = '',
		wheel = this.wheelie(value);
	for (var i = 0; i < value.length - 1; i++) {
		var position = this.alphabet.indexOf(value.charAt(i));
		result += wheel.charAt((position + i) % wheel.length);
	}
	return result + value.charAt(value.length - 1);
};

Generator.prototype.unmix = function unmix(value) {
	var result = '',
		wheel = this.wheelie(value);
	for (var i = 0; i < value.length - 1; i++) {
		var currentCharPos = wheel.indexOf(value.charAt(i));
		var alphabetIndex = (((currentCharPos - i) % wheel.length) + wheel.length) % wheel.length;
		result += this.alphabet[alphabetIndex];
	}
	return result + value.charAt(value.length - 1);
};

Generator.prototype.encode = function encode(value) {
	value = Generator.toBase(this.alphabet, value);
	value = Generator.pad(value, this.padding, this.alphabet.charAt(0));
	return this.mix(value);
};

Generator.prototype.decode = function decode(value) {
	value = this.unmix(value);
	return Generator.fromBase(this.alphabet, value);
};

module.exports = Generator;
