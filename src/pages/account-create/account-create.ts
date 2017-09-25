import {Component} from '@angular/core';

import {Dialogs} from '@ionic-native/dialogs';
import {ApiService} from "../../providers/api-service";

import * as EmailValidator from 'email-validator';
import {NavController, NavParams} from "ionic-angular";
import {AccountValidateEmailPage} from "../account-validate-email/account-validate-email";

@Component({
	selector: 'page-account-create',
	templateUrl: 'account-create.html'
})
export class AccountCreatePage {

	private name: string;
	private email: string;

	constructor(private dialogs: Dialogs,
	            private apiService: ApiService,
	            private navParams: NavParams,
	            private navCtrl: NavController,) {

	}

	async ngOnInit() {

	}

	public async onCreate() {

		if(!this.name || this.name.length==0) {
			await this.dialogs.alert(
				"Please enter your full name",
				"Data error",
				"OK"
			)
			return;
		}

		if(!EmailValidator.validate(this.email)) {
			await this.dialogs.alert(
				"Please enter a valid email address",
				"Data error",
				"OK"
			)
			return;
		}

		try {
			let ok = await this.apiService.sendEmailCode(this.email);
		} catch (err) {
			await this.dialogs.alert(
				err.message,
				"Email error",
				"OK"
			)
			return;
		}

		await this.navCtrl.push(AccountValidateEmailPage, {email: this.email, name: this.name})
	}
}
