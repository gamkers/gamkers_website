export interface Course {
    id: string;
    title: string;
    description: string;
    image: string;
    prelaunchPrice: number;
    originalPrice: number;
    enrollLink: string;
  }
  
  export type CourseProps = Omit<Course, 'id'>;