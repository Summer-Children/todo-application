export interface Todo {
  _id?: string;
  title: string;
  type: 'weekly' | 'daily' | 'spot';
  date?: Date| null; 
  day?: string| null;
  time: string;
}
