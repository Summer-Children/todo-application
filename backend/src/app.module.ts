import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todos/todo.module';

@Module({
  imports: [
    // Connect to local MongoDB "todo-db", which is the databse name
    MongooseModule.forRoot('mongodb://localhost/todo-db'),
    TodoModule,
  ],
})
export class AppModule {}
