App = React.createClass({
	mixins: [ReactMeteorData],
	getInitialState(){
		return {
			hideCompleted: false,
			keyword: "",
			page: 1,
			noPerPage: 30,
			state_id: "564be68b5c71441ac65557a5" //govt of india is the first state
		}
	},
	getMeteorData(){
		var regex = new RegExp(this.state.keyword, 'i');
		return {
			states: States.find({}, {sort: {no: 1}}).fetch(),
			currentState: States.findOne({_id: this.state.state_id}),
			tasks: Tasks.find({state_id: this.state.state_id, $or: [ { title: {$regex: regex} }, { category: {$regex: regex} }, { description: {$regex: regex} } ]}, {sort: {no: 1}, limit: this.state.noPerPage, skip: (this.state.page-1)*this.state.noPerPage}).fetch(),
			allCount: Tasks.find({state_id: this.state.state_id, $or: [ { title: {$regex: regex} }, { category: {$regex: regex} }, { description: {$regex: regex} } ]}, {sort: {no: 1}}).count(),
			completeCount: Tasks.find({state_id: this.state.state_id, completed: true, started: true}).count(),
			incompleteCount: Tasks.find({state_id: this.state.state_id, completed: {$ne: true}, started: true}).count(),
			notStartedCount: Tasks.find({state_id: this.state.state_id, started: {$ne: true}}).count(),
			categories: _.uniq(Tasks.find({}, {sort: {category: 1}, fields: {category: true}}).fetch().map(function(x) {return x.category;})),
			currentUser: Meteor.user(),
		};
	},
	changeView(e) {
		this.setState({keyword: e.currentTarget.value, page: 1});
		React.findDOMNode(this.refs.selectTag).value = "";
	},
	categoryView(e) {
		this.setState({keyword: e.currentTarget.value, page: 1});
		React.findDOMNode(this.refs.searchTag).value = "";
	},
	clearView(e){
		React.findDOMNode(this.refs.selectTag).value = "";
  		React.findDOMNode(this.refs.searchTag).value = "";
  		this.setState({keyword: ""});
	},
	canEdit(){
		if(this.data.currentState && this.data.currentUser){
		 	return _.contains(this.data.currentState.moderators, this.data.currentUser._id)
		}else{
			return false
		}
		
	},
	changeState(e){
		this.setState({state_id: e.currentTarget.value});
	},
	renderCompletedTasksKnob(){
		return <Knob value={this.data.completeCount} max={this.data.completeCount+this.data.notStartedCount+this.data.incompleteCount} color="green" />;
	},
	renderIncompleteTasksKnob(){
		return <Knob value={this.data.incompleteCount} max={this.data.completeCount+this.data.notStartedCount+this.data.incompleteCount} color="yellow"  />;
	},
	renderNotStartedTasksKnob(){
		return <Knob value={this.data.notStartedCount} max={this.data.completeCount+this.data.notStartedCount+this.data.incompleteCount} color="red" />;
	},
	renderCurrentState(){
		if(this.data.currentState){
			return(
				<div className="col-md-offset-1 col-md-10 row">
					<div className="col-md-offset-1 col-md-4">
					      <div className="thumbnail">
								<img src={this.data.currentState.image_url} alt={this.data.currentState.head}/>
							</div>
					</div>
					<div className="col-md-6">
						<select  className="form-control" onChange={this.changeState} ref="stateTag">
			 				{this.renderStates()}
			 			</select>
			 			<br/>
			 			<table className="table table-bordered">
			 				<tbody>
			 					<tr>
			 						<td><p>{this.data.currentState.no == 0 ? "Prime Minister": "Chief Minister"} </p></td><td><a href={this.data.currentState.official} target="_blank">{this.data.currentState.head}</a></td>
			 					</tr>
			 					<tr>
			 						<td><p>Ruling Party</p></td><td>{this.data.currentState.ruling_party}</td>
			 					</tr>
			 					<tr>
			 						<td><p>Alliance</p></td><td>{this.data.currentState.alliance}</td>
			 					</tr>
			 					<tr>
			 						<td><p>In Power Since </p></td><td>{this.data.currentState.in_power_since}</td>
			 					</tr>
			 					<tr>
			 						<td><p>Till</p></td><td>{this.data.currentState.till_date}</td>
			 					</tr>
			 					<tr>
			 						<td><p>Twitter</p></td><td><a href={this.data.currentState.twitter_link}>{this.data.currentState.twitter_handle}</a></td>
			 					</tr>
			 					<tr>
			 						<td><p>Facebook</p></td><td><a href={this.data.currentState.facebook_link}>{this.data.currentState.facebook_username}</a></td>
			 					</tr>

			 				</tbody>
			 			</table>
			 			
			 			
			 			
					</div>
				</div>
			
			)
		}else{
			return ""
		}
		
	},
	showModal(task, event){
		this.setState({selectedTask: task});
		var modal = $('#modal');
		modal.modal();
	},
	changePage(number, event){
		event.preventDefault()
		if(number > 0 && number <= this.data.allCount/this.state.noPerPage + 1){
			
			this.setState({page: number});
		}
		
	},
	pageNumber(number){
		return <li><a className="textPointer" onClick={this.changePage.bind(null, number)}>{number}</a></li>;
	},
	renderPageNumbers(){
		var rows = [];
		for (var i=0; i <= this.data.allCount; i+=this.state.noPerPage) {
		    rows.push(this.pageNumber(i/this.state.noPerPage+1));
		}
		return rows
	},
	renderTasks(){
		return this.data.tasks.map((task) => {
			const currentUserId = this.data.currentUser && this.data.currentUser._id;
			const showPrivateButton = task.owner === currentUserId;

			return <Task canEdit={this.canEdit} showModal={this.showModal} currentUser={this.data.currentUser} key={task._id} task={task} keyword={this.state.keyword} showPrivateButton={showPrivateButton}/>;
		})
	},
	
	renderCategories(){
		return this.data.categories.map((category) => {
			return <option value={category}>{category}</option>
		})
	},
	renderStates(){
		return this.data.states.map((state) => {
			return <option value={state._id}>{state.name}</option>
		})
	},
	openFormModal(){
		var ni = document.getElementById('insertfroala');
		var olddiv = document.getElementById("textDescription");
		if(olddiv){
			ni.innerHTML = '';
		}
		var newdiv = document.createElement('textarea');
		newdiv.setAttribute('id',"textDescription");
		newdiv.setAttribute('ref',"textDescription");

		ni.appendChild(newdiv);

		$('#textDescription').froalaEditor({
		      toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll']
		})
		
		var modal = $('#modalForm');
		modal.modal();
	},
	toggleHideCompleted(){
		this.setState({
			hideCompleted: !this.state.hideCompleted
		})
	},
	render() {
    	return (

			<div className="mainBody">
				<div className="row">
					{this.renderCurrentState()}
					
				</div>
				<br/>
				<div className="row">
		      		<div className="col-md-offset-1 col-md-10">
			        	<div className="row">
			        		<div className="col-md-offset-1 col-md-10 row">
					        	<div className="col-md-4 col-sm-4">
					        			{this.renderNotStartedTasksKnob()}
					        		<h3 className="text-center">Promises Not Started</h3>
					        	</div>
					        	<div className=" col-md-4  col-sm-4">
					        		{this.renderCompletedTasksKnob()}
					        		<h3 className="text-center">Promises Completed</h3>
					        	</div> 
					        	<div className=" col-md-4  col-sm-4">
					        		{this.renderIncompleteTasksKnob()}
					        		<h3 className="text-center">In Progress</h3>
					        	</div>
				        	</div>
				        </div>
				        <br/>
			        	<div className="col-md-offset-1 col-md-10">
			        	<div className="text-center ">
			        		<AccountsUIWrapper/>
				        	
				 			<br/>

				 			<div className="row margin-top-10">
				 				<div className="col-md-6">
				 					<input className="form-control" onChange={this.changeView} placeholder="Enter search keyword" ref="searchTag"/>
				 				</div>
				 				<div className={this.state.keyword != "" ? "col-md-5": "col-md-6"}>
				 					<select  className="form-control" onChange={this.categoryView} ref="selectTag">
				 						<option value="" disabled>Select Category</option>
				 						{this.renderCategories()}
				 					</select>
				 				</div>

				 				{ this.state.keyword != "" ?
				 				<div className="col-md-1">
				 					<button className="btn btn-default" onClick={this.clearView}>&times;</button>
				 				</div> : ""
				 				}
				 			</div>
				        	<br/>
				        	{ this.data.currentUser && this.canEdit() ?
				 					<div><button className="btn btn-primary"  onClick={this.openFormModal}>Add New Promise</button></div>: ""
				 				}</div>
				 			<br/>
				        	<table className="table table-bordered table-hover">
					    		<tbody>
					      			{this.renderTasks()}
					      		</tbody>
				    		</table>
				    		{this.data.tasks && this.data.allCount > 0 ?
				    		<nav className="text-center">
								<ul className="pagination">
									<li>
										<a className="textPointer" onClick={this.changePage.bind(null, this.state.page - 1)} aria-label="Previous">
										<span aria-hidden="true">&laquo;</span>
									</a>
									</li>
									 {this.renderPageNumbers()}
									<li>
										<a className="textPointer" onClick={this.changePage.bind(null, this.state.page + 1 )} aria-label="Next">
										<span aria-hidden="true">&raquo;</span>
									</a>
									</li>
								</ul>
							</nav>
							: <h4 className="text-center">We are working on adding election promises, please bear with us. </h4>}
			    		</div>
		      		</div>
	      		</div>
	      		{ this.data.currentState ?
	      			<FormModal state_id={this.data.currentState._id} categories={this.data.categories} canEdit={this.canEdit}/> : ""
	      		}
	      		
	      		<TaskModal task={this.state.selectedTask} canEdit={this.canEdit} categories={this.data.categories}/>
	      	</div>


    	);
  	}
})