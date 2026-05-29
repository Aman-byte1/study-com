export type UserRole = 'student' | 'parent' | 'tutor' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  avatar_url: string | null
  phone: string | null
  grade_level: number | null
  parent_id: string | null
  created_at: string
}

export interface Subject {
  id: string
  name: string
  grade_level: number | null
  description: string | null
  icon_url: string | null
}

export interface Course {
  id: string
  tutor_id: string
  subject_id: string
  title: string
  description: string | null
  grade_level: number | null
  created_at: string
  // Joined
  tutor?: Profile
  subject?: Subject
  enrollments?: Enrollment[]
  lessons?: Lesson[]
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  enrolled_at: string
  // Joined
  student?: Profile
  course?: Course
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  video_url: string | null
  order_index: number
  duration_minutes: number | null
  created_at: string
}

export interface LessonProgress {
  id: string
  student_id: string
  lesson_id: string
  completed: boolean
  watched_seconds: number
  completed_at: string | null
}

export interface Note {
  id: string
  course_id: string | null
  lesson_id: string | null
  uploaded_by: string
  title: string
  file_url: string
  file_type: string | null
  created_at: string
}

export interface Schedule {
  id: string
  student_id: string
  tutor_id: string
  course_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
  // Joined
  course?: Course
  tutor?: Profile
  student?: Profile
}

export interface Assignment {
  id: string
  course_id: string
  tutor_id: string
  title: string
  description: string | null
  due_date: string | null
  max_score: number
  created_at: string
  // Joined
  course?: Course
  submissions?: Submission[]
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  content: string | null
  file_url: string | null
  score: number | null
  feedback: string | null
  submitted_at: string
  graded_at: string | null
  // Joined
  student?: Profile
  assignment?: Assignment
}

export interface Quiz {
  id: string
  course_id: string
  tutor_id: string
  title: string
  description: string | null
  time_limit_minutes: number | null
  is_exam_prep: boolean
  created_at: string
  // Joined
  course?: Course
  questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: string
  options: string[] | null
  correct_answer: string
  points: number
  order_index: number
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  student_id: string
  answers: Record<string, string> | null
  score: number | null
  total_points: number | null
  started_at: string
  completed_at: string | null
  // Joined
  quiz?: Quiz
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  course_id: string | null
  content: string
  is_read: boolean
  created_at: string
  // Joined
  sender?: Profile
  receiver?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string | null
  type: string | null
  is_read: boolean
  link: string | null
  created_at: string
}

// Ethiopian National Exam subjects for Grade 9-12
export const ETHIOPIAN_SUBJECTS = [
  { name: 'Mathematics', icon: '📐' },
  { name: 'Physics', icon: '⚛️' },
  { name: 'Chemistry', icon: '🧪' },
  { name: 'Biology', icon: '🧬' },
  { name: 'English', icon: '📖' },
  { name: 'Amharic', icon: '🇪🇹' },
  { name: 'History', icon: '📜' },
  { name: 'Geography', icon: '🌍' },
  { name: 'Civics', icon: '⚖️' },
  { name: 'Economics', icon: '💹' },
  { name: 'Information Technology', icon: '💻' },
  { name: 'General Business', icon: '📊' },
] as const

export const GRADE_LEVELS = [9, 10, 11, 12] as const

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] as const
