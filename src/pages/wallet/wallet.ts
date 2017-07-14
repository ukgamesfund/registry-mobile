import {Component, NgZone} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {WalletService} from '../../providers/wallet-service'
import {ApiService} from "../../providers/api-service";
import {TransactionService} from "../../providers/transaction-service";
import {SecurityService} from "../../providers/security-service";

@Component({
	selector: 'page-wallet',
	templateUrl: 'wallet.html',
})
export class WalletPage {
	amount: number;
	balance: number = 0;

	constructor(public zone: NgZone,
	            public navCtrl: NavController,
	            public navParams: NavParams,
	            public apiService: ApiService,
	            private walletService: WalletService,
	            private securityService: SecurityService,
	            private transactionService: TransactionService) {
		this.updateBalance()
	}

	public async ngOnInit() {
	}

	public async wallet() {
		let wallet = await this.walletService.getWallet()
		console.log(wallet.getAddressString())
	}

	public async walletTopup() {
		let data = {
			address: this.walletService.address,
			amount: this.transactionService.etherToWei(this.amount)
		};

		let response = await this.apiService.ethereumFaucet(data);
		let res = response.json()
		console.log(JSON.stringify(res))

		for (let x = 0; x < 5; x++) setTimeout(() => {
			this.updateBalance();
		}, 2000 * x);
	}

	private async updateBalance() {
		console.log("Updating Ether balance")

		await this.transactionService.initialise()

		this.zone.run(async () => {
			this.balance = await this.transactionService.getBalance();
		})
	}
}
