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
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WalletService } from '../../providers/wallet-service';
let WalletPage = class WalletPage {
    constructor(navCtrl, walletService) {
        this.navCtrl = navCtrl;
        this.walletService = walletService;
    }
    hit() {
        console.log(this.walletService.hit());
    }
    wallet() {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet = yield this.walletService.getWallet();
            console.log(wallet.getAddressString());
        });
    }
};
WalletPage = __decorate([
    Component({
        selector: 'page-wallet',
        templateUrl: 'wallet.html',
    }),
    __metadata("design:paramtypes", [NavController,
        WalletService])
], WalletPage);
export { WalletPage };
//# sourceMappingURL=wallet.js.map