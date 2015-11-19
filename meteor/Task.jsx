Task = React.createClass({
	propTypes: {
		task: React.PropTypes.object.isRequired,
		showPrivateButton: React.PropTypes.bool.isRequired
	},
	deleteThisTask(){
		Meteor.call("removeTask", this.props.task._id);
	},
	
	render(){
		return (
			<tr >
				<td>{this.props.task.no}</td>
				<td>
				<span className="textPointer" onClick={this.props.showModal.bind(null, this.props.task)}>
					 {this.props.task.title}
					 <br/>
					 <small>{this.props.task.category}</small>
				</span>
				{  this.props.currentUser && this.props.canEdit()  ?
					<button type="button" className="close" onClick={this.deleteThisTask} aria-label="Close"><span aria-hidden="true">&times;</span></button> : ""

				}
				</td>
			</tr>
		);
	}
})