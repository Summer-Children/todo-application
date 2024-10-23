export interface Todo {
  id?: string;
  title: string;
  type: 'weekly' | 'daily' | 'spot';
  date?: Date| null; 
  day?: string| null;
  time: string;
}
