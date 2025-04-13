import { useState, useEffect, useRef } from 'react';
import { user_lesson_count, user_music_record_count, user_task_count, user_music_entered_count } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import Chart from 'chart.js/auto';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const BACKGROUNDCOLOR = [
  'rgba(255, 99, 132, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 205, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(201, 203, 207, 1)'
];
const BORDERCOLOR = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)'
];
const BORDERWIDTH = 1

function StatisticsPage() {
  const { t } = useTranslation();
  const userInfo = getLoginedUser();

  const chartRef_1 = useRef<HTMLCanvasElement | null>(null);
  const chartRef_2 = useRef<HTMLCanvasElement | null>(null);
  const chartRef_3 = useRef<HTMLCanvasElement | null>(null);
  const chartRef_4 = useRef<HTMLCanvasElement | null>(null);
  const chartRef_5 = useRef<HTMLCanvasElement | null>(null);

  // const chartRef_1_2 = useRef<HTMLCanvasElement | null>(null);
  // const chartRef_2_2 = useRef<HTMLCanvasElement | null>(null);
  // const chartRef_3_2 = useRef<HTMLCanvasElement | null>(null);

  interface LessonSummary {
    [key: string]: { count: number };
  }
  
  const userLessonSummary = useRef<LessonSummary | null>(null);
  const userMusicRecordSummary = useRef<LessonSummary | null>(null);
  const userTaskSummary = useRef<LessonSummary | null>(null);
  const userMusicEnteredSummary = useRef<LessonSummary | null>(null);

  const setUserLessonSummary = (item:LessonSummary) => {
    userLessonSummary.current = item
    initialChart_1()
    initialChart_5()
  }
  const setUserMusicRecordSummary = (item:LessonSummary) => {
    userMusicRecordSummary.current = item
    initialChart_2()
    initialChart_5()
  }
  const setUserTaskSummary = (item:LessonSummary) => {
    userTaskSummary.current = item
    initialChart_3()
    initialChart_5()
  }
  const setUserMusicEnteredSummary = (item:LessonSummary) => {
    userMusicEnteredSummary.current = item
    initialChart_4()
  }

  const getUserLessonSummary = () => {
    return userLessonSummary.current
  }
  const getUserMusicRecordSummary = () => {
    return userMusicRecordSummary.current
  }
  const getUserTaskSummary = () => {
    return userTaskSummary.current
  }
  const getUserMusicEnteredSummary = () => {
    return userMusicEnteredSummary.current
  }

  const initialChart_1 = () => {
    if (getUserLessonSummary() && chartRef_1.current) {
      const data = [];

      let today = new Date();
      // console.log(getUserLessonSummary())
      for (let index = 0; index < 7; index++) {
        const datestr = today.toISOString().substring(0, 10)
        const dayItem = getUserLessonSummary()[datestr]
        const dayVal = (dayItem)?dayItem.count:0

        data.unshift({date: datestr, value: dayVal})
        today.setDate(today.getDate() - 1)
      }

      const chart = Chart.getChart(chartRef_1.current);
      if(chart !== undefined) {
        chart.destroy();
      }
 
      // new Chart(
      //   chartRef_1.current,
      //   {
      //     type: 'line',
      //     data: {
      //       labels: data.map(row => row.date),
      //       datasets: [{
      //           label: t("chart_label_1"),
      //           data: data.map(row => row.value)
      //       }]
      //     },
      //     options: {
      //       maintainAspectRatio: false,
      //       plugins: {
      //         legend: {
      //             display: true,
      //             labels: { font: { size: 16 } },
      //             onClick: () => {}
      //         },
      //         // title: {
      //         //     display: true, 
      //         //     text: t("chart_title_1"),
      //         //     font: { size: 28 }
      //         // }
      //       },
      //       scales: {
      //         x: {
      //             title: { display: true, text: t("chart_scales_date"), font: { size: 16 } },
      //             ticks: { font: { size: 16 } }
      //         },
      //         y: {
      //             title: { display: true, text: t("chart_scales_time"), font: { size: 16 } },
      //             ticks: { font: { size: 16 }, stepSize: 1 }
      //         }
      //       }
      //   },
      //   }
      // );
 
      new Chart(
        chartRef_1.current,
        {
          type: 'pie',
          data: {
            labels: data.map(row => row.date),
            datasets: [{
                label: t("chart_label_1"),
                data: data.map(row => row.value),
                backgroundColor: BACKGROUNDCOLOR
            }]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
              legend: {
                  display: true,
                  labels: { font: { size: 16 } },
                  onClick: () => {}
              },
              title: {
                  display: true, 
                  text: t("chart_title_1"),
                  font: { size: 28 }
              }
            },
            // scales: {
            //   x: {
            //       title: { display: true, text: t("chart_scales_date"), font: { size: 16 } },
            //       ticks: { font: { size: 16 } }
            //   },
            //   y: {
            //       title: { display: true, text: t("chart_scales_time"), font: { size: 16 } },
            //       ticks: { font: { size: 16 }, stepSize: 1 }
            //   }
            // }
        },
        }
      );

    }
  }

  const initialChart_2 = () => {
    if (getUserMusicRecordSummary() && chartRef_2.current) {
      const data = [];

      let today = new Date();
      // console.log(getUserMusicRecordSummary())
      for (let index = 0; index < 7; index++) {
        const datestr = today.toISOString().substring(0, 10)
        const dayItem = getUserMusicRecordSummary()[datestr]
        const dayVal = (dayItem)?dayItem.count:0

        data.unshift({date: datestr, value: dayVal})
        today.setDate(today.getDate() - 1)
      }

      const chart = Chart.getChart(chartRef_2.current);
      if(chart !== undefined) {
        chart.destroy();
      }
 
      // new Chart(
      //   chartRef_2.current,
      //   {
      //     type: 'line',
      //     data: {
      //       labels: data.map(row => row.date),
      //       datasets: [{
      //           label: t("chart_label_2"),
      //           data: data.map(row => row.value)
      //       }]
      //     },
      //     options: {
      //       maintainAspectRatio: false,
      //       plugins: {
      //         legend: {
      //             display: true,
      //             labels: { font: { size: 16 } },
      //             onClick: () => {}
      //         },
      //         // title: {
      //         //     display: true,
      //         //     text: t("chart_title_2"),
      //         //     font: { size: 28 }
      //         // }
      //       },
      //       scales: {
      //         x: {
      //             title: { display: true, text: t("chart_scales_date"), font: { size: 16 } },
      //             ticks: { font: { size: 16 } }
      //         },
      //         y: {
      //             title: { display: true, text: t("chart_scales_time"), font: { size: 16 } },
      //             ticks: { font: { size: 16 }, stepSize: 1 }
      //         }
      //       }
      //   },
      //   }
      // );

      new Chart(
        chartRef_2.current,
        {
          type: 'polarArea',
          data: {
            labels: data.map(row => row.date),
            datasets: [{
                label: t("chart_label_1"),
                data: data.map(row => row.value),
                // backgroundColor: BACKGROUNDCOLOR
            }]
          },
          options: {
            maintainAspectRatio: true,
            plugins: {
              legend: {
                  display: true,
                  labels: { font: { size: 16 } },
                  onClick: () => {}
              },
              title: {
                  display: true, 
                  text: t("chart_title_2"),
                  font: { size: 28 }
              }
            },
            scale: {
              min: 0,
              stepSize: 1,
            },
            // scales: {
            //   x: {
            //       title: { display: true, text: t("chart_scales_date"), font: { size: 16 } },
            //       ticks: { font: { size: 16 } }
            //   },
            //   y: {
            //       title: { display: true, text: t("chart_scales_time"), font: { size: 16 } },
            //       ticks: { font: { size: 16 }, stepSize: 1 }
            //   }
            // }
        },
        }
      );

    }
  }

  const initialChart_3 = () => {
    if (getUserTaskSummary() && chartRef_3.current) {
      const data = [];

      let today = new Date();
      // console.log(getUserTaskSummary())
      for (let index = 0; index < 7; index++) {
        const datestr = today.toISOString().substring(0, 10)
        const dayItem = getUserTaskSummary()[datestr]
        const dayVal = (dayItem)?dayItem.count:0

        data.unshift({date: datestr, value: dayVal})
        today.setDate(today.getDate() - 1)
      }

      const chart = Chart.getChart(chartRef_3.current);
      if(chart !== undefined) {
        chart.destroy();
      }
 
      new Chart(
        chartRef_3.current,
        {
          type: 'line',
          data: {
            labels: data.map(row => row.date),
            datasets: [{
                label: t("chart_label_3"),
                data: data.map(row => row.value),
            }]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: { font: { size: 16 } },
                onClick: () => {}
              },
              title: {
                display: true,
                text: t("chart_title_3"),
                font: { size: 28 }
              }
            },
            scales: {
              x: {
                  title: { display: true, text: t("chart_scales_date"), font: { size: 16 } },
                  ticks: { font: { size: 16 } }
              },
              y: {
                  title: { display: true, text: t("chart_scales_time"), font: { size: 16 } },
                  ticks: { font: { size: 16 }, stepSize: 1 }
              }
            }
        },
        }
      );

    }
  }

  const initialChart_4 = () => {
    if (getUserMusicEnteredSummary() && chartRef_4.current) {
      const data = [];

      // console.log(getUserMusicEnteredSummary())
      for (let item in getUserMusicEnteredSummary()) {
        data.push({
          date: getUserMusicEnteredSummary()[item]["filename"], 
          value: (getUserMusicEnteredSummary()[item]["max"] / getUserMusicEnteredSummary()[item]["totalNote"]) * 100
        })
      }

      const chart = Chart.getChart(chartRef_4.current);
      if(chart !== undefined) {
        chart.destroy();
      }
 
      // data: {
      //   labels: ["File Name"],
      //   datasets: data.map(row => ({
      //       label: row.date,
      //       data: [row.value]
      //   }))
      // },

      new Chart(
        chartRef_4.current,
        {
          type: 'bar',
          data: {
            labels: data.map(row => row.date),
            datasets: [{
                label: t("chart_label_4"),
                data: data.map(row => row.value),
                backgroundColor: BACKGROUNDCOLOR,
                borderColor: BORDERCOLOR,
                borderWidth: BORDERWIDTH
            }]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: { font: { size: 16 } },
                onClick: () => {}
              },
              title: {
                  display: true,
                  text: t("chart_title_4"),
                  font: { size: 28 }
              }
            },
            scales: {
              x: {
                  title: { display: true, text: t("chart_scales_filename"), font: { size: 16 } },
                  ticks: { font: { size: 16 } }
              },
              y: {
                  min: 0, max: 100, 
                  title: { display: true, text: "(%)", font: { size: 16 } },
                  ticks: { font: { size: 16 } }
              }
            }
        },
        }
      );
    }
  }

  const initialChart_5 = () => {
    if (getUserTaskSummary() && getUserMusicRecordSummary() && getUserLessonSummary() && chartRef_5.current) {
      const data = [];

      let today = new Date();
      for (let index = 0; index < 7; index++) {
        const datestr = today.toISOString().substring(0, 10)
        const taskItem = getUserTaskSummary()[datestr]
        const taskVal = (taskItem)?taskItem.count:0

        const musicItem = getUserMusicRecordSummary()[datestr]
        const musicVal = (musicItem)?musicItem.count:0

        const lessonItem = getUserLessonSummary()[datestr]
        const lessonVal = (lessonItem)?lessonItem.count:0

        data.unshift({date: datestr, taskvalue: taskVal, musicvalue: musicVal, lessonvalue: lessonVal})
        today.setDate(today.getDate() - 1)
      }

      const chart = Chart.getChart(chartRef_5.current);
      if(chart !== undefined) {
        chart.destroy();
      }
 
      new Chart(
        chartRef_5.current,
        {
          type: 'radar',
          data: {
            labels: data.map(row => row.date),
            datasets: [
              { label: t("chart_label_3"), data: data.map(row => row.taskvalue) },
              { label: t("chart_label_2"), data: data.map(row => row.musicvalue) },
              { label: t("chart_label_1"), data: data.map(row => row.lessonvalue) },
            ]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: { font: { size: 16 } },
                onClick: () => {}
              },
              title: {
                display: true,
                text: t("chart_title_5"),
                font: { size: 28 }
              }
            },
            scale: {
              min: 0,
              stepSize: 1,
            },
            // scales: {
            //   x: {
            //       title: { display: true, text: t("chart_scales_date"), font: { size: 16 } },
            //       ticks: { font: { size: 16 } }
            //   },
            //   y: {
            //       title: { display: true, text: t("chart_scales_time"), font: { size: 16 } },
            //       ticks: { font: { size: 16 }, stepSize: 1 }
            //   }
            // }
        },
        }
      );

    }
  }

  useEffect(() => {

  }, [userLessonSummary]);

  useEffect(() => {

  }, [userMusicRecordSummary]);
  
  useEffect(() => {

  }, [userTaskSummary]);

  useEffect(() => {

  }, [userMusicEnteredSummary]);

  useEffect(() => {
    user_lesson_count(parseInt(userInfo.user_id)).then((response) => {
      const result = response.data
      if(result.status) {
        const resultData = result.data
        setUserLessonSummary(resultData)
      } else {
        alert(JSON.stringify(result));
      }
    })

    user_music_record_count(parseInt(userInfo.user_id)).then((response) => {
      const result = response.data
      if(result.status) {
        const resultData = result.data
        setUserMusicRecordSummary(resultData)
      } else {
        alert(JSON.stringify(result));
      }
    })

    user_task_count(parseInt(userInfo.user_id)).then((response) => {
      const result = response.data
      if(result.status) {
        const resultData = result.data
        setUserTaskSummary(resultData)
      } else {
        alert(JSON.stringify(result));
      }
    })

    user_music_entered_count(parseInt(userInfo.user_id)).then((response) => {
      const result = response.data
      if(result.status) {
        const resultData = result.data
        setUserMusicEnteredSummary(resultData)
      } else {
        alert(JSON.stringify(result));
      }
    })

    i18next.on('languageChanged', function(lng) {
      // console.log(lng)
      initialChart_1()
      initialChart_2()
      initialChart_3()
      initialChart_4()
      initialChart_5()
    })

  }, []);

  return (
    <>
      <div className="card">
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-6"><div className="statistic-charts-wrapper" style={{"position": "relative", "width": "100%", "height": "100%", "maxWidth": "100%"}}><canvas ref={chartRef_1}></canvas></div></div>
              <div className="col-6"><div className="statistic-charts-wrapper" style={{"position": "relative", "width": "100%", "height": "100%", "maxWidth": "100%"}}><canvas ref={chartRef_2}></canvas></div></div>
            </div>
            <div className="row mb-4">
              <div className="col-6"><div className="statistic-charts-wrapper" style={{"position": "relative", "width": "100%", "height": "100%", "maxWidth": "100%"}}><canvas ref={chartRef_3}></canvas></div></div>
              <div className="col-6"><div className="statistic-charts-wrapper" style={{"position": "relative", "width": "100%", "height": "100%", "maxWidth": "100%"}}><canvas ref={chartRef_5}></canvas></div></div>
            </div>
            <div className="row mb-4">
              <div className="col-12"><div className="statistic-charts-wrapper" style={{"position": "relative", "width": "100%", "height": "600px", "maxWidth": "100%"}}><canvas ref={chartRef_4}></canvas></div></div>
            </div>
          </div>
        </div>
    </>
  );
}

export default StatisticsPage;
