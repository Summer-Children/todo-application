import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsIn(['daily', 'weekly', 'spot'])
  type: 'daily' | 'weekly' | 'spot';

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsOptional()
  day?: string;

  @IsString()
  @IsNotEmpty()
  time: string;
}
