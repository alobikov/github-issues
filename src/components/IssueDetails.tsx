import React from "react";
import ReactMarkdown from "react-markdown";
import { IssueDataFromServer } from "../types/issue";

interface IssueDetailsProps {
  issue: IssueDataFromServer;
}

export const IssueDetails = ({ issue }: IssueDetailsProps) => {
  return (
    <div className="p-4">
      <div>{`Issue Number: ${issue.number}`}</div>
      <div>{`Author: ${issue.user.login}`}</div>
      <div>{`Title: ${issue.title}`}</div>
      <div>{`Status: ${issue.state}`}</div>
      <ReactMarkdown>{issue.body}</ReactMarkdown>
    </div>
  );
};
