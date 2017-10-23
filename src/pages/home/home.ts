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
import {GetMyProjectsDto} from "../../models/dto/get-my-projects.dto";
import {GetProjectDto} from "../../models/dto/get-project.dto";
import {ProjectState} from "../../models/entity/project.entity";

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class HomePage {

	private loading: Loading
	private projectCreatePage = ProjectCreatePage;

	private projects: GetMyProjectsDto;

	private allProjects: GetProjectDto[] = [];

	private draftProjects: GetProjectDto[] = [];
	private awaitingProjects: GetProjectDto[] = [];
	private confirmedProjects: GetProjectDto[] = [];
	private committedProjects: GetProjectDto[] = [];
	private declinedProjects: GetProjectDto[] = [];

	private haveProjects: boolean = false;

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

		this.projects = await this.apiService.getMyProjects();
		this.haveProjects = this.projects.initiated.length>0 || this.projects.memberOf.length>0;

		for(let project of this.projects.initiated) {
			let pj = await this.apiService.getProjectByName(project.name);
			this.allProjects.push(pj);
		}

		for(let project of this.projects.memberOf) {
			let pj = await this.apiService.getProjectByName(project.name);
			this.allProjects.push(pj);
		}

		for(let project of this.allProjects) {
			if(project.state == ProjectState.Draft) {
				this.draftProjects.push(project);
			}
			if(project.state == ProjectState.AwaitsConfirmation) {
				this.awaitingProjects.push(project);
			}
			if(project.state == ProjectState.Confirmed) {
				this.confirmedProjects.push(project);
			}
			if(project.state == ProjectState.Committed) {
				this.committedProjects.push(project);
			}
			if(project.state == ProjectState.Declined) {
				this.declinedProjects.push(project);
			}
		}

		console.log(JSON.stringify(this.allProjects));
		await this.loading.dismiss();
	}
}
