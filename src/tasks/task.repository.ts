import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { UpdateResult } from 'typeorm/browser';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

import { Logger } from '@nestjs/common';

//@EntityRepository(Task)
@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.save(task);

    return task;
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    return await this.delete({ id: id });
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<UpdateResult> {
    return await this.update({id: id, user: user}, { status: status});
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({user: user});

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try{
        const tasks = await query.getMany();
        return tasks;
    }
    catch (e){
        this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,e.stack)
        throw new InternalServerErrorException();
    }

  }
}
