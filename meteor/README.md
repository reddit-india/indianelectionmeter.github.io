### How to get it running locally

1. Make sure you have [Meteor](https://www.meteor.com/install) installed.
2. Navigate to the `meteor` subdirectory and run `meteor`. A local server will be started (on port 3000 by default).
3. Populate the DB using `mongoimport`. By default meteor runs the DB on port 3001, you can check with `meteor mongo -U`. The command you need to load a JSON file into the DB is something like: `mongoimport -h 127.0.0.1:3001 --db meteor --file {filename here}`. The files you need are in the `jsons` folder.
4. You can view it on `http://localhost:3000/` in your browser.