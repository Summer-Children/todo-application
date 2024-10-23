import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsIn(['daily', 'weekly', 'spot'])
  @IsOptional()
  type?: 'daily' | 'weekly' | 'spot';

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsOptional()
  day?: string;

  @IsString()
  @IsOptional()
  time?: string;
}
