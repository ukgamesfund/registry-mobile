import {Project} from "../entity/project.entity"
import {Membership} from "../entity/membership.entity";

export class GetProjectsDto {
	private memberOf: Array<Project> = [];

	constructor(private initiated: Project[],
	            memberships: Membership[]) {

		if (memberships.length <= 0) {
			return;
		}

		this.memberOf = new Array(memberships.length);
		for (let membership of memberships) {
			this.memberOf.push(membership.project);
		}
	}
}