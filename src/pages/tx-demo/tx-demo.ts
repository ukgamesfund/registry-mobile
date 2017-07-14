import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams, Refresher} from 'ionic-angular';
import {TransactionService} from "../../providers/transaction-service";
import {Http} from '@angular/http';
import '../../utils/rxjs-operators'
import {IdentityService} from "../../providers/identity-service";

@Component({
	selector: 'page-tx-demo',
	templateUrl: 'tx-demo.html'
})
export class TxDemoPage {

	public number: number = 0;
	private loading: Loading;

	constructor(private http: Http,
	            public navCtrl: NavController,
	            public navParams: NavParams,
	            private loadingCtrl: LoadingController,
	            private identityService: IdentityService,
	            private transactionService: TransactionService) {

	}

	public async test() {
		return null
	}

	public async getTestNumber() {
		console.log("TxDemoPage.getTestNumber()")

		try {
			this.number = await this.transactionService.getTestNumber()
		} catch (err) {
			this.number = 0
		}
	}

	public async callRegister() {
		//return this.identityService.register()
	}

	public async callIssueJwt() {
		let jwt = await this.identityService.getJwt()
		console.log(jwt)
	}

	public async callIsRegistered() {
		//return this.identityService.registered()
	}

	public async setTestNumber() {
		console.log("TxDemoPage.setTestNumber()")

		let loading = this.loadingCtrl.create({
			showBackdrop: true,
			spinner: "ios",
			content: "Please wait while we communicate with the blockchain.."
		});
		loading.present()

		let result = await this.transactionService.setTestNumber(this.number)
		console.log("result: " + JSON.stringify(result))
		await this.getTestNumber()

		loading.dismiss()
	}

	ionViewDidLoad() {
		console.log("TxDemoPage.ionViewDidLoad()")
	}

	async ionViewWillEnter() {
		await this.getTestNumber()
	}

	public async getApi() {
		console.log("TxDemoPage.getapi()")

		let result = await this.http.get("https://randomuser.me/api/").toPromise()
		console.log(result.json())
	}

	private async doIonStart(refresher: Refresher) {
		console.log("TxDemoPage.doIonStart()")

		this.loading = this.loadingCtrl.create({
			showBackdrop: true,
			spinner: "ios",
			content: "Please wait while we communicate with the blockchain.."
		});
		this.loading.present()
	}

	private async doIonRefresh(refresher: Refresher) {
		console.log("TxDemoPage.doIonRefresh()")
		await this.getTestNumber()

		refresher.complete()
		this.loading.dismiss()
		this.loading = null
	}


}
