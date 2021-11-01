import { object, string, number, date, boolean, mixed, array } from 'yup'
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg']

export const validateImageType = (value: any) => {
  if (value) {
    let type = value.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
    return SUPPORTED_FORMATS.includes(type)
  }
}
/** Validation schema for the register user form used for Formik library */

export const validationSchema = object().shape({
  name: string().required('Please type in your name.'),
  email: string()
    .trim()
    .email()
    .required('Please type in your university e-mail.'),
  is_student: boolean().required(),
  is_professor: boolean().required(),
  password: string()
    .required('Please type in a password.')
    .min(6, 'Must be at least 6 characters.'),
  field_of_studies_id: number()
    .typeError('Please select your field of studies.')
    .required('Please select your field of studies.'),
  institute_id: number()
    .typeError('Please select your institute.')
    .required('Please select your institute.'),
  entry_semester: date()
    .nullable()
    // @ts-ignore
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
    .when('is_student', {
      is: true,
      then: date()
        .typeError('Please pick an entry date.')
        .required('Please pick an entry date.')
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
        .required('Please pick an approximated exit date.')
        .nullable()
        // @ts-ignore
        .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
    }),
  user_image: mixed().nullable().notRequired(),
})
