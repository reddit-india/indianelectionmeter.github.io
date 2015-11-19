
TaskModal = React.createClass({
	getInitialState(){
		return {
			edit: false,
			error: ""
		}
	},
	handleSubmit(event){
		event.preventDefault();

		var title = React.findDOMNode(this.refs.textTitle).value.trim();
		var description = document.getElementById("textDescription1").value.trim();
		var category = React.findDOMNode(this.refs.selectCategory).value.trim();
		var source = React.findDOMNode(this.refs.textSource).value.trim();

		if(title != "" && description != "" && category != "" && source != ""){

			Meteor.call("updateTask", this.props.task._id, title, description, category, source);
			this.props.task.title = title;
			this.props.task.description = description;
			this.props.task.category = category;
			this.props.task.source = source;
			this.setState({error: "Task updated"});
			this.setState({edit: false});
		}else{
			this.setState({error: "Invalid Input"});
		}
		
	},
	startEdit(){
		var ni = document.getElementById('inserthere');
		if(!this.state.edit && this.props.canEdit()){

			var olddiv = document.getElementById("textDescription1");
			if(olddiv){
				ni.innerHTML = '';
			}
			var newdiv = document.createElement('textarea');
			newdiv.setAttribute('id',"textDescription1");
			newdiv.setAttribute('ref',"textDescription");
			if(this.props.task.description){
				newdiv.value =  this.props.task.description;
			}
			ni.appendChild(newdiv);
			React.findDOMNode(this.refs.textTitle).value = this.props.task.title 
			if(this.props.task.category){
				React.findDOMNode(this.refs.selectCategory).value = this.props.task.category 
			}
			if(this.props.task.source){
				React.findDOMNode(this.refs.textSource).value =   this.props.task.source
			}
			$('#textDescription1').froalaEditor({
			      toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll']
			})
		}
		this.setState({edit: !this.state.edit});
	},
	disposeModal(){
		this.setState({edit: false});
		$('#modal').modal('hide');
	},
	renderCategories(){
		return this.props.categories.map((category) => {
			return <option value={category}>{category}</option>
		})
	},
	render(){
		return (
			<div className="modal fade" id="modal">
		      <div className="modal-dialog modal-lg">
		        <div className="modal-content">
		          <div className="modal-header">
		            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		            <h5 className="text-center">{this.props.task ? this.props.task.title : ""}</h5>
		          </div>
		          <div className="modal-body container-fluid">

		            	<div className={this.state.edit && this.props.canEdit() ? "": "hide"}>
		            	{
		            		this.state.error != "" ?
		            		<div className="alert alert-success" role="alert"><button type="button" className="close" onClick={this.clearError} aria-label="Close"><span aria-hidden="true">&times;</span></button>{this.state.error}</div> : ""
		            	}
		            	<form >
			            	<div className="form-group">
	    						<label for="textTitle">Title</label>
						    	<input type="text"  onChange={this.clearError} className="form-control" ref="textTitle" id="textTitle" placeholder="Title"/>
						  	</div>
						  	<div className="form-group">
						    	<label for="textDescription">Description</label>
						    	<div id="inserthere"></div>
						    	
						  	</div>
						  	<div className="form-group">
						    	<label for="textSource">Source</label>
						    	<input type="text"  onChange={this.clearError} className="form-control" ref="textSource" id="textSource" placeholder="Source"/>
						  	</div>
						  	<div className="form-group">
						    	<label for="selectCategory">Category</label>
						    	<select  className="form-control" onChange={this.clearError}  onChange={this.categoryView} ref="selectCategory" id="selectCategory">
			 						{this.renderCategories()}
			 					</select>
						    	<p className="help-block">
						    		Submit a request to add a new category
						    	</p>
						  	</div>
						  	<button onClick={this.handleSubmit} type="submit" className="btn btn-primary pull-right">Submit</button>
					  	</form>
					  	</div>
			            
			            <div className={this.state.edit && this.props.canEdit()? "hide col-md-12" : "col-md-8 col-md-offset-2"}>
			            	<p className=""><b>Category</b> : {this.props.task ? this.props.task.category : ""}</p>
			              	{this.props.task && this.props.task.description ?
			              		  <div dangerouslySetInnerHTML={{__html: this.props.task.description}}></div> : ""
			              	}
			              	{this.props.task && this.props.task.source ?
			              		<p className=""><a href={this.props.task ? this.props.task.source : ""} target="_blank"><b>Source</b></a></p> : ""
			              	}
		              	</div>
		            
		          </div>
		          <div className="modal-footer">
		          	{this.props.canEdit() ?
		          		<button type="button" className="btn btn-primary" onClick={this.startEdit}>Edit</button>: ""

		          	}
		          	
		            <button type="button" className="btn btn-default" onClick={this.disposeModal}>Close</button>
		          </div>
		        </div>
		      </div>
		    </div>
		);
	}
})