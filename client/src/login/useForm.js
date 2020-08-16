import { useState, useCallback, useEffect } from 'react';

export default function useForm({
  defaultValues,
  validate = () => ({}),
  onSubmit = () => {},
}) {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmiting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Memoize callbacks
  validate = useCallback(validate, []);
  onSubmit = useCallback(onSubmit, []);

  const handleChange = useCallback(({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value
    });
  }, [values]);

  const handleBlur = useCallback(({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value.trim()
    });
  }, [values]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    const errors = validate(values);
    const hasError = Object.keys(errors).some((key, i) => values.hasOwnProperty(key));

    if (hasError) {
      setErrors(errors);
    } else {

      await onSubmit(values);

      setIsSubmiting(false);
    }

    setIsDirty(true);
  }, [values, validate, onSubmit]);

  useEffect(() => {
    if (isDirty) {
      setErrors(validate(values));
    }
  }, [isDirty, values, validate]);

  return {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isSubmitting
  };
}
