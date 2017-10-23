import {ProjectState} from '../entity/project.entity'
import {MembershipStatus} from "../entity/membership.entity";

export class CreativeFounder {
	public constructor(readonly name: string,
		readonly email: string,
		readonly silver: number,
		readonly copper: number,
	   	readonly status?: MembershipStatus) {
	}
}

export class CreateProjectDto {
	constructor(readonly initiatorAddress: string,
		readonly state: ProjectState,
		readonly name: string,
		readonly email: string,
		readonly details: any,
		readonly founders: CreativeFounder[]) {
	}
}