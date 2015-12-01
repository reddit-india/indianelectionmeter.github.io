Task = React.createClass({
	propTypes: {
		task: React.PropTypes.object.isRequired,
		showPrivateButton: React.PropTypes.bool.isRequired
	},
	deleteThisTask(){
		alert("Create an issue to delete a promise")
		//Meteor.call("removeTask", this.props.task._id);
	},
	taskStatus(){
		if (this.props.task.completed) {
			return "completed";
		}
		else if (this.props.task.started) {
			return "started";
		}
		else {
			return "not-started";
		}
	},
	
	render(){
		return (
			<tr className={this.taskStatus()}>
				<td>{this.props.task.no}</td>
				<td>
				<a href={"/promise/"+this.props.task.state_id+"/"+this.props.task._id}>

					 {this.props.task.title}
					 <br/>
					 <small>{this.props.task.category}</small>

				</a>
				{  this.props.currentUser && this.props.canEdit()  ?
					<button type="button" className="close" onClick={this.deleteThisTask} aria-label="Close"><span aria-hidden="true">&times;</span></button> : ""

				}
				</td>
			</tr>
		);
	}
})