import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {BarcodeScanner, BarcodeScanResult} from '@ionic-native/barcode-scanner';
import {TxDemoPage} from '../tx-demo/tx-demo';
import {IdentityService} from '../../providers/identity-service';

@Component({
	selector: 'page-scanner',
	templateUrl: 'scanner.html',
})
export class ScannerPage {

	constructor(public navCtrl: NavController,
	            public navParams: NavParams,
	            private barcodeScanner: BarcodeScanner,
	            private identityService: IdentityService) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ScannerPage');
	}

	ionViewWillEnter() {

		/*
		 this.identityService.sendJwt("");
		 this.navCtrl.setRoot(TxDemoPage, null, {
		 animate: false
		 });
		 return;
		 */

		this.barcodeScanner.scan({
			preferFrontCamera: false,
			orientation: 'portrait'
		}).then( (data: BarcodeScanResult) => {
			console.log(JSON.stringify(data));

			if (!data.cancelled) {
				//this.identityService.sendJwt(data.text);
			}

			this.navCtrl.setRoot(TxDemoPage, null, {
				animate: false
			});

		}).catch(err => {
			console.log(JSON.stringify(err));

			this.navCtrl.setRoot(TxDemoPage, null, {
				animate: true
			});
		});

	}

}
