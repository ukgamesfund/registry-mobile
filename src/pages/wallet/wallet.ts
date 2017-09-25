import {Component, NgZone} from '@angular/core';
import {Loading, LoadingController} from 'ionic-angular';

import {WalletService} from '../../providers/wallet-service'
import {ApiService} from "../../providers/api-service";
import {TransactionService} from "../../providers/transaction-service";
import sleep from 'sleep-promise';
import {Dialogs} from "@ionic-native/dialogs";

@Component({
	selector: 'page-wallet',
	templateUrl: 'wallet.html',
})
export class WalletPage {
	amount: number = 1.0;
	balance: number = 0;
	private loading: Loading

	private user: any;

	constructor(private zone: NgZone,
	            private dialogs: Dialogs,
	            private loadingCtrl: LoadingController,
	            private apiService: ApiService,
	            private walletService: WalletService,
	            private transactionService: TransactionService) {

		this.user = {name: '', email: ''};
		this.updateBalance()
	}

	public async ngOnInit() {
		this.user = await this.apiService.getUser();
		console.log(JSON.stringify(this.user));
	}

	public async wallet() {
		let wallet = await this.walletService.getWallet()
		console.log(wallet.getAddressString())
	}

	public async walletTopup() {

		this.loading = this.loadingCtrl.create({
			showBackdrop: true,
			content: "Please wait. We are now asking for more test Ether"
		});
		await this.loading.present()

		try {
			let tx = await this.apiService.ethereumFaucet();
			console.log("Faucet tx= "+tx);
		} catch (err) {}

		for (let x = 0; x < 5; x++) {
			await this.updateBalance();
			await sleep(2000);
		}
		await this.loading.dismiss()
	}

	private async updateBalance() {
		console.log("Updating Ether balance")

		await this.transactionService.initialize()

		this.zone.run(async () => {
			this.balance = await this.transactionService.getBalance();
		})
	}

	private async onBackup() {

		let seed = this.walletService.getWalletSeed();
		console.log(seed);

		await this.dialogs.alert(
			seed,
			"Please keep this safe!",
			"OK"
		)
	}
}
