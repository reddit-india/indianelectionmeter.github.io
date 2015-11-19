## Indian Election Meter

Website dedicated to track promises made in Indian Elections, 
as suggested [here](https://www.reddit.com/r/india/comments/3sv4zi/we_need_a_website_for_tracking_the_promises_made/).

-------------

### Contributing

We need programmers, designers and content writers. We are currently organising through [Slack](https://indianpromisetracker.slack.com/), request an invite [here](https://iptuserbot.herokuapp.com/) and join the effort!

We aim to discuss things on github's [issues](https://github.com/reddit-india/indianelectionmeter.github.io/issues), feel free to join the discussion!

Currently a basic static site is operational at [indianelectionmeter.in](http://indianelectionmeter.in). Dynamic version coming soon.

### Progress
#### Done
* Website is online [here](http://indianelectionmeter.in).
* Code powering the site is available in meteor directory
* Json data needed to start working is available in jsons directory, you can import it in mongodb database using mongoimport
* All modifications on website are currently limited to moderators, you can create an issue to become moderator of particular state

#### In progress 
* Tracking promises of Goverment of India

### FAQ

**Programmmer**

Q: What technologies are using?

A: Front-end - react. Template for content generators - meteor 

Q: I saw indiantracker.in, why are we not using it? 

A: We can't because The person who made it using his own framework. He does not have the appropriate documentation for it and so it might be a problem at a later stage. 

**Content Writer**

Q: I’m not a coder, what can I do to help now? 
A: You can pick one of the [promises](https://docs.google.com/spreadsheets/d/1uJHLsrWgvPG-3ARHQJMoCrxnbACFq6B0Klz8SPHREuk/) we have listed or promise you find yourself and start tracking it by creating a github issue.
