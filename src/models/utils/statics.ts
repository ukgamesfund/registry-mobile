﻿

export class Utils {

	static add0x(input) {
		if (typeof(input) !== 'string') {
			return input;
		}
		else if (input.length < 2 || input.slice(0, 2) !== '0x') {
			return '0x' + input;
		}
		else {
			return input;
		}
	}

	static strip0x(input) {
		if (typeof(input) !== 'string') {
			return input;
		}
		else if (input.length >= 2 && input.slice(0, 2) === '0x') {
			return input.slice(2);
		}
		else {
			return input;
		}
	}
}


