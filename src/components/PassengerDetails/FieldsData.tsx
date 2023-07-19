import * as Yup from 'yup';

export const fieldsWithCode = [
  {
    Code: 'EXT-ADOB',
    fieldName: 'Date Of Birth',
    name: 'Dob',
    validation: Yup.string().required('This field is required'),
  },
  {
    Code: 'CHLD',
    fieldName: 'Date Of Birth',
    name: 'Dob',
    validation: Yup.string().required('This field is required'),
  },
  {
    Code: 'CTCE',
    fieldName: 'Email',
    name: 'Email',
    validation: Yup.string()
      .email('Must be valid email')
      .required('This field is required'),
  },
  {
    Code: 'CTCH',
    fieldName: 'Home Contact',
    name: 'Homecontact',
    validation: Yup.string().required('This field is required'),
  },
  {
    Code: 'CTCM',
    fieldName: 'Mobile Number',
    name: 'Mobile',
    validation: Yup.string().required('This field is required'),
  },
  {
    Code: 'DOCS',
    fieldName: 'Travel Document',
    name: 'Traveldocument',
    validation: Yup.string().required('This field is required'),
  },
];

export const fieldsWithName = [
  {
    fieldName: 'First Name',
    name: 'Firstname',
    validation: Yup.string().required('This field is required'),
  },
  {
    fieldName: 'Middle Name',
    name: 'Middlename',
  },
  {
    fieldName: 'Surname',
    name: 'Surname',
    validation: Yup.string().required('This field is required'),
  },
  {
    fieldName: 'Civility Code',
    name: 'CivilityCode',
    validation: Yup.string().required('This field is required'),
  },
];
