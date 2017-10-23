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
import {HomePage} from "../home/home";

@Component({
	selector: 'page-project-create',
	templateUrl: 'project-create.html',
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

		let f1: CreativeFounder = {
			email: 'mihai+founder1@dltlab.io',
			silver: 11,
			copper: 12,
			name: ''
		};
		this.founders.push(f1);
		this.name = 'Project 1';
		this.email = 'mihai+project1@dltlab.io';
		this.description = 'Awesome project 1';
	}

	private async addCreativeFounder() {

		let founder: CreativeFounder = {
			name: undefined,
			email: undefined,
			silver: 0,
			copper: 0
		}

		let profileModal = this.modalCtrl.create(ProjectCreateAddFounderPage, {founder: founder, index: undefined});
		profileModal.onDidDismiss(data => {

			if(data == undefined || data == null) {
				return;
			}

			let founder = data.founder;

			if(founder == undefined || founder == null) {
				return;
			}
			this.founders.push(founder);
			console.log(JSON.stringify(this.founders, null, 2));
		});
		await profileModal.present();
	}

	private async editCreativeFounder(founder: CreativeFounder) {

		let idx: number = 0;
		for (const {item, index} of this.founders.map((item, index) => ({ item, index }))) {
			if(item.email === founder.email) {
				idx = index;
				break;
			}
		}

		let profileModal = this.modalCtrl.create(ProjectCreateAddFounderPage, {founder: founder, index: idx});
		profileModal.onDidDismiss(data => {

			if(data == undefined || data == null) {
				return;
			}

			let founder = data.founder;
			let index = data.index;

			if(founder == undefined || founder == null) {
				return;
			}

			this.founders[index] = founder;
			console.log(JSON.stringify(this.founders, null, 2));
		});
		await profileModal.present();
	}

	private async deleteCreativeFounder(founder: CreativeFounder) {
		let idx: number = 0;
		for (const {item, index} of this.founders.map((item, index) => ({ item, index }))) {
			if(item.email === founder.email) {
				idx = index;
				break;
			}
		}
		this.founders.splice(idx, 1);
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

		try {
			let res = await this.apiService.createNewProject(project);
			console.log(JSON.stringify(res));
			await this.navCtrl.setRoot(HomePage);
		} catch (err) {
			await this.dialogs.alert(
				'There was an error trying to submit the new project.',
				'Error'
			)
		}

	}
}
