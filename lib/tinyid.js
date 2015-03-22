
'use strict';

function Generator(options) {
	if (this instanceof Generator === false) {
		return new Generator(options);
	}
	this.alphabet = Generator.defaults.alphabet;
	this.wheel = Generator.defaults.wheel;
}

Generator.defaults = {
	alphabet: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
	wheel: 'NPUV5KLQ9AH7BWX6G8JYZ2RSD34CEFTM'
};

Generator.prototype.encode = function _encode(input) {
	return Generator.encode(this.alphabet, this.wheel, input);
};

Generator.prototype.decode = function _decode(input) {
	return Generator.decode(this.alphabet, this.wheel, input);
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

Generator.mix = function mix(alphabet, wheel, value) {
	var result = '';
	for (var i = 0; i < value.length; i++) {
		var position = alphabet.indexOf(value.charAt(i));
		result += wheel.charAt((position + i) % wheel.length);
	}
	return result;
};

Generator.unmix = function unmix(alphabet, wheel, value) {
	var result = '';
	for (var i = 0; i < value.length; i++) {
		var currentCharPos = wheel.indexOf(value.charAt(i));
		var alphabetIndex = (((currentCharPos - i) % wheel.length) + wheel.length) % wheel.length;
		result += alphabet[alphabetIndex];
	}
	return result;
};

Generator.encode = function encode(alphabet, wheel, value) {
	value = Generator.toBase(alphabet, value);
	value = Generator.pad(value, 3, alphabet.charAt(0));
	value = Generator.mix(alphabet, Generator.rotate(wheel, Generator.offset(alphabet, value)), value.substring(0, value.length - 1)) + value.charAt(value.length - 1);
	return value;
};

Generator.decode = function decode(alphabet, wheel, value) {
	value = Generator.unmix(alphabet, Generator.rotate(wheel, Generator.offset(alphabet, value)), value.substring(0, value.length - 1)) + value.charAt(value.length - 1);
	return Generator.fromBase(alphabet, value);
};

module.exports = Generator;
