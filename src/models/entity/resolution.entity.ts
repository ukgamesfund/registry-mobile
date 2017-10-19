import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import {Project} from "./project.entity";
import {Vote} from "./vote.entity";

//@Entity()
export class Resolution {
	constructor() {
	}

	//@PrimaryGeneratedColumn()
	id: number;

	//@ManyToOne(type => Project, project => project.resolutions, {cascadeInsert: false,cascadeUpdate: false,lazy: false})
	//@JoinColumn({name: "project"})
	project: Project;

	//@OneToMany(type => Vote, vote => vote.resolution, {cascadeInsert: false,cascadeUpdate: false,lazy: false})
	votes: Vote[];

	//@Column('json', {name: 'details', nullable: true})
	details: any;

	//@CreateDateColumn({nullable: true})
	created: Date;

	//@UpdateDateColumn({nullable: true})
	updated: Date;
}