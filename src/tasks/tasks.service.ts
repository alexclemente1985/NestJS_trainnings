/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    // @InjectRepository(Task)
    // private taskRepository: Repository<Task>//TaskRepository
    private taskRepository: TaskRepository,
  ) {}
  //private tasks: Task[] = [];

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  // public getAllTasks(): Task[]{
  //     return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
  //     const {status, search} = filterDto;

  //     let tasks = this.getAllTasks();

  //     if(status){
  //         tasks = tasks.filter((task)=> task.status === status);
  //     }
  //     if(search){
  //         tasks = tasks.filter((task) => {
  //             if(task.title.includes(search) || task.description.includes(search)){
  //                 return true;
  //             }
  //             return false;
  //         })

  //         if(tasks.length == 0){
  //             throw new NotFoundException(`No tasks were found with this search parameter`)
  //         }
  //     }
  //     return tasks;
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  // createTask(createTaskDto: CreateTaskDto): Task{
  //     const {title, description} = createTaskDto;
  //     const task: Task = {
  //         id: uuid(),
  //         title,
  //         description,
  //         status: TaskStatus.OPEN
  //     }

  //     this.tasks.push(task);

  //     return task;
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id: id } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  // getTaskById(id: string): Task{
  //     const result = this.tasks.find((task)=> task.id === id);
  //     if(!result){
  //         throw new NotFoundException(`Task with ID "${id}" not found`);
  //     }
  //     return result;
  // }

  async deleteTask(id: string) {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found to delete`);
    }
  }

  // deleteTask(id: string){
  //     const originalTasks = this.tasks;
  //     this.tasks = this.tasks.filter(task => task.id !== id);

  //     if(originalTasks.length == this.tasks.length){
  //         throw new NotFoundException(`Task with ID "${id}" not found to delete`);
  //     }

  // }

  async updateTask(id: string, status: TaskStatus): Promise<void> {
    const result = await this.taskRepository.updateTask(id, status);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    console.log(result);
  }

  // updateTask(id: string, status: TaskStatus): Task{
  //     let task = this.getTaskById(id);

  //     if(task){
  //         task.status = status;
  //         return task;
  //     }
  //     return {} as Task;
  // }
}
