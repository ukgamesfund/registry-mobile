import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TransactionService} from "../../providers/transaction-service";

import {Dialogs} from '@ionic-native/dialogs';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {IdentityService} from "../../providers/identity-service";
import {WalletService} from "../../providers/wallet-service";
import {ApiService} from "../../providers/api-service";
import {ProjectCreatePage} from "../project-create/project-create";

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	private loading: Loading
	private projectCreatePage = ProjectCreatePage;

	private projects: any;

	constructor(private navCtrl: NavController,
	            private navParams: NavParams,
	            private dialogs: Dialogs,
	            private loadingCtrl: LoadingController,
	            private platform: Platform,
	            private regularStorage: Storage,
	            private transactionService: TransactionService,
	            private walletService: WalletService,
	            private identityService: IdentityService,
	            private apiService: ApiService,) {

		this.loading = this.loadingCtrl.create({
			showBackdrop: true,
			content: "Please wait while we're preparing your experience..."
		});
	}

	private async ngOnInit() {
		await this.loading.present();

		await this.walletService.initializeWallet();
		this.projects = await this.apiService.getAllProjects();

		await this.loading.dismiss();
		console.log('projects= '+JSON.stringify(this.projects));
	}
}
