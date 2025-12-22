import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  imports: [TypeOrmModule.forFeature([Task])]
})
export class TasksModule {}
