import * as actions from "../actions";

describe("SAGA WATCHED ACTIONS", () => {
  it("should create an action with correct type", () => {
    const expectedAction = {
      type: "LOAD_ISSUES",
    };
    expect(actions.loadIssues()).toEqual(expectedAction);
  });

  it("should create an action with correct type", () => {
    const expectedAction = {
      type: "LOAD_REPOS",
    };
    expect(actions.loadRepos()).toEqual(expectedAction);
  });

  it("should create an action with correct type", () => {
    const expectedAction = {
      type: "LOAD_ISSUES_BY_IDS",
    };
    expect(actions.loadIssuesByIds()).toEqual(expectedAction);
  });
});
