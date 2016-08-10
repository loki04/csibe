var baseURL = "http://alga.inf.u-szeged.hu/~alga/csibe-gh-pages/chart/"
var releaseURL = baseURL + "experimental/"
var clangURL = releaseURL + "clang/"
var gccURL = releaseURL + "gcc/"

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Size');
  data.addRows(rows);

  // Set chart options
  var options = {
    title:'CSiBE code size',
    curveType: 'function'
  };

//  $("#chart_div").css({width:'800', height:'600'});
  var chart = new google.visualization.LineChart(document.querySelector('#chart_div'));
  chart.draw(data, options);
//  $("#latest_diag").css({width:'800', height:'600'});
}

function drawChart2() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'GCC');
  data.addColumn('number', 'Clang');
  data.addRows(rows);

  // Set chart options
  var options = {
    title:'CSiBE code size',
    curveType: 'function'
  };

//  $("#chart_div").css({width:'800', height:'600'});
  var chart = new google.visualization.LineChart(document.querySelector('#chart_div'));
  chart.draw(data, options);
//  $("#latest_diag").css({width:'800', height:'600'});
}

var getURL = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'text';
    xhr.setRequestHeader('Access-Control-Allow-Origin', url);
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

function csvJSON(csv) {
  var lines = csv.split("\n");
  var data = {};
  var sum = 0;
  for(var i = 0; i < lines.length; i++) {
    if (lines[i].length == 0)
      continue
    var currentline = lines[i].split(",");
    if (currentline.length == 3 && currentline[2] % 1 === 0 && currentline[2] > 0) {
        var file = {}
        file[currentline[1]] = currentline[2];
        sum += parseInt(currentline[2]);

        if (typeof(data[currentline[0]]) === "undefined")
          data[currentline[0]] = []
        data[currentline[0]].push(file)
    } else if (currentline.length == 2)
        data[currentline[0]] = currentline[1]
  }
  data["sum"] = sum;
  return data;
}

function getFileList(URL) {
  return getURL(URL).then(function(data) {
    var found = data.match(/>[^<>]*\.csv</g)
    found.forEach(function(part, index, theArray) {
      theArray[index] = part.substring(1, part.length - 1);
    })
    return found
  }, function(status) {
    console.log("No file list");
    return []
  })
}

function compiler(URL) {
  var data = []
  getFileList(URL).then(function(list) {
    return list.reduce(function(sequence, file) {
      return sequence.then(function() {
        return getURL(URL + file + '?' + new Date().getTime());
      }).then(function(csv) {
        var json = csvJSON(csv)
        data.push([json.Date, json.sum])
      });
    }, Promise.resolve());
  }).then(function(){
    rows = data
    google.charts.setOnLoadCallback(drawChart);
    return data
  });

}

function all() {
  var data = []
  getFileList(gccURL).then(function(list) {
    return list.reduce(function(sequence, file) {
      return sequence.then(function() {
        return getURL(gccURL + file + '?' + new Date().getTime());
      }).then(function(csv) {
        var json = csvJSON(csv)
        data.push([json.Date, json.sum, null])
      });
    }, Promise.resolve());
  }).then(getFileList(clangURL).then(function(list) {
    return list.reduce(function(sequence, file) {
      return sequence.then(function() {
        return getURL(clangURL + file + '?' + new Date().getTime());
      }).then(function(csv) {
        var json = csvJSON(csv)
        var found = false
        for (i = 0; i < data.length; i++)
          if (data[i][0] == json.Date) {
            data[i][2] = json.sum
            found = true
            break;
          }
        if (!found)
          data.push([json.Date, null, json.sum])
      });
    }, Promise.resolve());
  })).then(function(){
    rows = data
    google.charts.setOnLoadCallback(drawChart2);
    return data
  });

}


google.charts.load('current', {packages: ['corechart', 'line']});

$('#latest').on('shown.bs.modal', function() {
  all()
})

$('#latest-clang').on('click', function(e) {
  compiler(clangURL)
})

$('#latest-gcc').on('click', function(e) {
  compiler(gccURL)
})

$('#latest-all').on('click', function(e) {
  all()
})
