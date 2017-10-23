import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Config} from './utility-service';
import {IdentityService} from './identity-service';
import {WalletService} from './wallet-service';
import {Dialogs} from '@ionic-native/dialogs';
import {Platform} from 'ionic-angular';
import {CreateUserDto} from "../models/dto/create-user.dto";
import {CreateProjectDto} from "../models/dto/create-project.dto";
import {GetMyProjectsDto} from "../models/dto/get-my-projects.dto";
import {GetProjectDto} from "../models/dto/get-project.dto";

@Injectable()
export class ApiService {
	private initialised: boolean = false;
	private me: any;

	constructor(private http: Http,
	            private identityService: IdentityService,
	            private walletService: WalletService,
	            private dialogs: Dialogs,
	            private platform: Platform,) {
	}

	public async getOptions() : Promise<RequestOptions> {

		let jwt = await this.identityService.jwt();

		let headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', 'Bearer '+jwt);

		return new RequestOptions({headers: headers});
	}

	public async getHeaders() : Promise<RequestOptions> {

		let headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');

		return new RequestOptions({headers: headers});
	}

	public async initialize(): Promise<Boolean> {
		if (this.initialised) {
			return;
		}

		console.log('ApiService.initialize()');
		try {

			let headers = new Headers();
			headers.append('Accept', 'application/json');
			headers.append('Content-Type', 'application/json');
			let options = new RequestOptions({headers: headers});

			let res = await this.http.get(Config.API_HOST+'/api/ping', options).toPromise();
			if(res.json().message === 'pong') {
				return Promise.resolve(true);
			}
		} catch(err) {
			return Promise.reject(false);
		}
		return Promise.reject(false);
	}

	public async ethereumFaucet() {
		let options = await this.getOptions();
		let res = await this.http.get(Config.API_HOST+'/api/ethereum/faucet', options).toPromise();
		let tx = res.json().tx;
		return Promise.resolve(tx);
	}

	public async addUser(name: string, email: string): Promise<any> {
		let address = await this.walletService.address;

		let body: CreateUserDto = {
			email: email,
			name: name,
			ethAddress: address
		}

		let options = await this.getOptions();

		try {
			let res = await this.http.post(Config.API_HOST+'/api/user', body, options).toPromise();
			let json = res.json();
			return Promise.resolve(json);
		} catch(err) {
			let message = JSON.parse(err['_body']).message;
			return Promise.reject(message);
		}
	}

	public async getUser(): Promise<any> {
		let address = await this.walletService.address;
		let options = await this.getOptions();
		let res = await this.http.get(Config.API_HOST+'/api/user/'+address, options).toPromise();
		let json = res.json();
		return Promise.resolve(json);
	}

	public async updateUser(name: string, email: string) {
		let address = await this.walletService.address;

		let body: CreateUserDto = {
			email: email,
			name: name,
			ethAddress: address
		}

		let options = await this.getOptions();
		let res = await this.http.put(Config.API_HOST+'/api/user', body, options).toPromise();
		let json = res.json()
		return Promise.resolve(json)
	}

	public async sendEmailCode(email: string): Promise<any> {

		let options = await this.getHeaders();
		let body = {
			email: email
		}

		let res = await this.http.post(Config.API_HOST+'/api/email/code', body, options).toPromise();
		let json = res.json();
		return Promise.resolve(json);
	}

	public async confirmEmailCode(email: string, code: string): Promise<any> {

		let options = await this.getHeaders();
		let body = {
			payload: {
				email: email,
				code: code
			}
		}

		try {
			let res = await this.http.post(Config.API_HOST+'/api/email/confirm', body, options).toPromise();
			let json = res.json();
			return Promise.resolve(json);
		} catch(err) {
			let message = JSON.parse(err['_body']).message;
			return Promise.reject(message);
		}
	}

	public async getMyProjects(): Promise<GetMyProjectsDto> {
		let options = await this.getOptions();
		let user = await this.getUser();

		let res = await this.http.get(Config.API_HOST+'/api/projects/'+user.email, options).toPromise();
		let json: GetMyProjectsDto = res.json();
		return Promise.resolve(json);
	}

	public async createNewProject(project: CreateProjectDto): Promise<any> {
		let options = await this.getOptions();

		let res = await this.http.post(Config.API_HOST+'/api/project', project, options).toPromise();
		let json = res.json();
		return Promise.resolve(json);
	}

	public async getProjectByName(name: string): Promise<GetProjectDto> {
		let b64name = new Buffer(name).toString('base64')
		let options = await this.getOptions();

		let res = await this.http.get(Config.API_HOST+'/api/project/'+b64name, options).toPromise();
		let json: GetProjectDto = res.json();
		return Promise.resolve(json);
	}

}
