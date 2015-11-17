'use strict'

function stringifyDate (timestamp) {
  let date = new Date(timestamp);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
}

let $modal = $('#modal');

let Knob = React.createClass({
  render: function () {
    return (
      <div className='col-md-4 text-center'>
        <h3 className='text-uppercase'> {this.props.text} </h3>
        <input 
          className = 'knob'
          type = 'text'
          data-readonly = 'true'
          data-min = {this.props.min}
          data-max = {this.props.max}
          value = {this.props.value}
          data-fgcolor = {this.props.value > this.props.max/2 ? 'green' : this.props.value > this.props.max/3 ? 'orange' : 'red'} />
      </div>
    );
  }
});

let Table = React.createClass({
  getInitialState: function () {
    return { keyword:  '' };
  },
  changeView: function(e) {
    this.setState({keyword: e.currentTarget.value});
  },
  showModal: function(key) {
    //$.getJSON(key + '.json', function (data) {
    $.getJSON('1.json', function (data) {
      [
        ['.title'], [("Promise #" + data.no + " " + data.title)],
        ['.category'], [(data.category)],
        ['.started'], [(data.started)],
        ['.started_on'], [(data.started_on)],
        ['.finished'], [(data.finished)],
        ['.status'], [(data.status)],
        ['.comments'], [(data.comments)],
        ['.links'], [('<ul>' + data.links.map(d => '<li><a href="' + d.url + '" target="_blank">' + d.title + '</a></li>') + '</ul>')],
      ].forEach(v => $modal.find(v[0]).html(v[1]));

      $modal.modal();
    });
  },
  byKeyword: function(d) {
    return d.title.toLowerCase().indexOf(this.state.keyword.toLowerCase()) > -1 ||
      d.category.toLowerCase().indexOf(this.state.keyword.toLowerCase()) > -1;
  },
  render: function() {
    let rows = this.props.data.filter(this.byKeyword).map(d => {
      return (
        <tr className = "pointer-row" key = {d.number} onClick = {this.showModal.bind(this, d.number)}>
          <td> {d.number} </td>
          <td> {d.title} </td>
          <td> {d.category} </td>
        </tr>
      );
    });
    return (
      <div>
        <input className = 'form-control' onChange = {this.changeView} placeholder = 'Enter search keyword'/>
        <div className = 'table-component'>
          <table className = 'table table-hover table-bordered'>
            <thead> <tr> <th> # </th> <th> Promise </th> <th> Category </th> </tr> </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    );
  }
});

let App = React.createClass({
  render: function () {
    let data = this.props.data;
    let sections = data.map(d => {
      return (
        <div className = 'col-md-4'>
          <h3 className = 'text-uppercase text-center'> {d.name} </h3>
          <Table data = {d.data}/>
        </div>
      );
    });
    let totalPromisesCount = data[0].data.length + data[1].data.length + data[2].data.length;

    return (
      <div className = 'container-fluid'>
        <Knob text = 'Promises Fullfilled' min = {0} max = {totalPromisesCount} value = {data[0].data.length} />
        <Knob text = 'Promises in Progress' min = {0} max = {totalPromisesCount} value = {data[1].data.length} />
        <Knob text = 'Total Promises' min = {0} max = {totalPromisesCount} value = {totalPromisesCount} />
        {sections}
        </div>
    );
  }
});

$.getJSON('data.json', function (data) {
  React.render(<App data = {data}/>, document.getElementById('react-app'));
  $('.knob').knob();
});
