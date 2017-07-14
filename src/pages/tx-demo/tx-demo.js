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
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { TransactionService } from "../../providers/transaction-service";
import { Http } from '@angular/http';
import '../../utils/rxjs-operators';
let TxDemoPage = class TxDemoPage {
    constructor(http, navCtrl, navParams, loadingCtrl, transactionService) {
        this.http = http;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.transactionService = transactionService;
        this.number = 0;
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getTestNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TxDemoPage.getTestNumber()");
            this.number = yield this.transactionService.getTestNumber();
        });
    }
    setTestNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TxDemoPage.setTestNumber()");
            let loading = this.loadingCtrl.create({
                showBackdrop: true,
                spinner: "ios",
                content: "Please wait while we communicate with the blockchain.."
            });
            loading.present();
            let result = yield this.transactionService.setTestNumber(this.number);
            console.log("result: " + JSON.stringify(result));
            yield this.getTestNumber();
            loading.dismiss();
        });
    }
    ionViewDidLoad() {
        console.log("TxDemoPage.ionViewDidLoad()");
    }
    ionViewWillEnter() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getTestNumber();
        });
    }
    getApi() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TxDemoPage.getapi()");
            let result = yield this.http.get("https://randomuser.me/api/").toPromise();
            console.log(result.json());
        });
    }
    doIonStart(refresher) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TxDemoPage.doIonStart()");
            this.loading = this.loadingCtrl.create({
                showBackdrop: true,
                spinner: "ios",
                content: "Please wait while we communicate with the blockchain.."
            });
            this.loading.present();
        });
    }
    doIonRefresh(refresher) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TxDemoPage.doIonRefresh()");
            yield this.getTestNumber();
            refresher.complete();
            this.loading.dismiss();
            this.loading = null;
        });
    }
};
TxDemoPage = __decorate([
    Component({
        selector: 'page-tx-demo',
        templateUrl: 'tx-demo.html'
    }),
    __metadata("design:paramtypes", [Http,
        NavController,
        NavParams,
        LoadingController,
        TransactionService])
], TxDemoPage);
export { TxDemoPage };
//# sourceMappingURL=tx-demo.js.map