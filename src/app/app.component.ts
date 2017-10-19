import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {WalletPage} from '../pages/wallet/wallet';
import {TxDemoPage} from '../pages/tx-demo/tx-demo';
import {StartupPage} from "../pages/startup/startup";
import {Deeplinks} from "@ionic-native/deeplinks";
import {SocialConnectPage} from "../pages/social-connect/social-connect";
import {RegisterPage} from "../pages/register/register";
import {ProfilePage} from "../pages/profile/profile";
import {JobListPage} from "../pages/job-list/job-list";
import {PostJobPage} from "../pages/post-job/post-job";
import {PostJobRewardPage} from "../pages/post-job/step-reward/postjob-reward";
import {HomePage} from "../pages/home/home";
import {WalletService} from "../providers/wallet-service";
import {Dialogs} from "@ionic-native/dialogs";

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = StartupPage;

	pages: Array<{ title: string, component: any }>;
	pages2: any;

	constructor(private dialogs: Dialogs,
	            private platform: Platform,
	            private statusBar: StatusBar,
	            private splashScreen: SplashScreen,
	            private deepLinks: Deeplinks,
				private walletService: WalletService,
				private regularStorage: Storage,) {
		this.initializeApp();

		this.pages = [
			{title: 'Wallet', component: WalletPage},
			{title: 'Transaction', component: TxDemoPage},
		];

		this.pages2 = {
			walletPage: WalletPage,
			txDemoPage: TxDemoPage,
			startupPage: StartupPage,
			homePage: HomePage,
		}
	}

	async initializeApp() {
		await this.platform.ready()

		let success = await this.walletService.initialize();
		if (!success) {
			await this.regularStorage.set("wallet-needs-reset", true);
			this.dialogs.alert(
				"Please enable device security",
				"Security Alert",
				"OK"
			).then(() => this.platform.exitApp())
		}

		if(await this.walletService.walletExists()) {
			await this.nav.setRoot(HomePage);
		} else {
			await this.nav.setRoot(StartupPage);
		}

		this.statusBar.styleDefault();
		this.splashScreen.hide();
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	async ngAfterViewInit() {
		await this.platform.ready()

		// let registrationStatus = true;

		// if( registrationStatus ) {
		//   this.nav.setRoot(JobListPage);
		// }

		// Convenience to route with a given nav
		this.deepLinks.routeWithNavController(this.nav, {
			'/wallet': WalletPage,
			'/transaction': TxDemoPage
			//'/startup/:invitedby': StartupPage,
		}).subscribe((match) => {
			console.log('Successfully routed', match);
		}, (nomatch) => {
			console.warn('Unmatched Route', nomatch);
		});
	}
}
