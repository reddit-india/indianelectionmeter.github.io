
FormModal = React.createClass({
	getInitialState(){
		return {
			error: ""
		}
	},
	handleSubmit(event){
		event.preventDefault();
		var title = React.findDOMNode(this.refs.textTitle).value.trim();
		var description = document.getElementById("textDescription").value.trim();
		var category = React.findDOMNode(this.refs.selectCategory).value.trim();
		var source = React.findDOMNode(this.refs.textSource).value.trim();
		if(title != "" && description != "" && category != "" && source != ""){
			Meteor.call("addTask", this.props.state_id, title, description, category, source);

			React.findDOMNode(this.refs.textTitle).value = "";
			React.findDOMNode(this.refs.selectCategory).value = "";
			React.findDOMNode(this.refs.textSource).value = "";
			$('#modalForm').modal('hide');
		}else{
			this.setState({error: "Invalid Input"});
		}
		
	},
	clearError(event){
		event.preventDefault();
		if(this.state.error != "")
		this.setState({error: ""});
	},
	renderCategories(){
		return this.props.categories.map((category) => {
			return <option value={category}>{category}</option>
		})
	},
	render: function() {
		return (
			<div className="modal fade" id="modalForm">
		      <div className="modal-dialog modal-lg">
		        <div className="modal-content">
		          <div className="modal-header">
		            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		            <h4 className="title text-center">Enter New Election Promise</h4>
		          </div>
		          <div className="modal-body container-fluid">
		            <div className="col-md-offset-2 col-md-8">
		            	{
		            		this.state.error != "" ?
		            		<div className="alert alert-success" role="alert"><button type="button" className="close" onClick={this.clearError} aria-label="Close"><span aria-hidden="true">&times;</span></button>{this.state.error}</div> : ""
		            	}
		            	
		            	<form>
			            	<div className="form-group">
	    						<label for="textTitle">Title</label>
						    	<input type="text" onChange={this.clearError} className="form-control" ref="textTitle" id="textTitle" placeholder="Title"/>
						  	</div>
						  	<div className="form-group">
						    	<label for="textDescription">Description</label>
						    	<div id="insertfroala">
						    	</div>
						  	</div>
						  	<div className="form-group">
						    	<label for="textSource">Source</label>
						    	<input type="text" onChange={this.clearError} className="form-control" ref="textSource" id="textSource" placeholder="Source"/>
						  	</div>
						  	<div className="form-group">
						    	<label for="selectCategory">Category</label>
						    	<select  className="form-control" onChange={this.clearError} onChange={this.categoryView} ref="selectCategory" id="selectCategory">
			 						<option value="" disabled>Select</option>
			 						{this.renderCategories()}
			 					</select>
						    	<p className="help-block">
						    		Submit a request to add a new category
						    	</p>
						  	</div>
						  	<button onClick={this.handleSubmit} type="submit" className="btn btn-primary pull-right">Submit</button>
					  	</form>
			            

		            </div>
		          </div>
		        </div>
		      </div>
			</div>

			);
	}
});