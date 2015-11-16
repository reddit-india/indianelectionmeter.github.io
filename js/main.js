'use strict'

function stringifyDate (timestamp) {
  var date = new Date(timestamp);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
}

var $modal = $('#modal');
var Table = React.createClass({
  getInitialState: function () {
    return { keyword:  '' };
  },
  changeView: function(e) {
    this.setState({keyword: e.currentTarget.value});
  },
  showModal: function(key) {
    $.getJSON('1.json', function (data) {
      //$.getJSON(key + '.json', function (data) {
      $modal.find('.title').html("Promise #" + data.no + " " + data.title);
      $modal.find('.category').html(data.category);
      $modal.find('.started').html(data.started);
      $modal.find('.started_on').html(data.started_on);
      $modal.find('.finished').html(data.finished);
      $modal.find('.status').html(data.status);
      $modal.find('.comments').html(data.comments);
      $modal.find('.links').html('<ul>' + data.links.map(d => '<li><a href="' + d.url + '" target="_blank">' + d.title + '</a></li>') + '</ul>');
      $modal.modal();
    });
  },
  byKeyword: function(d) {
    return d.title.toLowerCase().indexOf(this.state.keyword.toLowerCase()) > -1 ||
      d.category.toLowerCase().indexOf(this.state.keyword.toLowerCase()) > -1;
  },
  render: function() {
    return (React.createElement('div', null
      ,React.createElement('input', { className: 'form-control', onChange: this.changeView, placeholder: 'Enter search keyword' })
      ,React.createElement('div', { className: 'table-component' }
        ,React.createElement('table', { className: 'table table-hover table-bordered' }
          ,React.createElement('thead', null
            ,React.createElement('tr', null
              ,React.createElement('th', null, '#')
              ,React.createElement('th', null, 'Promise')
              ,React.createElement('th', null, 'Category')
          ,React.createElement('tbody', null
            ,this.props.data.filter(this.byKeyword).map(d => 
          React.createElement('tr', { className: "pointer-row", key : d.number, onClick: this.showModal.bind(this, d.number)}
                ,React.createElement('td', null, React.createElement('p', null, d.number))
                ,React.createElement('td', null, React.createElement('p', null, d.title))
                ,React.createElement('td', null, React.createElement('p', null, d.category)))))))))));
  }
});

var Knob = React.createClass({
  render: function () {
    return (
      React.createElement('div', { className: 'col-md-4 text-center' }
      ,React.createElement('h3', { className: 'text-uppercase' }, this.props.text)
      ,React.createElement('input', { 
    className: 'knob', 
    type: 'text', 
    'data-readonly': 'true', 
    'data-min': this.props.min, 
    'data-max': this.props.max,
    'data-fgcolor': this.props.value > this.props.max/2 ? 'green' : this.props.value > this.props.max/3 ? 'orange' : 'red',
    value: this.props.value
      }))
    );
  }
});

//var GovtChooser = React.createClass({
//getInitialState : function () {
//return { govts: [{ constituency: 'Central', by: 'BJP'}, { constituency: 'Delhi', by: 'AAP'}]};
//},
//render: function () {
//return React.createElement();
//}
//});

$.getJSON('data.json', function (data) {
  React.render(
    React.createElement('div', { className: 'container-fluid' }
  ,React.createElement('div', null
   ,React.createElement(Knob, { text: 'Promises Fullfilled', min: 0, max: data.reduce((v, d) => v += d.data.length, 0), value: data[0].data.length })
   ,React.createElement(Knob, { text: 'Total Promises', min: 0, max: data.reduce((v, d) => v += d.data.length, 0), value: data.reduce((v, d) => v += d.data.length, 0)})
   ,React.createElement(Knob, { text: 'Promises in progress', min: 0, max: data.reduce((v, d) => v += d.data.length, 0), value: data[1].data.length })
   ,data.map(d => React.createElement('div', { className: 'col-md-' + 12/data.length }
     ,React.createElement('h3', { className: 'text-uppercase text-center' }, d.name)
     ,React.createElement(Table, { data: d.data }))))),document.getElementById('react-app'));

   $('.knob').knob();
});
