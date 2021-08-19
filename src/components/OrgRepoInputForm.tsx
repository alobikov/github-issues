import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

interface OrgRepoInputFormProps {
  disabled: boolean;
  onChange({ repo, org }: { repo: string; org: string }): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingBottom: theme.spacing(2),
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "25ch",
    },
  })
);

export const OrgRepoInputForm = ({
  onChange,
  disabled,
}: OrgRepoInputFormProps) => {
  const classes = useStyles();
  const [input, setInput] = React.useState({ repo: "", org: "" });

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log("submit");
    onChange(input);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [event.target.id]: event.target.value });
  };

  return (
    <>
      <div className={classes.root}>
        <form
          onSubmit={handleSubmit}
          className=""
          noValidate
          autoComplete="off"
        >
          <TextField
            id="org"
            label="Organization"
            variant="outlined"
            size="small"
            className={classes.textField}
            onChange={handleChange}
            value={input.org}
          />
          <TextField
            id="repo"
            label="Repository"
            variant="outlined"
            size="small"
            className={classes.textField}
            onChange={handleChange}
            value={input.repo}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={disabled}
          >
            Submit
          </Button>
        </form>
      </div>
      {/* <div className="text-red-500 text-sm text-center">
        Both repository and organization names needed!
      </div> */}
    </>
  );
};
