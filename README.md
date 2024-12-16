# NBI Shopify Theme

Shopify Theme built using React and [adastra](https://github.com/odestry/adastra).

- nbi-staging Build, Push, & Publish Status [![nbi-staging Build, Push, & Publish Status](https://dev.azure.com/nbiinc/Git%20Developers/_apis/build/status%2FShopify%20Theme%20(Staging)?repoName=nbi-devops-yaml-templates&branchName=main&jobName=Build%2C%20deploy%2C%20and%20publish%20to%20NBI%20Staging)](https://dev.azure.com/nbiinc/Git%20Developers/_build/latest?definitionId=39&repoName=nbi-devops-yaml-templates&branchName=main)
- ipe-staging Build, Push, & Publish Status [![ipe-staging Build, Push, & Publish Status](https://dev.azure.com/nbiinc/Git%20Developers/_apis/build/status%2FShopify%20Theme%20(Staging)?repoName=nbi-devops-yaml-templates&branchName=main&jobName=Build%2C%20deploy%2C%20and%20publish%20to%20IPE%20Staging)](https://dev.azure.com/nbiinc/Git%20Developers/_build/latest?definitionId=39&repoName=nbi-devops-yaml-templates&branchName=main)
- nbi-sems Build & Push Status [![nbi-sems Build & Push Status](https://dev.azure.com/nbiinc/Git%20Developers/_apis/build/status%2FShopify%20Theme%20(Production)?repoName=nbi-devops-yaml-templates&branchName=main&jobName=Build%2C%20deploy%2C%20and%20publish%20to%20NBI%20Sems)](https://dev.azure.com/nbiinc/Git%20Developers/_build/latest?definitionId=40&repoName=nbi-devops-yaml-templates&branchName=main)
- ipe-sems Build & Push Status [![ipe-sems Build & Push Status](https://dev.azure.com/nbiinc/Git%20Developers/_apis/build/status%2FShopify%20Theme%20(Production)?repoName=nbi-devops-yaml-templates&branchName=main&jobName=Build%2C%20deploy%2C%20and%20publish%20to%20IPE%20Sems)](https://dev.azure.com/nbiinc/Git%20Developers/_build/latest?definitionId=40&repoName=nbi-devops-yaml-templates&branchName=main)

# Table of Contents
1. [Setup](#user-content-setup)
    1. [Requirements](#user-content-system-requirements)
    1. [Getting Started](#user-content-getting-started)
    1. [Making Your First Commit](#user-content-making-your-first-commit)
1. [Build & Deploy](#user-content-build--deploy)
1. [Useful Commands](#user-content-useful-commands)

## Setup

### System Requirements

Assuming VS Code in a Linux or Windows WSL environment:

- Node.js >= 16
  - Install [nvm](https://github.com/nvm-sh/nvm#install--update-script) then restart terminal
  - Run `nvm install --lts` to install latest version of Node.js
  - Run `sudo apt update && sudo apt upgrade` to update & upgrade all of the packages
  - Update npm with `npm install -g npm@latest`
- Shopify CLI >= 3.0
  - Install ruby with `sudo apt install ruby-full`
  - Validate it works with `ruby -v`
  - Install ruby dev with `sudo apt install ruby-dev`
  - Install Shopify CLI pre-requisites `sudo apt install curl gcc g++ make git`
  - Install the Shopify CLI and Theme packages with `npm install -g @shopify/cli @shopify/theme`
- Adastra CLI >= 0.4.0
  - Install Adastra CLI with `npm install -g adastra-cli`

### Getting Started

- Install all packages with `npm install`
- Adastra/Shopify CLI require Bundler, so run `sudo gem install bundler`
- Verify that Adastra/Shopify CLI can connect to the storefront by running `adastra dev --store=nbi-staging.myshopify.com`. This command should prompt you to open the Shopify login page.
- Once you are authenticated, VS Code should start a server and prompt you to Open in Browser.
- You should then see the storefront running in a local url similar to "http://127.0.0.1:9292/"

### Making Your First Commit

- [Configure WSL with Git for Windows](https://github.com/git-ecosystem/git-credential-manager/blob/release/docs/wsl.md#configuring-wsl-with-git-for-windows-recommended) involves installing Git for Windows and then setting GCM as the Git credential helper.
- Because NBI uses Azure DevOps, be sure to run the "If you intend to use Azure DevOps" extra command.
- Create a new branch: `git checkout -b {fl}-{purpose}` where "fl" is your first & last initial, "purpose" is the feature or reason for the branch.
- Make a code change of some kind.
- Commit the change: `git commit -m "📚 Provide improved Setup documentation"`.
- Push your branch upstream: `git push --set-upstream origin {branch}` where "branch" is the name of your branch.
- Congratulations, you are ready to [submit a pull request](https://dev.azure.com/nbiinc/Git%20Developers/_git/nbi-shopify-theme/pullrequestcreate)

## Build & Deploy

The Azure build pipeline configurations are located in the `nbi-devops-yaml-templates` repository.

- `/jobs/ShopifyThemeStaging.yml` holds the definition for building, pushing, and publishing the theme for nbi-staging and ipe-staging
- `/jobs/ShopifyThemeProduction.yml` holds the definition for building and pushing the theme to nbi-sems and ipe-sems

## Useful Commands

### `npm run dev`

Runs Vite dev server alongside Shopify CLI.

`npm run dev:nbi` will specifically target the `nbi-staging` storefront.
`npm run dev:ipe` will specifically target the `ipe-staging` storefront.

### `npm run lint`

Runs the es-lint package to validate syntax and higlight any errant coding mistakes
