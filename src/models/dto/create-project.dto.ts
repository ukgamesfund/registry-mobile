import {ProjectState} from "../entity/project.entity"

export class CreativeFounder {
	readonly name: string;
	readonly email: string;
	readonly silver: number;
	readonly copper: number;
}

export class CreateProjectDto {
	readonly initiatorAddress: string;
	readonly state: ProjectState;
	readonly name: string;
	readonly email: string;
	readonly details: any;
	readonly founders: CreativeFounder[];
}