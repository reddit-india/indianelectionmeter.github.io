Knob = React.createClass({
	componentDidMount: function() {
	    $('.knob').knob();
	},
	render: function () {
		return (
			React.createElement('div', { className: 'text-center' }
			,React.createElement('input', { 
		className: 'knob dial', 
		type: 'text', 
		'data-readonly': 'true', 
		'data-min': 0, 
		'data-max': this.props.max,
		'data-fgcolor': this.props.value > this.props.max/2 ? 'green' : this.props.value > this.props.max/3 ? 'orange' : 'red',
		value: this.props.value
			}))
		);
	}
});