


export enum ClientType {
	Simulator = 1,
	Device,
	Cloud
}

export class Config {
	private static type: ClientType = ClientType.Cloud


	public static get ORIGIN_HOST(): string {
		if (Config.type == ClientType.Simulator) {
			return 'http://192.168.58.1:8100'
		}

		if (Config.type == ClientType.Device) {
			return 'http://192.168.86.22:8100'
		}

		if (Config.type == ClientType.Cloud) {
			return "http://services.talregistry.com"
		}

		return undefined
	}
}


