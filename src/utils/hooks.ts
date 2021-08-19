import { useState } from "react";

const initialFormValues = {
  org: "",
  repo: "",
};

export const useFormControls = () => {
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({} as any);

  const validate: any = (fieldValues = values) => {
    let temp: any = { ...errors };

    if ("org" in fieldValues)
      temp.org = fieldValues.org ? "" : "This field is required.";

    if ("repo" in fieldValues)
      temp.repo = fieldValues.repo ? "" : "This field is required.";

    setErrors({
      ...temp,
    });
  };

  const handleInputValue = (e: any) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    validate({ [name]: value });
  };

  const formIsValid = (fieldValues = values) => {
    const isValid =
      fieldValues.org &&
      fieldValues.repo &&
      Object.values(errors).every((x) => x === "");

    return isValid;
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    const isValid =
      Object.values(errors).every((x) => x === "") && formIsValid();
    if (isValid) {
      console.log(values);
    }
  };

  return {
    values,
    errors,
    handleInputValue,
    handleFormSubmit,
    formIsValid,
  };
};
