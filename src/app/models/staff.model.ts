export type Department =
  | 'Engineering'
  | 'Informatics'
  | 'Business'
  | 'Design'
  | 'Student services';

export interface StaffMember {
  id: number;
  name: string;
  department: Department;
  role: string;
  bio: string;
  quote: string;
  photo: string;
  featured: boolean;
}