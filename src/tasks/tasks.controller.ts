import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import * as taskModel from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto) {
        if(Object.keys(filterDto).length){
            //return this.tasksService.getTasksWithFilters(filterDto);
        }
        else{
            return this.tasksService.getTasks(filterDto);
        }
    }

    // @Get()
    // getTasks(@Query() filterDto: GetTasksFilterDto) {
    //     if(Object.keys(filterDto).length){
    //         return this.tasksService.getTasksWithFilters(filterDto);
    //     }
    //     else{
    //         return this.tasksService.getAllTasks();
    //     }
    // }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    // @Get('/:id')
    // getTaskById(@Param('id') id: string) {
    //     return this.tasksService.getTaskById(id);
    // }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    // @Post()
    // createTask(@Body() createTaskDto: CreateTaskDto) {
    //     return this.tasksService.createTask(createTaskDto);
    // }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): Promise<void> {
        return this.tasksService.deleteTask(id);
    }

    // @Delete('/:id')
    // deleteTask(@Param('id') id: string): void {
    //     return this.tasksService.deleteTask(id);
    // }

    @Patch('/:id/status')
    updateTask(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto) {
        const {status} = updateTaskStatusDto;
        return this.tasksService.updateTask(id, status);
    }

    // @Patch('/:id/status')
    // updateTask(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto) {
    //     const {status} = updateTaskStatusDto;
    //     return this.tasksService.updateTask(id, status);
    // }
}
