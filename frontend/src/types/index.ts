export interface University {
  id: string;
  name: string;
  location: { city: string; state: string };
  type: string;
  established: number;
  accreditation: string[];
  courses: Course[];
  rankings: { nirf: number; state_rank: number };
  facilities: string[];
  contact: { phone: string; email: string; website: string };
  images: string[];
  virtual_tour_url: string;
  description: string;
  rating: number;
}

export interface Course {
  name: string;
  duration: string;
  fees: number;
  seats: number;
  eligibility: string;
  placement_stats: {
    avg_package: number;
    highest_package: number;
    placement_rate: number;
  };
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  eligibility: {
    min_marks: number;
    category: string[];
    income_limit: number;
    course_level: string;
  };
  amount: { type: string; value: number };
  deadline: string;
  apply_link: string;
  documents_required: string[];
  description: string;
  days_left?: number;
}

export interface Placement {
  id: string;
  university_name: string;
  year: number;
  company_name: string;
  role: string;
  package_lpa: number;
  students_hired: number;
  branch: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface DashboardStats {
  total_universities: number;
  total_courses: number;
  total_scholarships: number;
  total_placements: number;
  active_students: number;
}

export interface ComparisonMetrics {
  fees_comparison: Record<string, number>;
  placement_comparison: Record<string, number>;
  ranking_comparison: Record<string, number>;
  facilities_comparison: Record<string, number>;
}

export interface RecommendationResult {
  universities: Array<University & { match_score: number }>;
  courses: Array<{
    name: string;
    university: string;
    fees: number;
    duration: string;
    avg_package: number;
    placement_rate: number;
  }>;
  career_paths: Array<{
    course: string;
    skills: string[];
    roles: string[];
    salary_range: string;
  }>;
  confidence_score: number;
}
