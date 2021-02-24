# keep-knox-beautiful


## Base Dependencies

1. node v12+ (recommend getting nvm to manage versions)
2. yarn (package manager - similar to npm)


## Run the Site

1. Clone the repo.
2. Run `yarn` or `yarn install` to update dependencies.
2. Run `yarn run secrets` to setup development environment variables.
    - You will be prompted for a password. Ask me or Selena to send it to you.
    - Windows users need to run `yarn run secrets:login` and `yarn run secrets:sync` instead.
3. Run `yarn dev` for development mode with hot-code reloading, error reporting, and more.
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: Running `yarn build` then `yarn start` will start the application in production mode.


## Code/PR Workflow

- Create a new branch in the format `[USERNAME]/[JIRA-ISSUE-NUMBER]-[SHORT_DESCRIPTION]` by running `git checkout -b [BRANCH NAME]`
    - Example branch name: `KFidan1/KKB-12-init-project`
    - This way the issues are updated and closed on Jira when we merge the PR with that branch name
- Be sure to lint, format, and type-check your code occasionally to catch errors by running `yarn lint`.
- Commit changes.
- Then push your branch by running `git push -u origin [BRANCH NAME]`. This pushes your branch to remote.
- Create a pull request (PR) on GitHub to merge your branch into `develop`. `main` will serve as production.
- In your PR, briefly describe the changes, then tag me (KFidan1) and Selena (selxue) to the PR. Others are welcome to comment and give feedback as well.
- Rebase your branch on top of the `develop` branch.

## Project Structure

- `components/`: Contains almost all of our front-end code. This is where we put our React components.
- `pages/`: Contains files that are associated with a route based on its file name, see Next.js' [docs](https://nextjs.org/docs/basic-features/pages).
- `public/`: Stores static files like images, see Next.js' [docs](https://nextjs.org/docs/basic-features/static-file-serving).
- `requests/`: Contains several files, one for each entity/model in our application. We define code for fetching data on the client-side here.
- `server/`: Contains almost all of our back-end code. This is where we put our Mongoose models and business logic.
- `utils/`: For code used across root directories.

