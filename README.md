# fb project hub

A [Sails v1](https://sailsjs.com) application for internal Firebelly project timelines.

To get project up and running:

- `npm install`

For local development:

- `sails lift` (if you have redis set up, running `sails lift --redis` is nice as it keeps you logged in if you kill the app and rerun it to pick up code changes)

To deploy:

- Commit changes to master branch
- `fab prepare` will run a crazy deploy script that compiles assets and shoves them into a `deploy` branch
- `fab deploy` will run `git fetch --all && git checkout --force origin/deploy` on the production folder on WebFaction, then restart the node app
