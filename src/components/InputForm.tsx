import React from "react";
import { TextField, Button } from "@material-ui/core";
import { useFormControls } from "../utils/hooks";

interface InputFormProps {
  disabled: boolean;
  repositoryValid: boolean;
  onChange({ repo, org }: { repo: string; org: string }): void;
}

const inputFieldValues = [
  {
    name: "org",
    label: "Organization",
    id: "org",
  },
  {
    name: "repo",
    label: "Repository",
    id: "repo",
  },
];

export const InputForm: React.FC<InputFormProps> = ({
  onChange,
  repositoryValid,
  disabled,
}) => {
  const { values, handleInputValue, handleFormSubmit, formIsValid, errors } =
    useFormControls();

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onChange(values);
  };

  return (
    <>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="flex gap-4">
          {inputFieldValues.map((inputFieldValue, index) => {
            return (
              <TextField
                key={index}
                variant="outlined"
                size="small"
                onBlur={handleInputValue}
                onChange={handleInputValue}
                name={inputFieldValue.name}
                label={inputFieldValue.label}
                aria-label={inputFieldValue.label}
                autoComplete="none"
                {...(errors[inputFieldValue.name] && {
                  error: true,
                })}
              />
            );
          })}
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formIsValid() || disabled}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
      {repositoryValid ? (
        <h2 className="mb-3 mt-1">&nbsp;</h2>
      ) : (
        <h2 className="text-red-500 text-center mb-3 mt-1">
          Not valid Github repository!
        </h2>
      )}
    </>
  );
};
