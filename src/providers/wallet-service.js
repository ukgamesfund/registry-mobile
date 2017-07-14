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
let Wallet = require('ethereumjs-wallet');
let EthUtil = require("ethereumjs-util");
import { SecureStorage } from '@ionic-native/secure-storage';
import { Storage } from '@ionic/storage';
let WalletService = class WalletService {
    constructor(http, secureStorage, regularStorage, platform) {
        this.http = http;
        this.secureStorage = secureStorage;
        this.regularStorage = regularStorage;
        this.platform = platform;
        this.wallet = null;
    }
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            // wait for the platform to initialise before accessing storage plugin
            yield this.platform.ready();
            yield this.regularStorage.ready();
            console.log("WalletService.initialise()");
            try {
                this.walletSecureStorage = yield this.secureStorage.create("secure-storage");
            }
            catch (error) {
                console.log(error.message);
                return Promise.resolve(false);
            }
            let keys = yield this.walletSecureStorage.keys();
            let walletNeedsReset = yield this.regularStorage.get("wallet-needs-reset");
            if (keys.indexOf("wallet") !== -1 && walletNeedsReset === null) {
                try {
                    let privateKey = yield this.walletSecureStorage.get("wallet");
                    this.wallet = Wallet.fromPrivateKey(new Buffer(privateKey, 'hex'));
                    this.address = this.wallet.getAddressString();
                    return Promise.resolve(true);
                }
                catch (error) {
                    console.log(error.message);
                    return Promise.resolve(false);
                }
            }
            console.log("Wallet not found. Generating new wallet now..");
            yield this.generate();
            return Promise.resolve(true);
        });
    }
    hit() {
        return this.state;
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            let promises = [];
            promises.push(this.walletSecureStorage.remove("wallet"));
            promises.push(this.regularStorage.remove("wallet-needs-reset"));
            try {
                yield Promise.all(promises);
            }
            catch (error) {
            }
            this.wallet = Wallet.generate();
            this.address = this.wallet.getAddressString();
            let privateKey = EthUtil.stripHexPrefix(this.wallet.getPrivateKeyString());
            yield this.walletSecureStorage.set("wallet", privateKey);
            return this.wallet.getAddressString();
        });
    }
    getWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.wallet != null) {
                return this.wallet;
            }
            yield this.initialise();
            return this.wallet;
        });
    }
};
WalletService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http,
        SecureStorage,
        Storage,
        Platform])
], WalletService);
export { WalletService };
//# sourceMappingURL=wallet-service.js.map