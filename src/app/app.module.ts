import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {IonicStorageModule} from "@ionic/storage";
import {HttpModule} from "@angular/http";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SecureStorage} from "@ionic-native/secure-storage";

import {Dialogs} from "@ionic-native/dialogs";
import {QRCodeComponent, QRCodeModule} from "angular2-qrcode";

import {Deeplinks} from "@ionic-native/deeplinks";
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

// our components
import {WalletPage} from "../pages/wallet/wallet";
import {TxDemoPage} from "../pages/tx-demo/tx-demo";
import {StartupPage} from "../pages/startup/startup";
import {ScannerPage} from "../pages/scanner/scanner";

import {WalletService} from "../providers/wallet-service";
import {TransactionService} from "../providers/transaction-service";
import {IdentityService} from "../providers/identity-service";
import {ApiService} from "../providers/api-service";

import {HomePage} from "../pages/home/home";
import {GlobalService} from "../providers/global-service";
import {AccountCreatePage} from "../pages/account-create/account-create";
import {AccountValidateEmailPage} from "../pages/account-validate-email/account-validate-email";
import {AccountRestorePage} from "../pages/account-restore/account-restore";
import {ProjectCreatePage} from "../pages/project-create/project-create";
import {ProjectCreateAddFounderPage} from "../pages/project-create-add-founder/project-create-add-founder";


@NgModule({
	declarations: [
		MyApp,
		WalletPage,
		TxDemoPage,
		StartupPage,
		HomePage,
		ScannerPage,
		AccountCreatePage,
		AccountRestorePage,
		AccountValidateEmailPage,
		ProjectCreatePage,
		ProjectCreateAddFounderPage,

	],
	imports: [
		QRCodeModule,
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp, {
			modalEnter: 'modal-slide-in',
			modalLeave: 'modal-slide-out',
			pageTransition: 'ios-transition'
		}),
		IonicStorageModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		QRCodeComponent,
		WalletPage,
		TxDemoPage,
		StartupPage,
		ScannerPage,
		HomePage,
		AccountCreatePage,
		AccountRestorePage,
		AccountValidateEmailPage,
		ProjectCreatePage,
		ProjectCreateAddFounderPage,
	],
	providers: [
		StatusBar,
		SplashScreen,
		SecureStorage,
		Storage,
		Dialogs,
		Deeplinks,
		BarcodeScanner,
		// local services
		WalletService,
		TransactionService,
		IdentityService,
		ApiService,
		GlobalService,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
	]
})
export class AppModule {
}
