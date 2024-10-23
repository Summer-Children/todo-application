import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: 'weekly' | 'daily' | 'spot';

  @Prop({ required: false })
  date?: Date;

  @Prop({ required: false })
  day?: string;

  @Prop({ required: true })
  time: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
