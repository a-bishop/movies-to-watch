export interface IMovie {
  title: string;
  id?: string;
  avgRating?: string;
  year: string;
  genre?: string;
  director?: string;
  actors?: string;
  plot?: string;
  ratings?: { Value: string; Source: string }[];
  creator?: string;
  created: firebase.default.firestore.Timestamp | { seconds: number };
  poster?: string;
}
