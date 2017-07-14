import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";
import {Config} from "./utility-service";
import {IdentityService} from "./identity-service";

@Injectable()
export class ApiService {
	headers: Headers;
	requestOptions: RequestOptions;
	initialised: boolean = false;

	constructor(private http: Http,
	            private identityService: IdentityService) {

		this.headers = new Headers({'Content-Type': 'application/json'});
		this.requestOptions = new RequestOptions(
			{
				withCredentials: true,
				headers: this.headers
			}
		);

	}

	public async initialise() {
		if (this.initialised) {
			return;
		}
		// make sure all other components are initialised
		await this.identityService.initialise();

		let jwt = await this.identityService.getJwt();
		this.headers.append('Authorization', 'Bearer ' + jwt);
		this.requestOptions.headers = this.headers;

		this.initialised = true;
	}


	public ethereumFaucet(data) {
		return this.http.get(Config.API_HOST + "/v1/ethereum/faucet?address=" + data.address + "&amount=" + data.amount, this.requestOptions).toPromise();
	}

}
