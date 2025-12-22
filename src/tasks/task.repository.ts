import { DataSource, DeleteResult, Entity, EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { UpdateResult } from "typeorm/browser";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

//@EntityRepository(Task)
@Injectable()
export class TaskRepository extends Repository<Task>{
    constructor(private dataSource: DataSource){
        super(Task,dataSource.createEntityManager())
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
        const {title, description} = createTaskDto;

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN
        });

        await this.save(task);

        return task;
    }

    async deleteTask(id: string): Promise<DeleteResult>{
        return await this.delete({id: id});
    }

    async updateTask(id: string, status: TaskStatus): Promise<UpdateResult>{
        return await this.update(id, {status: status});
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        const query = this.createQueryBuilder('task');
        const tasks = await query.getMany();
        return tasks;
        return this.find({where: {status: filterDto.status, description: filterDto.search, title: filterDto.search}});
    }
}