/**
 * Created by ahwww on 22/11/2016.
 */
let array = [];

function toStart() {
  $.get('/api/users', function (data) {
  }).done(function (data) {
    $.each(data, function (index, user)
    {
      console.log(user);
    });
    positionArray(data);
  });
}

function positionArray(data)
{
  $.each(data, function (index, user) {
    array.push(user);
  });
  followedByChart(array);
  followingChart(array);
}

function followedByChart(array) {
  let chartArray = [];

  array.forEach(function (element) {
    chartArray.push({
      name: element.firstName + ' ' + element.lastName,
      points: element.followedBy.length,
      color: '#00ffff',
    })
  })

  var chart = AmCharts.makeChart('chartFollowers',
      {
        "type": "serial",
        "theme": "light",
        "dataProvider": chartArray,
        "valueAxes": [{
          "maximum": 20,
          "minimum": 0,
          "axisAlpha": 0,
          "dashLength": 1
          ,
          "position": "left"
        }],
        "startDuration": 1,
        "graphs": [{
          "balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
          "bulletOffset": 10,
          "bulletSize": 52,
          "colorField": "color",
          "cornerRadiusTop": 8,
          "fillAlphas": 0.8,
          "lineAlpha": 0,
          "type": "column",
          "valueField": "points"
        }],
        "marginTop": 0,
        "marginRight": 0,
        "marginLeft": 0,
        "marginBottom": 0,
        "autoMargins": false,
        "categoryField": "name",
        "categoryAxis": {
          "axisAlpha": 0,
          "gridAlpha": 0,
          "inside": true,
          "tickLength": 0
        },
        "export": {
          "enabled": true
        }
      });
}

function followingChart(array) {
  let chartArray = [];

  array.forEach(function (element) {
    chartArray.push({
      name: element.firstName + ' ' + element.lastName,
      points: element.following.length,
      color: '#00ff00',
    })
  })

  var chart = AmCharts.makeChart('chartFollowing',
      {
        "type": "serial",
        "theme": "light",
        "dataProvider": chartArray,
        "valueAxes": [{
          "maximum": 20,
          "minimum": 0,
          "axisAlpha": 0,
          "dashLength": 1
          ,
          "position": "left"
        }],
        "startDuration": 1,
        "graphs": [{
          "balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
          "bulletOffset": 10,
          "bulletSize": 52,
          "colorField": "color",
          "cornerRadiusTop": 8,
          "fillAlphas": 0.8,
          "lineAlpha": 0,
          "type": "column",
          "valueField": "points"
        }],
        "marginTop": 0,
        "marginRight": 0,
        "marginLeft": 0,
        "marginBottom": 0,
        "autoMargins": false,
        "categoryField": "name",
        "categoryAxis": {
          "axisAlpha": 0,
          "gridAlpha": 0,
          "inside": true,
          "tickLength": 0
        },
        "export": {
          "enabled": true
        }
      });
}

window.addEventListener("load", function load(event){
  window.removeEventListener("load", load, false); //remove listener, no longer needed
  toStart();
},false);

