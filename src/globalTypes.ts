/**
 * Global types and interfaces used across app
 */

export enum Receiver {
  PROFESSOR = 'professor',
  STUDENT = 'student',
}

export enum Role {
  PROFESSOR = 'professor',
  STUDENT = 'student',
}

export type LoginData = {
  email: string
  password: string
}

export type User = {
  email: string
  password: string
  avatar_num?: string | number
  user_image?: string
  google_last_updated?: string
  id?: number
  name: string
  is_professor: boolean
  is_student: boolean
  professor?: Professor
  student?: Student
}

export type SavedUserData = {
  email: string
  role?: Role
}

export interface UserWithRole extends User {
  is_professor: boolean
  is_student: boolean
  name: string
}

export type Institute = {
  name: string
  id?: string | number
}

export type FieldOfStudies = {
  name: string
  id?: string | number
}

export type Course = {
  name: string
  id?: string | number
  professor?: Professor
}

export type Student = {
  id?: number
  field_of_studies?: FieldOfStudies
  institute?: Institute
  entry_semester?: string
  approx_exit_date?: string
  user?: UserWithRole
}

export type Professor = {
  id?: number
  field_of_studies?: FieldOfStudies
  institute?: Institute
  user?: UserWithRole
}

export type StudentPostData = {
  field_of_studies_id: number
  institute_id: number
  entry_semester: string
}

export type ProfessorPostData = {
  field_of_studies_id: number
  institute_id: number
}

export type Message = {
  text: string
  timestamp: string
  is_seen: boolean
  id: number
  avatar_num: string
  number_unread_messages: number
}

export type GoogleContact = {
  contact_owner: string
  owned_contact: string
}

export type CountPerTime = {
  time: 'string'
  count: number
}

export type BarChartStats = {
  messages_sent_7_days: CountPerTime[]
  messages_received_7_days: CountPerTime[]
  messages_sent_6_months: CountPerTime[]
  messages_received_6_months: CountPerTime[]
}

export type PieChartStats = {
  seven_days_sent_student_total: number
  seven_days_sent_professor_total: number
  seven_days_received_student_total: number
  seven_days_received_professor_total: number
  six_months_sent_student_total: number
  six_months_sent_professor_total: number
  six_months_received_student_total: number
  six_months_received_professor_total: number
}

export type RegisterData = {
  user: User
  professor?: Professor
  student?: Student
  courses: number[]
}

export type UploadImageData = {
  email: string
  user_image: {
    cancelled: boolean
    height: number
    width: number
    type: string
    uri: string
  }
}
