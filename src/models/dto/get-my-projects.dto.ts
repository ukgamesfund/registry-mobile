import {Project} from '../entity/project.entity'
import {Membership} from "../entity/membership.entity";

export class GetMyProjectsDto {
    public memberOf: Array<Project> = [];

    constructor(public initiated: Project[],
                memberships: Membership[]) {

        for (let membership of memberships) {
            this.memberOf.push(membership.project);
        }
    }
}