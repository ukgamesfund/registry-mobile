import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams} from 'ionic-angular';

import {Dialogs} from '@ionic-native/dialogs';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {IdentityService} from "../../providers/identity-service";
import {ApiService} from "../../providers/api-service";
import {WalletService} from "../../providers/wallet-service";
import {AccountCreatePage} from "../account-create/account-create";

@Component({
	selector: 'page-startup',
	templateUrl: 'startup.html'
})
export class StartupPage {

	private loading: Loading

	constructor(private navCtrl: NavController,
	            private navParams: NavParams,
	            private dialogs: Dialogs,
	            private loadingCtrl: LoadingController,
	            private platform: Platform,
	            private regularStorage: Storage,
	            private walletService: WalletService,
	            private identityService: IdentityService,
	            private apiService: ApiService) {

		this.loading = this.loadingCtrl.create({
			showBackdrop: true,
			content: "Please wait while we're preparing your experience..."
		});
		this.loading.present()
	}

	async ngOnInit() {

		let success = await this.apiService.initialize();
		if (!success) {
			this.dialogs.alert(
				"Problem communicating with cloud services",
				"Communication problem",
				"OK"
			).then(() => this.platform.exitApp())
		}

		await this.loading.dismiss()
	}

	public async onRestore() {

	}

	public async onCreate() {
		await this.navCtrl.setRoot(AccountCreatePage);
	}
}
