import {ProjectState} from '../entity/project.entity'

export class CreativeFounder {
	readonly name: string;
	readonly email: string;
	readonly silvertals: number;
	readonly coppertals: number;
}

export class CreateProjectDto {
	readonly name: string;
	readonly projectEmail: string;
	readonly details: any;
	readonly creativeFounders: CreativeFounder[];
}