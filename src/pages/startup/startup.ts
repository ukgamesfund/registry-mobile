import {Component} from '@angular/core';
import {ActionSheetController, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TransactionService} from "../../providers/transaction-service";

import {Dialogs} from '@ionic-native/dialogs';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {IdentityService} from "../../providers/identity-service";
import {WalletService} from "../../providers/wallet-service";
import {ApiService} from "../../providers/api-service";
import {SecurityService} from "../../providers/security-service";
import {WalletPage} from "../wallet/wallet";

@Component({
	selector: 'page-startup',
	templateUrl: 'startup.html'
})
export class StartupPage {

	private loading: Loading
	private registerType: string;
	private invitedBy: string;

	constructor(public navCtrl: NavController,
	            public navParams: NavParams,
	            private dialogs: Dialogs,
	            private loadingCtrl: LoadingController,
	            public actionSheetCtrl: ActionSheetController,
	            private platform: Platform,
	            private regularStorage: Storage,
	            private transactionService: TransactionService,
	            private walletService: WalletService,
	            private identityService: IdentityService,
	            private apiService: ApiService,
	            private securityService: SecurityService) {
		this.invitedBy = this.navParams.get('invitedby');

		console.log(this.invitedBy);
		this.loading = this.loadingCtrl.create({
			showBackdrop: true,
			//spinner: "ios",
			content: "Please wait while we're crunching the numbers..."
		});
		this.loading.present()
	}

	async ngOnInit() {
		let success = await this.transactionService.initialise()
		success = success && await this.identityService.initialise()


		this.loading.dismiss("ionViewWillEnter")

		if (!success) {
			await this.regularStorage.set("wallet-needs-reset", true)
			console.log('TransactionService init not possible')
			this.dialogs.alert(
				"Please enable device security",
				"Security Alert",
				"OK"
			).then(() => this.platform.exitApp())
		}

		await this.apiService.initialise();
		await this.securityService.initialise();

		let balance = await this.transactionService.getBalance()
		if (balance > 0) {
			console.log("Ether balance already positive, no need for topup")
			return
		}

		let data = {
			address: this.walletService.address,
			amount: this.transactionService.etherToWei(0.05)
		};

		let response = await this.apiService.ethereumFaucet(data);
		let res = response.json()
		console.log(JSON.stringify(res))
	}

	public presentSignUpActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Sign up to',
			cssClass: 'homepage-action-sheet',
			buttons: [
				{
					text: 'Refer jobs',
					role: 'destructive',
					cssClass: 'homepage-action-sheet-button',
					handler: () => {
						this.registerType = 'sourcer';
						let navTransition = actionSheet.dismiss();
						navTransition.then(() => {
							this.navCtrl.push(WalletPage, {registerType: this.registerType});
						});
						return false;
					}
				},
				{
					text: 'Post jobs',
					role: 'destructive',
					cssClass: 'homepage-action-sheet-button',
					handler: () => {
						this.registerType = 'seeker';
						let navTransition = actionSheet.dismiss();
						navTransition.then(() => {
							this.navCtrl.push(WalletPage, {registerType: this.registerType});
						});
						return false;
					}
				},
				{
					text: 'Apply to job',
					role: 'destructive',
					cssClass: 'homepage-action-sheet-button',
					handler: () => {
						this.registerType = 'prospect';
						let navTransition = actionSheet.dismiss();
						navTransition.then(() => {
							this.navCtrl.push(WalletPage, {registerType: this.registerType});
						});
						return false;
					}
				}
			]
		});

		actionSheet.present();
	}
}
