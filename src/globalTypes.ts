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
  avatar_num: string
  google_last_updated: string
  id: number
}

export type SavedUserData = {
  email: string
  role?: Role
}

export interface UserWithRole extends User {
  is_professor: boolean
  is_student: boolean
  is_university_administrator: boolean
  name: string
}

export type Institute = {
  name: string
}

export type FieldOfStudies = {
  name: string
}

export type Student = {
  id: number
  field_of_studies?: FieldOfStudies
  institute?: Institute
  entry_semester?: string
  user: UserWithRole
}

export type Professor = {
  id: number
  field_of_studies?: FieldOfStudies
  institute?: Institute
  user: UserWithRole
  area_of_expertise?: string
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
