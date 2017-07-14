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
import { Dialogs } from '@ionic-native/dialogs';
import { TxDemoPage } from "../tx-demo/tx-demo";
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
let StartupPage = class StartupPage {
    constructor(navCtrl, navParams, dialogs, loadingCtrl, platform, regularStorage, transactionService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dialogs = dialogs;
        this.loadingCtrl = loadingCtrl;
        this.platform = platform;
        this.regularStorage = regularStorage;
        this.transactionService = transactionService;
        this.loading = this.loadingCtrl.create({
            showBackdrop: true,
            spinner: "ios",
            content: "Please wait we check your device's security settings.."
        });
        this.loading.present();
    }
    ionViewDidLoad() {
        console.log('StartupPage.ionViewDidLoad()');
    }
    ionViewWillEnter() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('StartupPage.ionViewWillEnter()');
            let success = yield this.transactionService.initialise();
            this.loading.dismiss();
            if (success) {
                console.log('TransactionService initialised, next: TxDemoPage');
                this.navCtrl.setRoot(TxDemoPage, null, {
                    animate: true
                });
                return;
            }
            yield this.regularStorage.set("wallet-needs-reset", true);
            console.log('TransactionService init not possible');
            this.dialogs.alert("Please enable device security", "Security Alert", "OK").then(() => this.platform.exitApp());
        });
    }
};
StartupPage = __decorate([
    Component({
        selector: 'page-startup',
        templateUrl: 'startup.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Dialogs,
        LoadingController,
        Platform,
        Storage,
        TransactionService])
], StartupPage);
export { StartupPage };
//# sourceMappingURL=startup.js.map