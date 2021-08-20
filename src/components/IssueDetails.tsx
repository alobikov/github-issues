import React from "react";
import ReactMarkdown from "react-markdown";
import { IssueDataFromServer } from "../types/issue";
import { Button } from "@material-ui/core";

interface IssueDetailsProps {
  issue: IssueDataFromServer;
  onClose(): void;
}

export const IssueDetails = ({ issue, onClose }: IssueDetailsProps) => {
  return (
    <div className="p-4 text-xs">
      <div>
        <b className="mr-2">Issue Number:</b>
        <span>{issue.number}</span>
      </div>
      <div>
        <b className="mr-2">Author:</b>
        <span>{issue.user.login}</span>
      </div>
      <div>
        <b className="mr-2">Title:</b>
        <span>{issue.title}</span>
      </div>
      <div>
        <b className="mr-2">Status:</b>
        <span>{issue.state}</span>
      </div>
      <div>
        <b className="mr-2">Amount of comments:</b>
        <span>{issue.comments}</span>
      </div>
      <hr className="my-2" />
      <ReactMarkdown>{issue.body}</ReactMarkdown>
      <div className="mt-4">
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </div>
    </div>
  );
};
