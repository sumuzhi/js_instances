function scheduleHtmlParser(html) {
  let result = []
  let sss
  let tableinfo = $('#kbtable > tbody > tr')
  tableinfo.each((index, item) => {
    $('td', item).each((index2, item2) => {
      var course = {}
      $('div.kbcontent span', item2).remove()
      //       console.log("-----------------------------")
      let j = 0
      $('div.kbcontent br', item2).each((index3, item3) => {   //item3每个br 
        item4 = item3.prev
        //         console.log(typeof item4)
        if (index2 === 0) index2 = 7
        course['day' + j] = index2
        if (item4['type'] === 'text') {
          if (!item4.data.match(/[-]{1,}/)) {
            if (course['name']) {
              course['name' + (j + 1)] = item4.data
              j += 1
            } else {
              course['name'] = item4.data
            }
          }

        } else {
          //           console.log(item4.attribs.title,":",item4.children[0].data)
          if (course[item4.attribs.title]) {
            course[item4.attribs.title + j] = item4.children[0].data

          } else {
            course[item4.attribs.title] = item4.children[0].data
          }
        }
        //           console.log(course)
      })
      if (index2 === 0) index2 = 7
      //       course['day']=index2
      result.push(course)
      course = {}
    })
  })
  var newArray = result.filter(value => Object.keys(value).length !== 0);
  console.log(newArray)



  //至此,数据读出完成


  //周次: "11-16(周)[06-07-08-09节]"
  function handleweek(week) {
    if (week) {
      //     console.log(week)
      weeksStr = week.split("(周)")[0]
      //    console.log(weeksStr)
      weeksArr = weeksStr.split(",")
      //    console.log(weeksArr)
      weeks = []
      weeksArr.map((item, index) => {
        var a = item.split("-")
        //      console.log(a)
        if (a[1]) {
          //        console.log("----------------")
          for (let i = a[0] * 1; i <= a[1] * 1; i++) {
            //        console.log(i)
            weeks.push(i * 1)
          }
        } else {
          weeks.push(a * 1)
        }
      })
      //    sections = section.split("-")
      return weeks
    }
  }

  //节次: "11-16(周)[06-07-08-09节]"
  function handlesection(week) {
    if (week) {
      //    console.log(week)
      sectionStr = week.split("(周)")[1]
      sectionArr = sectionStr.split("[")
      //    console.log(sectionArr)
      sectionArr = sectionArr[1].split("节]")
      sectionArr.pop()
      //    console.log(sectionArr)
      sections = []
      sectionArr.map((item, index) => {
        var a = item.split("-")
        //      console.log(a)
        if (!isNaN(a[1] * 1)) {
          //        console.log("----------------")
          for (let i = a[0] * 1; i <= a[1] * 1; i++) {
            //        console.log(i)
            sections.push({ section: i * 1 })
          }
        }
      })
      return sections
    }
  }

  //数组去重
  function deteleObject(obj) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
      var keys = Object.keys(obj[i]);
      keys.sort(function (a, b) {
        return (Number(a) - Number(b));
      });
      var str = '';
      for (var j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }
    uniques = uniques;
    return uniques;
  }

  //进行数据分离
  function handledata(item) {
    arr = []
    data0 = {}
    data1 = {}
    data2 = {}
    data3 = {}
    data4 = {}
    data5 = {}
    for (var aaa in item) {
      if (aaa.match(/[1]{1,}/)) {
        data1[aaa] = item[aaa]
        arr.push(data1)
      } else if (aaa.match(/[2]{1,}/)) {
        data2[aaa] = item[aaa]
        arr.push(data2)
      } else if (aaa.match(/[3]{1,}/)) {
        data3[aaa] = item[aaa]
        arr.push(data3)

      } else if (aaa.match(/[4]{1,}/)) {
        data4[aaa] = item[aaa]
        arr.push(data4)

      } else if (aaa.match(/[5]{1,}/)) {
        data5[aaa] = item[aaa]
        arr.push(data5)

      } else {
        data0[aaa] = item[aaa]
        arr.push(data0)

      }
    }
    arr = deteleObject(arr)
    return arr
  }

  result = newArray.map((item, index) => {
    return handledata(item)
  })
  //   console.log(result)
  datas = []
  result.forEach((item, index) => {
    //     console.log(item)
    item.forEach((item2, index2) => {
      data = {}
      //       console.log(item2)
      data['day'] = item2['day0'] || item2['day1'] || item2['day2'] || item2['day3'] || item2['day4'] || item2['day5']
      data['name'] = item2['name'] || item2['name1'] || item2['name2'] || item2['name3'] || item2['name4'] || item2['name5']
      data['weeks'] = handleweek(item2["周次(节次)"] || item2["周次(节次)1"] || item2["周次(节次)2"] || item2["周次(节次)3"] || item2["周次(节次)4"] || item2["周次(节次)5"])
      data['sections'] = handlesection(item2["周次(节次)"] || item2["周次(节次)1"] || item2["周次(节次)2"] || item2["周次(节次)3"] || item2["周次(节次)4"] || item2["周次(节次)5"])
      data['teacher'] = item2['老师'] || item2['老师1'] || item2['老师2'] || item2['老师3'] || item2['老师4'] || item2['老师5'] || ''
      data['position'] = item2['教室'] || item2['教室1'] || item2['教室2'] || item2['教室3'] || item2['教室4'] || item2['教室5'] || ''
      datas.push(data)
      data = {}

    })
  })

  datas.forEach((item, index) => {
    if (!item.weeks) {
      datas.splice(index, 1)
    }
  })

  //   console.log(datas)



  var time = [
    { "section": 1, "startTime": "08:20", "endTime": "09:00" },
    { "section": 2, "startTime": "09:05", "endTime": "09:45" },
    { "section": 3, "startTime": "09:50", "endTime": "10:30" },
    { "section": 4, "startTime": "10:45", "endTime": "11:25" },
    { "section": 5, "startTime": "11:30", "endTime": "12:10" },
    { "section": 6, "startTime": "14:30", "endTime": "15:10" },
    { "section": 7, "startTime": "15:15", "endTime": "15:55" },
    { "section": 8, "startTime": "16:10", "endTime": "16:50" },
    { "section": 9, "startTime": "16:55", "endTime": "17:35" },
    { "section": 10, "startTime": "19:30", "endTime": "20:10" },
    { "section": 11, "startTime": "20:15", "endTime": "20:55" },
    { "section": 12, "startTime": "21:00", "endTime": "21:40" }
  ]
  return { "courseInfos": datas, "sectionTimes": time }
}





