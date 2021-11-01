import { object, string, number, date, boolean, mixed, array, ref } from 'yup'

/** Validation schema for the register user form used for Formik library */

const FILE_SIZE = 3000000
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg']

export const validateImageType = (value: any) => {
  if (value) {
    let type = value.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
    return SUPPORTED_FORMATS.includes(type)
  }
}

export const validationSchema = object().shape({
  name: string().notRequired(),
  email: string().trim().email().notRequired(),
  password: string()
    .notRequired()
    .min(6, 'Must be at least 6 characters.')
    .oneOf([ref('password_repeat'), null], 'Passwords must match')
    .min(6, 'Must be at least 6 characters.'),
  password_repeat: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .min(6, 'Must be at least 6 characters.'),
  field_of_studies_id: number().notRequired(),
  institute_id: number().notRequired(),
  entry_semester: date()
    .nullable()
    // @ts-ignore
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
    .when('is_student', {
      is: true,
      then: date()
        .typeError('Please pick an entry date.')
        .nullable()
        // @ts-ignore
        .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
    }),
  courses_ids_professor: array().notRequired(),
  courses_ids_student: array().notRequired(),
  approximated_exit_date: date()
    .nullable()
    // @ts-ignore
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
    .when('is_student', {
      is: true,
      then: date()
        .typeError('Please pick an approximated exit date.')
        .nullable()
        // @ts-ignore
        .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
    }),
  user_image: mixed().nullable().notRequired(),
})
