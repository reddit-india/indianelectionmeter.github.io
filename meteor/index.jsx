Tasks = new Mongo.Collection("tasks");
States = new Mongo.Collection("states");
if (Meteor.isClient) {
  // This code is executed on the client only
 	Accounts.ui.config({
    	passwordSignupFields: "USERNAME_ONLY"
  	});

  	Meteor.subscribe("tasks", 50);
  	Meteor.subscribe("states");

  	Meteor.startup(function () {
    	// Use Meteor.startup to render the component after the page is ready
    	React.render(<App />, document.getElementById("render-target"));
  	});
}

if (Meteor.isServer) {
  Meteor.publish("tasks", function () {
    return Tasks.find({});
  });
  Meteor.publish("states", function () {
    return States.find({});
  });
}

Meteor.methods({
	addTask(state_id, title, description, category, source){
		if(!Meteor.user()){
			throw new Meteor.Error("not-authorized");
		}
		const state = States.findOne(state_id)
		if(!_.contains(state.moderators, Meteor.userId())){
			throw new Meteor.Error("not-authorized");
		}

		Tasks.insert({
			title: title,
			description: description,
			category: category,
			source: source,
			state_id: state_id,
			no: Tasks.find({state_id: state_id}).count()+1,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		})
	},
	removeTask(taskId){
		if(!Meteor.user()){
			throw new Meteor.Error("not-authorized");
		}
		const task = Tasks.findOne(taskId);
		if(!task){
			throw new Meteor.Error("task-not-found"); 
		}
		const state = States.findOne(task.state_id)
		if(!_.contains(state.moderators, Meteor.userId())){
			throw new Meteor.Error("not-authorized");
		}
		Tasks.remove(taskId);
	},
	updateTask(taskId, title, description, category, source){
		if(!Meteor.user()){
			throw new Meteor.Error("not-authorized");
		}
		const task = Tasks.findOne(taskId);
		if(!task){
			throw new Meteor.Error("task-not-found"); 
		}
		const state = States.findOne(task.state_id)
		if(!_.contains(state.moderators, Meteor.userId())){
			throw new Meteor.Error("not-authorized");
		}
		Tasks.update(taskId, {$set: {title: title, description: description, category: category,source: source}});
	},
	setPrivate(taskId, setToPrivate){
		const task = Tasks.findOne(taskId);

		if(Meteor.user() && task.owner != Meteor.userId()){
			throw new Meteor.Error("not-authorized");
		}

		Tasks.update(taskId, {$set: {private: setToPrivate}});

	}
})