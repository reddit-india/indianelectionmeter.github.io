'use strict';

function stringifyDate(timestamp) {
  let date = new Date(timestamp);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
}

let $modal = $('#modal');

let Knob = React.createClass({
  render: function () {
    return React.createElement(
      'div',
      { className: 'col-md-4 text-center' },
      React.createElement(
        'h3',
        { className: 'text-uppercase' },
        ' ',
        this.props.text,
        ' '
      ),
      React.createElement('input', {
        className: 'knob',
        type: 'text',
        'data-readonly': 'true',
        'data-min': this.props.min,
        'data-max': this.props.max,
        value: this.props.value,
        'data-fgcolor': this.props.value > this.props.max / 2 ? 'green' : this.props.value > this.props.max / 3 ? 'orange' : 'red' })
    );
  }
});

let Table = React.createClass({
  getInitialState: function () {
    return { keyword: '' };
  },
  changeView: function (e) {
    this.setState({ keyword: e.currentTarget.value });
  },
  showModal: function (key) {
    $.getJSON(key + '.json', function (data) {
      [['.title', "Promise #" + data.no + " " + data.title], ['.category', data.category], ['.started', data.started], ['.started_on', data.started_on], ['.finished', data.finished], ['.status', data.status], ['.comments', data.comments], ['.links', '<ul>' + data.links.map(d => '<li><a href="' + d.url + '" target="_blank">' + d.title + '</a></li>') + '</ul>']].forEach(v => $modal.find(v[0]).html(v[1]));

      $modal.modal();
    }).fail(function () {
      $modal.find('.title').html('Promise #' + key);
      $modal.find('.status').html('Sorry, no data for this promise. Help India by contributing' + '<a href="https://github.com/reddit-india/indianelectionmeter.github.io/blob/master/CONTRIBUTING.md">here</a>.');
      $modal.modal();
    });
  },
  byKeyword: function (d) {
    return d.title.toLowerCase().indexOf(this.state.keyword.toLowerCase()) > -1 || d.category.toLowerCase().indexOf(this.state.keyword.toLowerCase()) > -1;
  },
  render: function () {
    let rows = this.props.data.filter(this.byKeyword).map(d => {
      return React.createElement(
        'tr',
        { className: 'pointer-row', key: d.number, onClick: this.showModal.bind(this, d.number) },
        React.createElement(
          'td',
          null,
          ' ',
          d.number,
          ' '
        ),
        React.createElement(
          'td',
          null,
          ' ',
          d.title,
          ' '
        ),
        React.createElement(
          'td',
          null,
          ' ',
          d.category,
          ' '
        )
      );
    });
    return React.createElement(
      'div',
      null,
      React.createElement('input', { className: 'form-control', onChange: this.changeView, placeholder: 'Enter search keyword' }),
      React.createElement(
        'div',
        { className: 'table-component' },
        React.createElement(
          'table',
          { className: 'table table-hover table-bordered' },
          React.createElement(
            'thead',
            null,
            ' ',
            React.createElement(
              'tr',
              null,
              ' ',
              React.createElement(
                'th',
                null,
                ' # '
              ),
              ' ',
              React.createElement(
                'th',
                null,
                ' Promise '
              ),
              ' ',
              React.createElement(
                'th',
                null,
                ' Category '
              ),
              ' '
            ),
            ' '
          ),
          React.createElement(
            'tbody',
            null,
            rows
          )
        )
      )
    );
  }
});

let App = React.createClass({
  render: function () {
    let data = this.props.data;
    let sections = data.map(d => {
      return React.createElement(
        'div',
        { className: 'col-md-4' },
        React.createElement(
          'h3',
          { className: 'text-uppercase text-center' },
          ' ',
          d.name,
          ' '
        ),
        React.createElement(Table, { data: d.data })
      );
    });
    let totalPromisesCount = data[0].data.length + data[1].data.length + data[2].data.length;

    return React.createElement(
      'div',
      { className: 'container-fluid' },
      React.createElement(Knob, { text: 'Promises Fullfilled', min: 0, max: totalPromisesCount, value: data[0].data.length }),
      React.createElement(Knob, { text: 'Promises in Progress', min: 0, max: totalPromisesCount, value: data[1].data.length }),
      React.createElement(Knob, { text: 'Total Promises', min: 0, max: totalPromisesCount, value: totalPromisesCount }),
      sections
    );
  }
});

$.getJSON('data.json', function (data) {
  React.render(React.createElement(App, { data: data }), document.getElementById('react-app'));
  $('.knob').knob();
});
