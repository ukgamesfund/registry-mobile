var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { WalletService } from "./wallet-service";
const Web3 = require('web3');
const HookedWeb3Provider = require("hooked-web3-provider");
const Transaction = require("ethereumjs-tx");
//const EthUtil = require('ethereumjs-util');
const PromisifyWeb3 = require("../utils/promisifyWeb3.js");
const Contract = require("truffle-contract");
let TransactionService = TransactionService_1 = class TransactionService {
    constructor(http, walletService, platform) {
        this.http = http;
        this.walletService = walletService;
        this.platform = platform;
        this.rpc = "http://parity.dltlab.io:8545";
        this.address = "0x0a8d600529f3061368c77772caa6dd02fe3e4946";
        console.log('TransactionService.constructor()');
    }
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            // wait for the platform to initialise before accessing storage plugin
            yield this.platform.ready();
            console.log("TransactionService.initialise()");
            // make sure the wallet is initialised
            let initialised = yield this.walletService.initialise();
            if (initialised == false) {
                return false;
            }
            console.log("wallet...." + this.walletService.address);
            this.web3 = new Web3(this.getHookedWeb3Provider());
            PromisifyWeb3.promisify(this.web3);
            let truffle = Contract(require("../utils/test.json"));
            truffle.setProvider(this.getHookedWeb3Provider());
            this.contract = yield truffle.at(this.address);
            return true;
        });
    }
    blockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            let blockNumber = yield this.web3.eth.getBlockNumberPromise();
            return blockNumber;
        });
    }
    getTestNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TransactionService.getTestNumber()");
            return yield this.contract.Number();
        });
    }
    setTestNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TransactionService.setTestNumber()");
            let result = yield this.contract.SetNumber(number, { from: this.walletService.address });
            return result;
        });
    }
    getHookedWeb3Provider() {
        let provider = new HookedWeb3Provider({
            host: this.rpc,
            transaction_signer: {
                hasAddress: (address, callback) => {
                    callback(null, address === this.walletService.address);
                },
                signTransaction: (params, callback) => {
                    this.sign(params, callback);
                }
            }
        });
        return provider;
    }
    sign(params, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TransactionService.sign()");
            let tx = {};
            let gasPrice = yield this.web3.eth.getGasPricePromise();
            let nonce = yield this.web3.eth.getTransactionCountPromise(params['from'], 'pending');
            tx['from'] = TransactionService_1.add0x(params.from);
            tx['to'] = TransactionService_1.add0x(params.to);
            tx['data'] = TransactionService_1.add0x(params.data);
            tx['gasPrice'] = parseInt(gasPrice);
            tx['nonce'] = parseInt(nonce);
            let gasLimit = yield this.web3.eth.estimateGasPromise({ to: tx['to'], data: tx['data'] });
            tx['gasLimit'] = parseInt(gasLimit);
            tx['gas'] = parseInt(gasLimit);
            let obj = new Transaction(tx);
            //let raw = obj.serialize().toString('hex')
            //console.log("raw: "+ raw)
            let wallet = yield this.walletService.getWallet();
            let key = wallet.getPrivateKey();
            obj.sign(key);
            let signed = obj.serialize().toString('hex');
            console.log("signed: " + signed);
            callback(null, '0x' + signed);
        });
    }
    static add0x(input) {
        if (typeof (input) !== 'string') {
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
        if (typeof (input) !== 'string') {
            return input;
        }
        else if (input.length >= 2 && input.slice(0, 2) === '0x') {
            return input.slice(2);
        }
        else {
            return input;
        }
    }
};
TransactionService = TransactionService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http,
        WalletService,
        Platform])
], TransactionService);
export { TransactionService };
var TransactionService_1;
//# sourceMappingURL=transaction-service.js.map