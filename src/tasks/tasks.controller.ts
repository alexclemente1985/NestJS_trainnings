import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(
    private tasksService: TasksService,
    private configService: ConfigService
  ) {
    console.log(configService.get('TEST_VALUE'))
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasks(filterDto, user);
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
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string) {
  //     return this.tasksService.getTaskById(id);
  // }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating new task. Task: ${JSON.stringify(createTaskDto)}`)
    return this.tasksService.createTask(createTaskDto, user);
  }

  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto) {
  //     return this.tasksService.createTask(createTaskDto);
  // }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  // @Delete('/:id')
  // deleteTask(@Param('id') id: string): void {
  //     return this.tasksService.deleteTask(id);
  // }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User
  ) {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTask(id, status, user);
  }

  // @Patch('/:id/status')
  // updateTask(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto) {
  //     const {status} = updateTaskStatusDto;
  //     return this.tasksService.updateTask(id, status);
  // }
}
