import {Injectable} from '@angular/core';

import {Http, RequestOptions, Response, Headers} from '@angular/http';
import '../utils/rxjs-operators'

import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage'

import {WalletService} from './wallet-service';
import {Utils} from './utility-service';

import {Config} from './utility-service';
import {JwtHelper} from 'angular2-jwt';

import Random from 'random-js';
import EthUtil from 'ethereumjs-util';

@Injectable()
export class IdentityService {
	private initialised: boolean;
	private jwtHelper: JwtHelper = new JwtHelper();
	private random: any;

	constructor(public http: Http,
	            public walletService: WalletService,
	            public regularStorage: Storage,
	            public platform: Platform) {

		console.log('IdentityService.constructor()');
		this.initialised = false
		this.random = new Random(Random.engines.nativeMath);
	}

	public async initialize(): Promise<boolean> {

		// if already initialised we return immediately
		if (this.initialised) {
			return true
		}

		console.log('IdentityService.initialize()');

		await this.platform.ready();
		await this.regularStorage.ready();

		// make sure the wallet is initialised
		let initialised = await this.walletService.initialize();
		if (initialised == false) {
			return Promise.reject(false);
		}

		await this.jwt()

		this.initialised = true
		return Promise.resolve(true);
	}

	private get reqOpt(): RequestOptions {

		let headers = new Headers({'Content-Type': 'application/json'});

		return new RequestOptions({
			headers: headers,
			withCredentials: true
		})
	}

	public async getNewJwt(): Promise<string> {

		let options = new RequestOptions({
			withCredentials: true
		})

		let address = this.walletService.address
		let result: Response = await this.http.get(Config.API_HOST + '/api/jwt/' + address, options).toPromise()
		if (result.status == 207) {
			throw Error('Error getting challenge from server');
		}

		let code = result.json().code
		console.log('code: ' + code)

		let nonce = this.random.hex(64);
		console.log('nonce: ' + nonce)

		let message = EthUtil.toBuffer(code + nonce);
		let signature = await this.walletService.sign(message, true)
		console.log('sign: ' + signature)

		let post = {
			payload: {
				signature: Utils.strip0x(signature),
				nonce: Utils.strip0x(nonce)
			}
		}

		result = await this.http.post(Config.API_HOST + '/api/jwt/' + address, post, options).toPromise()
		if (result.status != 200) {
			throw Error('Error validating signed challenge');
		}

		let token = result.json().jwt

		await this.regularStorage.set('jwt', token)
		return token
	}

	public async jwt(): Promise<string> {

		let jwt = await this.regularStorage.get('jwt')
		if (jwt && !this.jwtHelper.isTokenExpired(jwt, 3600)) {
			return jwt
		}

		let token = await this.getNewJwt();
		return Promise.resolve(token)
	}
}
