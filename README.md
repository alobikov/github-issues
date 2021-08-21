### Github Repository Issues Viewer

This is naive implementation without use of global store and without Router. The state is hold in root component and spread to childs via props.

REST API endpoints used in the application:
https://api.github.com/repos/:organization/:repository
https://api.github.com/repos/:organization/:repository/issues
https://api.github.com/repos/:organization/:repository/issues/:id
Response on '/issues' is paginated. Information about last page number is located in Link header.

Application doesn't authorize with github and so able only to retrive data from public repositories.
Bookmarked issue numbers are being saved in localStorage. Next time you open the same repository all made earlier bookmars are being restored.

Issues can be filtered by following creterias:

- open
- closed
- bookmarked

Issues can be in sorted asccending or descending order by:

- time of creation
- time of update
- amount of comments

Version 3 of GitHub API treats pool requests as issues. As result a response on request on '/issues' returns aggrigated list of pull_requests and issues. When presented on the screen in the table of issues a label (pr) or (issue) added to title of an item helps to distiguish what is which.

#### Todo

- add Redux
- add Router
- refactor architecture
- saturate with unit tests
