import {Component} from '@angular/core';

import {Dialogs} from '@ionic-native/dialogs';
import {ApiService} from "../../providers/api-service";

import * as EmailValidator from 'email-validator';
import {NavController, NavParams} from "ionic-angular";
import {AccountValidateEmailPage} from "../account-validate-email/account-validate-email";
import {WalletService} from "../../providers/wallet-service";
import {HomePage} from "../home/home";

@Component({
	selector: 'page-account-restore',
	templateUrl: 'account-restore.html'
})
export class AccountRestorePage {

	private seed: string;

	constructor(private dialogs: Dialogs,
	            private apiService: ApiService,
	            private navParams: NavParams,
	            private walletService: WalletService,
	            private navCtrl: NavController,) {

	}

	async ngOnInit() {

	}

	public async onRestore() {

		let words = this.seed.split(' ');
		if(words.length !== 12) {
			await this.dialogs.alert(
				"Please enter all 12 words of the seed",
				"Seed error",
				"OK"
			)
		}

		try {
			await this.walletService.restoreWallet(this.seed);
		} catch(err) {
			await this.dialogs.alert(
				"The provided seed is incorrect",
				"Seed error",
				"OK"
			)
		}

		await this.navCtrl.setRoot(HomePage)
	}
}
