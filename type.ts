export interface DiaryType {
  attachmentUrl: string;
  attachmentId: string;
  date: string;
  title: string;
  weather: string;
  mood: string;
  content: string;
  movies: Array<any>;
  musics: Array<any>;
  tags: Array<string>;
}
