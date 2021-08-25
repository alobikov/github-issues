import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import { useFormControls } from "../utils/hooks";
import { apiCallBegan } from "../store/middleware/api";
import { setRepository, setRepositoryValid } from "../store/repository";
import { RootState } from "../store/configureStore";
import { loadRepos } from "../store/sagas/actions";

interface InputFormProps {
  disabled: boolean;
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

export const InputForm: React.FC<InputFormProps> = ({ disabled }) => {
  const dispatch = useDispatch();
  const repositoryValid = useSelector(
    (state: RootState) => state.repository.repositoryValid
  );

  const { values, handleInputValue, formIsValid, errors } = useFormControls();

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    dispatch(loadRepos(`${values.org}/${values.repo}`));
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
