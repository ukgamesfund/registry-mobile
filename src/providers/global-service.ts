import {Injectable} from '@angular/core';
import Semaphore from 'semaphore-async-await';

@Injectable()
export class GlobalService {
	private lock = new Semaphore(1);

	constructor() {
	}


	public async acquire(): Promise<Boolean> {
		return await this.lock.acquire();
	}

	public async release() {
		await this.lock.release();
	}

	public async wait(): Promise<Boolean> {
		return this.lock.wait()
	}
}
