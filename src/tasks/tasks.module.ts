import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  imports: [ConfigModule, TypeOrmModule.forFeature([Task]), AuthModule],
})
export class TasksModule {}
