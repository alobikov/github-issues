import reducer, * as actions from "../issues";

describe("ISSUES REDUCER", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({ list: [], loading: false });
  });

  it("should handle issuesRequested action", () => {
    expect(reducer({}, actions.issuesRequested())).toEqual({ loading: true });
  });

  it("should handle stopLoading action", () => {
    expect(reducer({ list: [], loading: true }, actions.stopLoading())).toEqual(
      {
        list: [],
        loading: false,
      }
    );
  });

  it('should handle "NEWS_RECEIVED" action', () => {
    const mockData = [
      {
        author: "Analysis by Stephen Collinson, CNN",
        title: "Mueller starts tzzle in most signimove yet",
        description: "Silent for so long",
      },
    ];
    expect(reducer({}, actions.issuesReceived(mockData))).toEqual({
      list: [mockData[0]],
      loading: false,
    });
  });
});
