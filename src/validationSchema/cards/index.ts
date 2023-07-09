import * as yup from 'yup';

export const cardValidationSchema = yup.object().shape({
  content_summary: yup.string().required(),
  note_id: yup.string().nullable(),
});
