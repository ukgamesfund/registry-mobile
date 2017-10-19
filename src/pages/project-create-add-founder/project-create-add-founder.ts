import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {Dialogs} from "@ionic-native/dialogs";

import * as EmailValidator from 'email-validator';
import {CreativeFounder} from "../../models/dto/create-project.dto";

@Component({
	selector: 'page-project-create-add-founder',
	templateUrl: 'project-create-add-founder.html'
})
export class ProjectCreateAddFounderPage {

	private email: string;
	private silver: number = 0;
	private copper: number = 0;

	constructor(private viewCtrl: ViewController,
	            private dialogs: Dialogs,) {

	}

	private async addCreativeFounder() {
		if(!EmailValidator.validate(this.email)) {
			await this.dialogs.alert(
				"Please enter a valid email address",
				"Data error",
				"OK"
			)
			return;
		}

		let data: CreativeFounder = {
			name: '',
			email: this.email,
			silver: this.silver,
			copper: this.copper
		};
		await this.viewCtrl.dismiss(data);
	}

	private async dismiss() {
		await this.viewCtrl.dismiss();
	}
}
