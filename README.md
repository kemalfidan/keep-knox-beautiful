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

---

## TyepeScript? 🤔

### What Is It

TypeScript is a superset of JavaScript that adds static typing to the language and it compiles to plain old JavaScript. This means that if you already know how to write JavaScript, you already know how to write TypeScript! Simply rename your `.js` and `.jsx` files to `.ts` and `.tsx`, respectively.

### Why Use It

JavaScript is a notoriously difficult language to debug. It offers little to none compile-time checks, and it's up to the developer to find and fix errors encountered at runtime. This is where TypeScript's type system comes in - it will help you catch bugs early at compile time. I can't emphasize this enough - **TypeScript will save you significant time from manually debugging your code. If your TypeScript code compiles, you can be very certain that it will work as expected.**

There are several other reasons to choose TypeScript: it supports latest ECMAScript features while providing backward compatibility with older browsers, there is amazing IDE and tooling support for it, most of the widely used node packages provide their types so that you can use them with TypeScript, and its code is all [open-sourced](https://github.com/microsoft/TypeScript), backed by Microsoft!

The developer community loves TypeScript ♥️😍. Don't believe me? TypeScript was the [second most loved language in Stack Overflow's 2020 Developer Survey](https://insights.stackoverflow.com/survey/2020#technology-most-loved-dreaded-and-wanted-languages-loved), beating out Python, Java, JavaScript, etc. Two out of the three front-end framework titans - [Angular](https://github.com/angular/angular) and [Vue.js 3.0](https://github.com/vuejs/vue-next) - are primarily written in TypeScript (the [React](https://github.com/facebook/react) team also embraces types, but through [Flow](https://flow.org), which is a static type checker for JavaScript).

### So What's the Catch?

To fully utilize the power of TypeScript, you will have to learn its type system. It's not complicated and will remind you of Java. I would recommend [this](https://learnxinyminutes.com/docs/typescript/) as a resource for learning the type system, and [this](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet/blob/master/README.md#section-2-getting-started) as a cheat sheet for using TypeScript with React.

**This project also includes an [example](components/MyDummyComponent.tsx) of a strictly typed React functional component.**

**As an example of a production ready Next.js + TypeScript (+ MongoDB + Material-UI) app, refer to the DMS project [repository](https://github.com/GTBitsOfGood/dms).**

## Development

The following is auto-generated from `create-next-app`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
