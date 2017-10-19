import {Component} from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {Dialogs} from "@ionic-native/dialogs";

import {IdentityService} from "../../providers/identity-service";
import {ProjectCreateAddFounderPage} from "../project-create-add-founder/project-create-add-founder";

import {ApiService} from "../../providers/api-service";
import {CreateProjectDto, CreativeFounder} from "../../models/dto/create-project.dto";
import {ProjectState} from "../../models/entity/project.entity";
import {WalletService} from "../../providers/wallet-service";

import * as EmailValidator from 'email-validator';

@Component({
	selector: 'page-project-create',
	templateUrl: 'project-create.html'
})
export class ProjectCreatePage {

	private name: string;
	private email: string;
	private description: string;
	private founders: Array<CreativeFounder> = [];

	constructor(private modalCtrl: ModalController,
	            private dialogs: Dialogs,
	            private navCtrl: NavController,
	            private navParams: NavParams,
	            private loadingCtrl: LoadingController,
	            private identityService: IdentityService,
	            private walletService: WalletService,
	            private apiService: ApiService) {

	}

	private async addCreativeFounder() {
		let profileModal = this.modalCtrl.create(ProjectCreateAddFounderPage);
		profileModal.onDidDismiss(founder => {
			if(founder == undefined || founder == null) {
				return;
			}
			this.founders.push(founder);
		});
		await profileModal.present();
	}

	private async editCreativeFounder() {
	}

	private async deleteCreativeFounder() {
	}

	private async createProject() {
		if(!EmailValidator.validate(this.email)) {
			await this.dialogs.alert(
				"Please enter a valid email address",
				"Data error",
				"OK"
			)
			return;
		}

		let address = await this.walletService.address;

		let project: CreateProjectDto = {
			name: this.name,
			email: this.email,
			initiatorAddress: address,
			state: ProjectState.Draft,
			details: {
				description: this.description
			},
			founders: this.founders
		}

		await this.apiService.createNewProject(project);
	}
}
