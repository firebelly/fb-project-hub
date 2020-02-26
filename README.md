# fb project hub

A [Sails v1](https://sailsjs.com) application for internal Firebelly project timelines.

## To get project up and running:

- `npm install`
- set up a mysql database, and update `config/datastores.js` (currently defaults to `root:root` and `fb_project_hub_staging` as db name)

## For local development:

- `sails lift` (if you have redis set up, running `sails lift --redis` is nice as it keeps you logged in if you kill the app and rerun it to pick up code changes)

Functionality is split among:

- models that define data structure (e.g. Projects is at `api/models/Project.js`)
- routes.js defines URLs to send requests to actions
- controllers/actions that populate views (e.g. homepage that lists all projects is `api/controllers/project/view-all-projects.js`)
- views/pages using parasails which is a thin wrapper of Vue (e.g. `assets/js/pages/project/all-projects.page.js`)

## To deploy:

- Commit changes to master branch
- `fab prepare` will run a crazy deploy script that compiles assets and shoves them into a `deploy` branch
- `fab deploy` will run `git fetch --all && git checkout --force origin/deploy` on the production folder on WebFaction, then restart the node app

## Note:

- Fonts omitted from repo need to be manually copied to local assets/fonts/ folder before prepare/deploy
