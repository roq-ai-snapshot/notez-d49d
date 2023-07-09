import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCardById, updateCardById } from 'apiSdk/cards';
import { Error } from 'components/error';
import { cardValidationSchema } from 'validationSchema/cards';
import { CardInterface } from 'interfaces/card';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { NoteInterface } from 'interfaces/note';
import { getNotes } from 'apiSdk/notes';

function CardEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CardInterface>(
    () => (id ? `/cards/${id}` : null),
    () => getCardById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CardInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCardById(id, values);
      mutate(updated);
      resetForm();
      router.push('/cards');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CardInterface>({
    initialValues: data,
    validationSchema: cardValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Card
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="content_summary" mb="4" isInvalid={!!formik.errors?.content_summary}>
              <FormLabel>Content Summary</FormLabel>
              <Input
                type="text"
                name="content_summary"
                value={formik.values?.content_summary}
                onChange={formik.handleChange}
              />
              {formik.errors.content_summary && <FormErrorMessage>{formik.errors?.content_summary}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<NoteInterface>
              formik={formik}
              name={'note_id'}
              label={'Select Note'}
              placeholder={'Select Note'}
              fetcher={getNotes}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.content}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'card',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CardEditPage);
