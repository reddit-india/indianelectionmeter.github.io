
PromisePage = React.createClass({
	 mixins: [ReactMeteorData],
  	 getMeteorData: function() {
    	return {
      		task: Tasks.findOne({_id: this.props.params.promiseId}),
      		currentState: States.findOne({_id: this.props.params.stateId}),
      		categories: _.uniq(Tasks.find({}, {sort: {category: 1}, fields: {category: true}}).fetch().map(function(x) {return x.category;})),
   			currentUser: Meteor.user(),
   		};
  	},
	getInitialState(){
		return {
			edit: false,
			error: ""
		}
	},
	canEdit(){
	    if(this.data.currentState && this.data.currentUser){
	      	return _.contains(this.data.currentState.moderators, this.data.currentUser._id)
	    }else{
	      	return false
	    }

  	},
  	renderCategories(){
      	return this.data.categories.map((category) => {
        	return <option value={category}>{category}</option>
      	})
    },
  	handleSubmit(event){
		event.preventDefault();

		var title = React.findDOMNode(this.refs.textTitle).value.trim();
		var description = document.getElementById("textDescription1").value.trim();
		var category = React.findDOMNode(this.refs.selectCategory).value.trim();
		var source = React.findDOMNode(this.refs.textSource).value.trim();

		if(title != "" && description != "" && category != "" && source != ""){

			Meteor.call("updateTask", this.data.task._id, title, description, category, source);
			this.data.task.title = title;
			this.data.task.description = description;
			this.data.task.category = category;
			this.data.task.source = source;
			this.setState({error: "Task updated"});
			this.setState({edit: false});
		}else{
			this.setState({error: "Invalid Input"});
		}
		
	},
  	startEdit(){
		var ni = document.getElementById('inserthere');
		if(!this.state.edit && this.canEdit()){

			var olddiv = document.getElementById("textDescription1");
			if(olddiv){
				ni.innerHTML = '';
			}
			var newdiv = document.createElement('textarea');
			newdiv.setAttribute('id',"textDescription1");
			newdiv.setAttribute('ref',"textDescription");
			if(this.data.task.description){
				newdiv.value =  this.data.task.description;
			}
			ni.appendChild(newdiv);
			React.findDOMNode(this.refs.textTitle).value = this.data.task.title 
			if(this.data.task.category){
				React.findDOMNode(this.refs.selectCategory).value = this.data.task.category 
			}
			if(this.data.task.source){
				React.findDOMNode(this.refs.textSource).value =   this.data.task.source
			}
			$('#textDescription1').froalaEditor({
			      toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll']
			})
		}
		this.setState({edit: !this.state.edit});
	},
	render(){
		return (

			 <div className="mainBody container-fluid">
			 	<p className="text-center">
			 	<a href="/" className="btn btn-primary">Back</a>&nbsp;
			 		{this.canEdit() ?
		          		<button type="button" className="btn btn-primary" onClick={this.startEdit}>Edit</button>: ""
		          	}
		        </p>
		        <p className="text-center">
			 		<AccountsUIWrapper/>
			 	</p>
		          <div className="body row">
		          	<div className="col-md-offset-2 col-md-8">
		            	<h3 className="text-center">{this.data.task ? this.data.task.no : ""}. {this.data.task ? this.data.task.title : ""}</h3>
		            </div>
		          </div>
		         
		          <div className="body row ">
		          		<div className="col-md-offset-2 col-md-8 ">
		          			 <hr/>
				           	<div className={this.state.edit && this.canEdit() ? "": "hide"}>
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
				            
				            <div className={this.state.edit && this.canEdit()? "hide col-md-12" : "col-md-8 col-md-offset-2"}>
				            	<p className="text-center"><b>Category : {this.data.task ? this.data.task.category : ""}</b></p>
				            	<hr/>
				              	{this.data.task && this.data.task.description ?
				              		  <div dangerouslySetInnerHTML={{__html: this.data.task.description}}></div> : ""
				              	}
				              	{this.data.task && this.data.task.source ?
				              		<p className=""><a href={this.data.task ? this.data.task.source : ""} target="_blank"><b>Source</b></a></p> : ""
				              	}
			              	</div>
			              	
		            	</div>
		            	
		            	
		            	
		          </div>
		          <div className="body row">
		          	<div className="col-md-offset-2 col-md-8">
		          	<hr className="body-bottom"/>
		              	{this.data.task && this.data.currentState ? 
	            			<DisqusThread shortname={this.data.task._id} category_id="4217438"  identifier={this.data.task._id} title={this.data.task.title} url={'"http://localhost:3000/'+this.data.currentState._id+"/"+this.data.task._id+'/"' }/> : ""
	            		}
	            	</div>
		          </div>
		     
		    </div>
		);
	}
})