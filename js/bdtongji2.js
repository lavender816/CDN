var start_date = '20211020' // 开始日期
var date = new Date();
var end_date = '' + date.getFullYear() + (date.getMonth() > 8 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate())); // 结束日期
var access_token = '121.c1131ade9b3bce903d982f8a71b91ac7.Ys0ikCvHxAZQy6Dd1FJ7svOu0K3IqDse79WURuT.C0_YBQ' // accessToken
var site_id = '17321284' // 网址 id
var dataUrl = 'https://bdtongji-lavender.vercel.app/api?access_token=' + access_token + '&site_id=' + site_id
var metrics = 'pv_count' // 统计访问次数 PV 填写 'pv_count'，统计访客数 UV 填写 'visitor_count'，二选一
var metricsName = (metrics === 'pv_count' ? '访问次数' : (metrics === 'visitor_count' ? '访客数' : ''))
// 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
var color = document.documentElement.getAttribute('data-theme') === null ? '#000' : '#fff'

// 访问地图
function mapChart () {
  let script = document.createElement("script")
  let paramUrl = '&start_date=' + start_date + '&end_date=' + end_date + '&metrics=' + metrics + '&method=visit/district/a';
  fetch(dataUrl + paramUrl).then(data => data.json()).then(data => {
    let mapName = data.result.items[0]
    let mapValue = data.result.items[1]
    let mapArr = []
    let max = mapValue[0][0]
    for (let i = 0; i < mapName.length; i++) {
      mapArr.push({ name: mapName[i][0].name, value: mapValue[i][0] })
    }
    let mapArrJson = JSON.stringify(mapArr)
    script.innerHTML = `
      var mapChart = echarts.init(document.getElementById('map-chart'), 'light');
      var mapOption = {
        title: {
          text: '博客访问来源地图',
          x: 'center',
          textStyle: {
            color: '${color}'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: ${max},
          left: 'left',
          top: 'bottom',
          text: ['高','低'],
          color: ['#8a2be2', '#afeeee'],
          textStyle: {
            color: '${color}'
          },
          calculable: true
        },
        series: [{
          name: '${metricsName}',
          type: 'map',
          mapType: 'china',
          showLegendSymbol: false,
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#121212'
            },
            emphasis: {
              areaColor: 'gold'
            }
          },
          data: ${mapArrJson}
          }]
        };
      mapChart.setOption(mapOption);
      window.addEventListener("resize", () => { 
        mapChart.resize();
      });`
    document.getElementById('map-chart').after(script);
  }).catch(function (error) {
    console.log(error);
  });
}

// 访问趋势日
function trendsChartDay () {
  let script = document.createElement("script")
  let paramUrl = '&start_date=' + start_date + '&end_date=' + end_date + '&metrics=' + metrics + '&method=trend/time/a&gran=day'
  fetch(dataUrl + paramUrl)
    .then(data => data.json())
    .then(data => {
      let dayArr = []
      let dayValueArr = []
      let dayName = data.result.items[0]
      let dayValue = data.result.items[1]
      for (let i = Math.min(dayName.length, 30) - 1; i >= 0; i--) {
        dayArr.push(dayName[i][0].substring(0, 13))
        if (dayValue[i][0] !== '--') {
          dayValueArr.push(dayValue[i][0])
        } else {
          dayValueArr.push(null)
        }
      }
      let dayArrJson = JSON.stringify(dayArr)
      let dayValueArrJson = JSON.stringify(dayValueArr)
      script.innerHTML = `
        var trendsChartDay = echarts.init(document.getElementById('trends-chartday'), 'light');
        var trendsOptionDay = {
          textStyle: {
            color: '${color}'
          },
          title: {
            text: '博客访问统计图（30日）',
            x: 'center',
            textStyle: {
              color: '${color}'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            name: '日期',
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '${color}'
              }
            },
            data: ${dayArrJson}
          },
          yAxis: {
            name: '${metricsName}',
            type: 'value',
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '${color}'
              }
            }
          },
          series: [{
            name: '${metricsName}',
            type: 'line',
            smooth: true,
            lineStyle: {
                width: 0
            },
            showSymbol: false,
            itemStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(171, 201, 255)'
              },
              {
                offset: 1,
                color: 'rgba(253, 187, 236)'
              }])
            },
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(171, 201, 255)'
              }, {
                offset: 1,
                color: 'rgba(253, 187, 236)'
              }])
            },
            data: ${dayValueArrJson},
            markLine: {
              data: [{
                name: '平均值',
                type: 'average'
              }]
            }
          }]
        };
        trendsChartDay.setOption(trendsOptionDay);
        window.addEventListener("resize", () => { 
          trendsChartDay.resize();
        });`
      document.getElementById('trends-chartday').after(script);
    }).catch(function (error) {
      console.log(error);
    });
}

// 访问趋势月
function trendsChartMonth () {
  let script = document.createElement("script")
  let paramUrl = '&start_date=' + start_date + '&end_date=' + end_date + '&metrics=' + metrics + '&method=trend/time/a&gran=month'
  fetch(dataUrl + paramUrl)
    .then(data => data.json())
    .then(data => {
      let monthArr = []
      let monthValueArr = []
      let monthName = data.result.items[0]
      let monthValue = data.result.items[1]
      for (let i = Math.min(monthName.length, 12) - 1; i >= 0; i--) {
        monthArr.push(monthName[i][0].substring(0, 7).replace('/', '-'))
        if (monthValue[i][0] !== '--') {
          monthValueArr.push(monthValue[i][0])
        } else {
          monthValueArr.push(null)
        }
      }
      let monthArrJson = JSON.stringify(monthArr)
      let monthValueArrJson = JSON.stringify(monthValueArr)
      script.innerHTML = `
        var trendsChartMonth = echarts.init(document.getElementById('trends-chartmonth'), 'light');
        var trendsOptionMonth = {
          textStyle: {
            color: '${color}'
          },
          title: {
            text: '博客访问统计图（每月）',
            x: 'center',
            textStyle: {
              color: '${color}'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            name: '日期',
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '${color}'
              }
            },
            data: ${monthArrJson}
          },
          yAxis: {
            name: '${metricsName}',
            type: 'value',
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '${color}'
              }
            }
          },
          series: [{
            name: '${metricsName}',
            type: 'line',
            smooth: true,
            lineStyle: {
                width: 0
            },
            showSymbol: false,
            itemStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(171, 201, 255)'
              },
              {
                offset: 1,
                color: 'rgba(253, 187, 236)'
              }])
            },
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(171, 201, 255)'
              }, {
                offset: 1,
                color: 'rgba(253, 187, 236)'
              }])
            },
            data: ${monthValueArrJson},
            markLine: {
              data: [{
                name: '平均值',
                type: 'average'
              }]
            }
          }]
        };
        trendsChartMonth.setOption(trendsOptionMonth);
        window.addEventListener("resize", () => { 
          trendsChartMonth.resize();
        });`
      document.getElementById('trends-chartmonth').after(script);
    }).catch(function (error) {
      console.log(error);
    });
}

// 访问来源
function sourcesChart () {
  let script = document.createElement("script")
  let paramUrl = '&start_date=' + start_date + '&end_date=' + end_date + '&metrics=' + metrics + '&method=source/all/a';
  fetch(dataUrl + paramUrl)
    .then(data => data.json())
    .then(data => {
      monthArr = [];
      let sourcesName = data.result.items[0]
      let sourcesValue = data.result.items[1]
      let sourcesArr = []
      for (let i = 0; i < sourcesName.length; i++) {
        sourcesArr.push({ name: sourcesName[i][0].name, value: sourcesValue[i][0] })
      }
      let sourcesArrJson = JSON.stringify(sourcesArr)
      script.innerHTML = `
        var sourcesChart = echarts.init(document.getElementById('sources-chart'), 'light');
        var sourcesOption = {
          textStyle: {
            color: '${color}'
          },
          title: {
            text: '博客访问来源统计图',
            x: 'center',
            textStyle: {
              color: '${color}'
            }
          },
          legend: {
            top: 'bottom',
            textStyle: {
              color: '${color}'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '${metricsName}',
            type: 'pie',
            radius: [30, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              formatter: "{b} : {c} ({d}%)"
            },
            data: ${sourcesArrJson},
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(255, 255, 255, 0.5)'
              }
            }
          }]
        };
        sourcesChart.setOption(sourcesOption);
        window.addEventListener("resize", () => { 
          sourcesChart.resize();
        });`
      document.getElementById('sources-chart').after(script);
    }).catch(function (error) {
      console.log(error);
    });
}

// 外部来源
function linksChart () {
  let script = document.createElement("script")
  let paramUrl = '&start_date=' + start_date + '&end_date=' + end_date + '&metrics=' + metrics + '&method=source/link/a';
  fetch(dataUrl + paramUrl)
    .then(data => data.json())
    .then(data => {
      monthArr = [];
      let linksName = data.result.items[0]
      let linksValue = data.result.items[1]
      let linksArr = []
      for (let i = 0; i < 20; i++) {
        linksArr.push({ name: linksName[i][0].name, value: linksValue[i][0] })
      }
      let linksArrJson = JSON.stringify(linksArr)
      script.innerHTML = `
        var linksChart = echarts.init(document.getElementById('links-chart'), 'light');
        var linksOption = {
          textStyle: {
            color: '${color}'
          },
          title: {
            text: '外部链接访问TOP20',
            x: 'center',
            textStyle: {
              color: '${color}'
            }
          },
          legend: {
            top: 'bottom',
            type: 'scroll',
            textStyle: {
              color: '${color}'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '${metricsName}',
            type: 'pie',
            radius: [30, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              formatter: "{b} : {c} ({d}%)"
            },
            data: ${linksArrJson},
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(255, 255, 255, 0.5)'
              }
            }
          }]
        };
        linksChart.setOption(linksOption);
        window.addEventListener("resize", () => { 
          linksChart.resize();
        });`
      document.getElementById('links-chart').after(script);
    }).catch(function (error) {
      console.log(error);
    });
}


function switchVisitChart () {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute('data-theme') === null ? '#fff' : '#000'
  try {
    let mapOptionNew = mapOption
    mapOptionNew.title.textStyle.color = color
    mapOptionNew.visualMap.textStyle.color = color
    mapChart.setOption(mapOptionNew)
  } catch (error) {
    console.log(error)
  }
  try {
    let trendsOptionDayNew = trendsOptionDay
    trendsOptionDayNew.title.textStyle.color = color
    trendsOptionDayNew.xAxis.axisLine.lineStyle.color = color
    trendsOptionDayNew.yAxis.axisLine.lineStyle.color = color
    trendsOptionDayNew.textStyle.color = color
    trendsChartDay.setOption(trendsOptionDayNew)
  } catch (error) {
    console.log(error)
  }
   try {
    let trendsOptionMonthNew = trendsOptionMonth
    trendsOptionMonthNew.title.textStyle.color = color
    trendsOptionMonthNew.xAxis.axisLine.lineStyle.color = color
    trendsOptionMonthNew.yAxis.axisLine.lineStyle.color = color
    trendsOptionMonthNew.textStyle.color = color
    trendsChartMonth.setOption(trendsOptionMonthNew)
  } catch (error) {
    console.log(error)
  }
  try {
    let sourcesOptionNew = sourcesOption
    sourcesOptionNew.title.textStyle.color = color
    sourcesOptionNew.legend.textStyle.color = color
    sourcesOptionNew.textStyle.color = color
    sourcesChart.setOption(sourcesOptionNew)
  } catch (error) {
    console.log(error)
  }
  try {
    let linksOptionNew = linksOption
    linksOptionNew.title.textStyle.color = color
    linksOptionNew.legend.textStyle.color = color
    linksOptionNew.textStyle.color = color
    linksChart.setOption(linksOptionNew)
  } catch (error) {
    console.log(error)
  }
}

if (document.getElementById('map-chart')) mapChart()
if (document.getElementById('trends-chartday')) trendsChartDay()
if (document.getElementById('trends-chartmonth')) trendsChartMonth()
if (document.getElementById('sources-chart')) sourcesChart()
if (document.getElementById('links-chart')) linksChart()

document.getElementsByClassName("theme")[0].addEventListener("click", function () { setTimeout(switchVisitChart, 100) })