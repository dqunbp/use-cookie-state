# Contribution guide

## Developing use-cookie-state

You consider contributing changes to use-cookie-state – thank you!
Please consider these guidelines when filing a pull request:

- Commits follow the [Angular commit convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
- 2 spaces indentation

## How to make changes

1.  Clone the repository

        $ git clone https://github.com/dqunbp/use-cookie-state.git

2.  Install the dependencies

         $ cd use-cookie-state
         $ npm install

3.  Make your changes

4. To run the tests use

        $ npm run test

5.  Add changes to tracked git files

         $ git add .

6.  Run [commitizen](http://commitizen.github.io/cz-cli/)

         $ npm run commit

    and follow the command prompt.
    To provide multiline long description use `\n`, for example:

    `- add repo link to the docs\n- update example\n - etc.`

## Creating releases

use-cookie-state uses [semantic-release](https://github.com/semantic-release/semantic-release)
to release new versions automatically.

- Commits of type `fix` will trigger bugfix releases, think `0.0.1`
- Commits of type `feat` will trigger feature releases, think `0.1.0`
- Commits with `BREAKING CHANGE` in body or footer will trigger breaking releases, think `1.0.0`

All other commit types will trigger no new release.
