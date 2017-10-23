import {CreativeFounder} from "./create-project.dto";
import {Membership} from "../entity/membership.entity";
import {ProjectState} from "../entity/project.entity";

export class GetProjectDto {
    public founders: Array<CreativeFounder> = [];

    constructor(public name:string,
        public email: string,
        public state: ProjectState,
        public details: any,
        memberships: Membership[]) {

        for (let membership of memberships) {
            let founder: CreativeFounder = new CreativeFounder(membership.user.name,
                membership.user.email,
                membership.silver,
                membership.copper,
                membership.status);
            this.founders.push(founder);
        }
    }
}
