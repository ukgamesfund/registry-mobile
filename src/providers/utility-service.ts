import {Injectable} from '@angular/core';

export enum ENV {
	Local = 1,
	Hyper,
}

export class Config {
	private static env: ENV = ENV.Local


	public static get API_HOST(): string {
		if (Config.env == ENV.Local) {
			return ''
		}

		if (Config.env == ENV.Hyper) {
			return 'http://backend.talregistry.com'
		}

		return undefined
	}
}

@Injectable()
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
