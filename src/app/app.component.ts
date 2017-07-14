import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {WalletPage} from '../pages/wallet/wallet';
import {TxDemoPage} from '../pages/tx-demo/tx-demo';
//import {StartupPage} from "../pages/startup/startup";
import {Deeplinks} from "@ionic-native/deeplinks";
import {ScannerPage} from "../pages/scanner/scanner";
import {SocialConnectPage} from "../pages/social-connect/social-connect";
import {RegisterPage} from "../pages/register/register";
import {ProfilePage} from "../pages/profile/profile";
import {JobListPage} from "../pages/job-list/job-list";
import {PostJobPage} from "../pages/post-job/post-job";
import {PostJobRewardPage} from "../pages/post-job/step-reward/postjob-reward";

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = WalletPage;

	pages: Array<{ title: string, component: any }>;

	constructor(public platform: Platform,
	            public statusBar: StatusBar,
	            public splashScreen: SplashScreen,
	            private deepLinks: Deeplinks) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{title: 'Wallet', component: WalletPage},
			{title: 'Transaction', component: TxDemoPage},
		];
	}

	async initializeApp() {
		await this.platform.ready()

		// Okay, so the platform is ready and our plugins are available.
		// Here you can do any higher level native things you might need.
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
