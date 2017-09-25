import {Component} from '@angular/core';

import {Dialogs} from '@ionic-native/dialogs';
import {ApiService} from "../../providers/api-service";
import {NavController, NavParams} from "ionic-angular";
import {HomePage} from "../home/home";
import {WalletService} from "../../providers/wallet-service";

@Component({
	selector: 'page-account-validate-email',
	templateUrl: 'account-validate-email.html'
})
export class AccountValidateEmailPage {

	private code: string;
	private email: string;
	private name: string;

	constructor(private dialogs: Dialogs,
	            private apiService: ApiService,
	            private navParams: NavParams,
	            private walletService: WalletService,
	            private navCtrl: NavController,) {

		this.email = this.navParams.get('email');
		this.name = this.navParams.get('name');
	}

	async ngOnInit() {

	}

	public async onConfirm() {

		if(!this.code || this.code.length!=6) {
			await this.dialogs.alert(
				"The code must be formed of 6 digits",
				"Confirmation error",
				"OK"
			)
			return;
		}

		try {
			await this.apiService.confirmEmailCode(this.email, this.code);
		} catch (err) {

			await this.dialogs.alert(
				err,
				"Email confirmation error",
				"OK"
			)
			return;
		}

		await this.walletService.initializeWallet();

		try {
			await this.apiService.addUser(this.name, this.email);
		} catch (err) {

			await this.dialogs.alert(
				err,
				"Account creation error",
				"OK"
			)
			return;
		}

		await this.navCtrl.setRoot(HomePage)
	}
}
