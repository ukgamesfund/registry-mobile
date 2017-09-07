import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform} from 'ionic-angular';
import {SecureStorage, SecureStorageObject} from '@ionic-native/secure-storage';
import {Storage} from '@ionic/storage';
import {Utils} from './utility-service';

import * as util from 'tweetnacl-util';
import * as nacl from 'tweetnacl';
import Semaphore from 'semaphore-async-await';

let PromisifyWeb3 = require('../utils/promisifyWeb3.js');
let Web3 = require('web3');
let EthUtil = require('ethereumjs-util');
let Es6Promisify = require('es6-promisify');
let EthLightWallet = require('eth-lightwallet');

@Injectable()
export class WalletService {

	storage: SecureStorageObject;

	private ks: any;
	private pdk: string;
	private web3: any;

	private boxKeyPair: any;

	public address: string;
	private initialised: Boolean;
	private lock = new Semaphore(1);

	private password: string = '2037840-2983-40982-293872984798237489279-387489023740927903478290';

	constructor(public secureStorage: SecureStorage,
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

	public async initialize(): Promise<Boolean> {

		await this.lock.acquire();

		if (this.initialised) {
			this.lock.release();
			return true;
		}
		console.log('WalletService.initialize()')

		// wait for the platform to initialize before accessing storage plugin
		await this.platform.ready();
		await this.regularStorage.ready();
		this.pdk = await EthLightWallet.keystore.deriveKeyFromPassword(this.password);

		// generating nacl key pair for encryption
		this.boxKeyPair = nacl.box.keyPair();

		try {
			this.storage = await this.secureStorage.create('secure-storage');
		} catch (error) {
			console.log(error.message);
			this.lock.release();
			return Promise.resolve(false);
		}

		this.lock.release();
		return Promise.resolve(true);
	}

	public async initializeWallet(): Promise<Boolean> {

		await this.initialize();
		await this.lock.acquire();

		if (await this.walletExists()) {
			try {
				let serialized = await this.storage.get('wallet');

				this.ks = EthLightWallet.keystore.deserialize(serialized);
				this.ks.passwordProvider = (cb) => {cb(null, this.password);};
				this.address = this.ks.getAddresses()[0];

				this.initialised = true;
				this.lock.release();
				return Promise.resolve(true);
			} catch (error) {

				console.log(error.message);
				this.lock.release();
				return Promise.resolve(false);
			}
		}

		console.log('Wallet not found. Generating new wallet now..');
		let success = await this.generate();

		this.initialised = success;
		this.lock.release();
		return Promise.resolve(success);
	}
	
	public async walletExists(): Promise<Boolean> {

		let keys = await this.storage.keys()
		let walletNeedsReset = await this.regularStorage.get('wallet-needs-reset');

		if (keys.indexOf('wallet') === -1 || walletNeedsReset !== null) {
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	}

	public async sign(message: string, isHex: boolean = false): Promise<string> {

		let hex = message;
		if (!isHex) {
			hex = EthUtil.bufferToHex(message);
		}
		let sig = EthLightWallet.signing.signMsg(this.ks, this.pdk, hex, this.address);
		let signature = EthUtil.toRpcSig(sig.v, sig.r, sig.s);

		return Promise.resolve(Utils.strip0x(signature));
	}

	public privateKey(): Buffer {
		let key = this.ks.exportPrivateKey(this.address, this.pdk);
		return new Buffer(key, 'hex');
	}

	private async generate(): Promise<Boolean> {

		try {
			await this.storage.remove('wallet')
		} catch (error) {
			console.log(error.message);
		}

		try {
			await this.regularStorage.remove('wallet-needs-reset')
		} catch (error) {
			console.log(error.message);
		}

		// generate the actual wallet here
		let seed = EthLightWallet.keystore.generateRandomSeed();

		this.ks = new EthLightWallet.keystore(seed, this.pdk);
		this.ks.passwordProvider = (cb) => {
			cb(null, this.password);
		};

		this.ks.generateNewAddress(this.pdk, 1);
		this.address = this.ks.getAddresses()[0];

		await this.storage.set('wallet', this.ks.serialize());
		return true;
	}

	public async getWallet() {
		if (this.ks != null) {
			return this.ks;
		}

		await this.initialize();
		return this.ks;
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
