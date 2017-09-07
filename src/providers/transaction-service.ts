import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {Platform} from 'ionic-angular';

import {WalletService} from './wallet-service';
import {Utils} from './utility-service';
import {Status, CONST} from '../utils/contracts-common';

import Semaphore from 'semaphore-async-await';

const Web3 = require('web3')
const HookedWeb3Provider = require('hooked-web3-provider')
const Transaction = require('ethereumjs-tx')

const PromisifyWeb3 = require('../utils/promisifyWeb3.js');
const Contract = require('truffle-contract');


@Injectable()
export class TransactionService {

	private web3: any
	private rpc: string = 'http://parity.dltlab.io:8545'

	private testContractAddress: string = '0xBDb5aDE6acB0D11C93f0043f0C842B9Ae3AECac1'
	private testContractInstance: any

	private initialised: boolean
	private lock = new Semaphore(1);

	constructor(public walletService: WalletService,
	            public platform: Platform) {
		console.log('TransactionService.constructor()')
		this.initialised = false
	}

	public async initialize(): Promise<boolean> {

		await this.lock.acquire();

		// if already initialised we return immediately
		if (this.initialised) {
			this.lock.release();
			return true
		}

		// wait for the platform to initialize before accessing storage plugin
		await this.platform.ready()

		console.log('TransactionService.initialize()')

		// make sure the wallet is initialised
		let initialised = await this.walletService.initialize()
		if (initialised == false) {
			this.lock.release();
			return false;
		}
		console.log('Wallet: ' + this.walletService.address)

		this.web3 = new Web3(this.getHookedWeb3Provider())
		PromisifyWeb3.promisify(this.web3);

		let testContractTemplate = Contract(require('../utils/test.json'))
		testContractTemplate.setProvider(this.getHookedWeb3Provider())
		this.testContractInstance = await testContractTemplate.at(this.testContractAddress)

		this.initialised = true
		this.lock.release();
		return true
	}

	public async blockNumber() {
		let blockNumber = await this.web3.eth.getBlockNumberPromise()
		return blockNumber
	}

	public async getTestNumber() {
		console.log('TransactionService.getTestNumber()')
		return (await this.testContractInstance.Number()).toNumber()
	}

	public async setTestNumber(number: Number) {
		console.log('TransactionService.setTestNumber()')

		let address = this.walletService.address
		console.log('address= ' + address)
		return await this.testContractInstance.SetNumber(number, {from:  Utils.add0x(address)});
	}

	// ---------------------------------------------------------------------------------------------------

	private getHookedWeb3Provider() {
		let provider = new HookedWeb3Provider({
			host: this.rpc,
			transaction_signer: {
				hasAddress: (address, callback) => {
					callback(null, address === Utils.add0x(this.walletService.address))
				},
				signTransaction: (params, callback) => {
					this.sign(params, callback)
				}
			}
		});
		return provider;
	}

	private async sign(params, callback) {
		console.log('TransactionService.sign()')
		let tx = {};

		let gasPrice = await this.web3.eth.getGasPricePromise()
		let nonce = await this.web3.eth.getTransactionCountPromise(params['from'], 'pending')

		tx['from'] = Utils.add0x(params.from)
		tx['to'] = Utils.add0x(params.to)
		tx['data'] = Utils.add0x(params.data)

		tx['gasPrice'] = parseInt(gasPrice)
		tx['nonce'] = parseInt(nonce)

		let gasLimit = '1000000';

		if (params['value'] != undefined) {
			tx['value'] = params['value'];
		}

		// if( tx['to'] != undefined) {
		//   if( tx['data'] != undefined) {
		//     gasLimit = await this.web3.eth.estimateGasPromise({from: tx['from'], to: tx['to'], data: tx['data']})
		//   }else{
		//     gasLimit = await this.web3.eth.estimateGasPromise({from: tx['from'], to: tx['to']})
		//   }
		// }

		tx['gasLimit'] = parseInt(gasLimit)
		tx['gas'] = parseInt(gasLimit)

		console.log(JSON.stringify(tx))

		let transaction = new Transaction(tx)
		let key = this.walletService.privateKey()

		transaction.sign(key)
		let signed = transaction.serialize().toString('hex')

		console.log('signed: ' + signed)
		callback(null, '0x' + signed)
	}

	public async getBalance(): Promise<number> {
		let number = await this.web3.eth.getBalancePromise(this.walletService.address);
		return this.web3.fromWei(number, 'ether');
	}

	public etherToWei(ether: number) {
		let wei = this.web3.toWei(ether.toString(), 'ether');
		return wei;
	}
}
