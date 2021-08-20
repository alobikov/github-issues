import React from "react";
import { Chip } from "@material-ui/core";

interface TypeLabelProps {
  type: {} | undefined;
}

export const TypeLabel: React.FC<TypeLabelProps> = ({ type }) => {
  return (
    <Chip
      size="small"
      label={type ? "pr" : "issue"}
      color="primary"
      variant="outlined"
      className="mr-2"
    />
  );
};
