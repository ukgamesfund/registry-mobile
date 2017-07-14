import {Injectable} from '@angular/core';

import {Http, RequestOptions, Response, Headers} from '@angular/http';
import '../utils/rxjs-operators'

import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage'

import {WalletService} from "./wallet-service";
import {Config} from "./utility-service";
import {JwtHelper} from "angular2-jwt";
import {Dialogs} from "@ionic-native/dialogs";

@Injectable()
export class IdentityService {
	private initialised: boolean;
	private jwtHelper: JwtHelper = new JwtHelper();

	constructor(public http: Http,
	            private dialogs: Dialogs,
	            public walletService: WalletService,
	            public regularStorage: Storage,
	            public platform: Platform) {
		console.log('IdentityService.constructor()');
		this.initialised = false
	}

	public async initialise(): Promise<boolean> {

		// if already initialised we return immediately
		if (this.initialised) {
			return true
		}

		console.log("IdentityService.initialise()");

		await this.platform.ready();
		await this.regularStorage.ready();

		// make sure the wallet is initialised
		let initialised = await this.walletService.initialise();
		if (initialised == false) {
			return false;
		}

		this.initialised = true
		return true
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
		let result: Response = await this.http.get(Config.API_HOST + "/v1/id/jwt/" + address, options).toPromise()
		if (result.status == 207) {
			throw Error("Error getting challenge from server");
		}

		let code = result.json().code
		console.log("code: " + code)

		let signature = this.walletService.sign(code, true)
		console.log("sign: " + signature)
		let body = {signature: signature}

		result = await this.http.post(Config.API_HOST + "/v1/id/jwt", body, options).toPromise()
		if (result.status == 207) {
			throw Error("Error validating signed challenge");
		}

		let token = result.json().token

		await this.regularStorage.set("jwt", token)
		return token
	}

	public async getJwt(): Promise<string> {

		let jwt = await this.regularStorage.get("jwt")
		if (jwt && !this.jwtHelper.isTokenExpired(jwt, 3600)) {
			return jwt
		}

		return this.getNewJwt()
	}

	public async sendJwt(publicKey: string) {
		publicKey = 'M2EAH5fHDls+zKOhg3731TsL6LhlHuxGAf2OzDMxoBI=';
		let jwt = await this.getNewJwt();
		let envelope = await this.walletService.encrypt(publicKey, jwt);

		let options = this.reqOpt;
		options.headers.set('Authorization', 'Bearer ' + jwt);
		console.log("jwt: " + jwt)

		let response: Response = await this.http.post(Config.API_HOST + "/v1/ws/jwt/" + publicKey, envelope, options).toPromise()
		console.log("IdentityService.sendJwt(): " + JSON.stringify(response.json()));
	}
}
