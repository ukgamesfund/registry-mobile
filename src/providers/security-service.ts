import {Injectable} from "@angular/core";
import {WalletService} from "./wallet-service";
import {ApiService} from "./api-service";


@Injectable()
export class SecurityService {
	private initialised: boolean = false;

	constructor(public walletService: WalletService,
	            public apiService: ApiService) {
	}


	public async initialise(): Promise<boolean> {

		// if already initialised we return immediately
		if (this.initialised) {
			return true
		}

		await this.walletService.initialise();

		//await this.loadPerson();
		this.initialised = true;

		return true;
	}

}
