import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Platform} from 'ionic-angular';
import {SecureStorage, SecureStorageObject} from '@ionic-native/secure-storage'
import {Storage} from '@ionic/storage'
import {Utils} from "./utility-service"

const PromisifyWeb3 = require("../utils/promisifyWeb3.js");

let EthUtil = require('ethereumjs-util');
let Web3 = require('web3');

const Es6Promisify = require("es6-promisify");
let EthLightWallet = require('eth-lightwallet');

import * as util from 'tweetnacl-util';
import * as nacl from 'tweetnacl';

@Injectable()
export class WalletService {

	storage: SecureStorageObject

	private ks: any
	private pdk: string;
	private web3: any

	private boxKeyPair: any;

	public address: string
	private initialised: Boolean

	private password: string = "2037840-2983-40982-03478208374098273409872039847209-387489023740927903478290";

	constructor(public http: Http,
	            public secureStorage: SecureStorage,
	            public regularStorage: Storage,
	            public platform: Platform) {
		this.ks = null;
		this.pdk = null;
		this.address = null;
		this.initialised = false;
		this.web3 = new Web3();

		this.promisify();
	}


	private promisify() {
		PromisifyWeb3.promisify(this.web3);
		EthLightWallet.keystore.deriveKeyFromPassword = Es6Promisify(EthLightWallet.keystore.deriveKeyFromPassword);
		EthLightWallet.keystore.createVault = Es6Promisify(EthLightWallet.keystore.createVault);
	}

	public async initialise(): Promise<Boolean> {

		// if already initialised we return immediately
		if (this.initialised) {
			return true
		}

		// wait for the platform to initialise before accessing storage plugin
		await this.platform.ready()
		await this.regularStorage.ready()
		this.pdk = await EthLightWallet.keystore.deriveKeyFromPassword(this.password);
		console.log("WalletService.initialise()")

		// generating nacl key pair for encryption
		this.boxKeyPair = nacl.box.keyPair();

		try {
			this.storage = await this.secureStorage.create("secure-storage")
		} catch (error) {
			console.log(error.message)
			return Promise.resolve(false)
		}

		let keys = await this.storage.keys()
		let walletNeedsReset = await this.regularStorage.get("wallet-needs-reset")

		if (keys.indexOf("wallet") !== -1 && walletNeedsReset === null) {
			try {
				let serialized = await this.storage.get("wallet")

				this.ks = EthLightWallet.keystore.deserialize(serialized)
				this.ks.passwordProvider =  (cb) => {cb(null, this.password);};
				this.address = this.ks.getAddresses()[0];

				return Promise.resolve(true)
			} catch (error) {
				console.log(error.message)
				return Promise.resolve(false)
			}
		}

		console.log("Wallet not found. Generating new wallet now..");
		let success = await this.generate();

		this.initialised = success;
		return Promise.resolve(success);
	}

	public async sign(message: string, isHex: boolean = false): Promise<string> {

		let hex = message;
		if (!isHex) {
			hex = EthUtil.bufferToHex(message)
		}
		let sig = EthLightWallet.signMsg(this.ks, this.pdk, hex, this.address);
		let signature = EthUtil.toRpcSig(sig.v, sig.r, sig.s);
		return Utils.strip0x(signature);
	}

	public privateKey() : Buffer {
		let key = this.ks.exportPrivateKey(this.address, this.pdk)
		return new Buffer(key, 'hex');
	}

	private async generate(): Promise<Boolean> {

		let promises = [];
		promises.push(this.storage.remove("wallet"))
		promises.push(this.regularStorage.remove("wallet-needs-reset"))

		try {
			await Promise.all(promises)
		} catch (error) {
			console.log(error.message)
			return false
		}

		// generate the actual wallet here
		let seed = EthLightWallet.keystore.generateRandomSeed();

		let ks = new EthLightWallet.keystore(seed, this.pdk);
		ks.passwordProvider =  (cb) => {cb(null, this.password);};

		ks.generateNewAddress(this.pdk, 1);
		this.address = ks.getAddresses()[0];

		await this.storage.set("wallet", ks.serialize())
		return true;
	}

	private async generate1(): Promise<boolean> {

		let promises = [];
		promises.push(this.storage.remove("wallet"))
		promises.push(this.regularStorage.remove("wallet-needs-reset"))

		try {
			await Promise.all(promises)
		} catch (error) {
			console.log(error.message)
			return false
		}

		//this.wallet = Wallet.generate()
		this.address = Utils.strip0x(this.ks.getAddressString())

		let privateKey = EthUtil.stripHexPrefix(this.ks.getPrivateKeyString())
		await this.storage.set("wallet", privateKey)

		return true
	}

	public async getWallet() {
		if (this.ks != null) {
			return this.ks
		}

		await this.initialise()
		return this.ks
	}

	public encrypt(pubBase64: string, message: string) {

		let nonce = nacl.randomBytes(nacl.box.nonceLength);
		let pub = util.decodeBase64(pubBase64);
		let msg = util.decodeUTF8(message);

		let box = nacl.box(msg, nonce, pub, this.boxKeyPair.secretKey);

		let envelope = {
			box: util.encodeBase64(box),
			nonce: util.encodeBase64(nonce),
			pub: util.encodeBase64(this.boxKeyPair.publicKey),
		}

		console.log(JSON.stringify(envelope));
		return envelope;
	}

}
