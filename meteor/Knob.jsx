Knob = React.createClass({
  componentDidMount: function() {
    $('.knob').knob();
  },
  getKnobColor: function (value) {
    return value > this.props.max/2 ? 'green' : value > this.props.max/3 ? 'orange' : 'red';
  },
  render: function () {
    return (
      <div className = "text-center">
        <input
          className = "knob dial"
          type = "text"
          data-readonly = "true"
          data-min = {0}
          data-max = {this.props.max}
          data-fgcolor = {this.getKnobColor(this.props.value)}
          value = {this.props.value}
          />
      </div>
    );
  }
});
