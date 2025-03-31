import { useState, useEffect, useRef } from 'react';
import { user_lesson_count, user_music_record_count, user_task_count, user_music_entered_count } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import Chart from 'chart.js/auto';

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
  
  const [userLessonSummary, setUserLessonSummary] = useState<LessonSummary | null>(null);
  const [userMusicRecordSummary, setUserMusicRecordSummary] = useState<LessonSummary | null>(null);
  const [userTaskSummary, setUserTaskSummary] = useState<LessonSummary | null>(null);
  const [userMusicEnteredSummary, setUserMusicEnteredSummary] = useState<LessonSummary | null>(null);

  const initialChart_1 = () => {
    if (userLessonSummary && chartRef_1.current) {
      const data = [];

      let today = new Date();
      console.log(userLessonSummary)
      for (let index = 0; index < 7; index++) {
        const datestr = today.toISOString().substring(0, 10)
        const dayItem = userLessonSummary[datestr]
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
      //           label: 'Number of lessons',
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
      //         //     text: "Number Of Lessons Completed Recently",
      //         //     font: { size: 20 }
      //         // }
      //       },
      //       scales: {
      //         x: {
      //             title: { display: true, text: 'Date', font: { size: 16 } },
      //             ticks: { font: { size: 16 } }
      //         },
      //         y: {
      //             title: { display: true, text: 'Times', font: { size: 16 } },
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
                label: 'Number of lessons',
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
                  text: "Number Of Lessons Completed Recently",
                  font: { size: 20 }
              }
            },
            // scales: {
            //   x: {
            //       title: { display: true, text: 'Date', font: { size: 16 } },
            //       ticks: { font: { size: 16 } }
            //   },
            //   y: {
            //       title: { display: true, text: 'Times', font: { size: 16 } },
            //       ticks: { font: { size: 16 }, stepSize: 1 }
            //   }
            // }
        },
        }
      );

    }
  }

  const initialChart_2 = () => {
    if (userMusicRecordSummary && chartRef_2.current) {
      const data = [];

      let today = new Date();
      console.log(userMusicRecordSummary)
      for (let index = 0; index < 7; index++) {
        const datestr = today.toISOString().substring(0, 10)
        const dayItem = userMusicRecordSummary[datestr]
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
      //           label: 'Number of music',
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
      //         //     text: "Number Of Music Played Recently",
      //         //     font: { size: 20 }
      //         // }
      //       },
      //       scales: {
      //         x: {
      //             title: { display: true, text: 'Date', font: { size: 16 } },
      //             ticks: { font: { size: 16 } }
      //         },
      //         y: {
      //             title: { display: true, text: 'Times', font: { size: 16 } },
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
                label: 'Number of lessons',
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
                  text: "Number Of Music Played Recently",
                  font: { size: 20 }
              }
            },
            // scales: {
            //   x: {
            //       title: { display: true, text: 'Date', font: { size: 16 } },
            //       ticks: { font: { size: 16 } }
            //   },
            //   y: {
            //       title: { display: true, text: 'Times', font: { size: 16 } },
            //       ticks: { font: { size: 16 }, stepSize: 1 }
            //   }
            // }
        },
        }
      );

    }
  }

  const initialChart_3 = () => {
    if (userTaskSummary && chartRef_3.current) {
      const data = [];

      let today = new Date();
      console.log(userTaskSummary)
      for (let index = 0; index < 7; index++) {
        const datestr = today.toISOString().substring(0, 10)
        const dayItem = userTaskSummary[datestr]
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
                label: 'Number of tasks',
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
                text: "Number Of Task Finish Recently",
                font: { size: 20 }
              }
            },
            scales: {
              x: {
                  title: { display: true, text: 'Date', font: { size: 16 } },
                  ticks: { font: { size: 16 } }
              },
              y: {
                  title: { display: true, text: 'Times', font: { size: 16 } },
                  ticks: { font: { size: 16 }, stepSize: 1 }
              }
            }
        },
        }
      );

    }
  }

  const initialChart_4 = () => {
    if (userMusicEnteredSummary && chartRef_4.current) {
      const data = [];

      console.log(userMusicEnteredSummary)
      for (let item in userMusicEnteredSummary) {
        data.push({
          date: userMusicEnteredSummary[item]["filename"], 
          value: (userMusicEnteredSummary[item]["max"] / userMusicEnteredSummary[item]["totalNote"]) * 100
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
                label: 'Accuracy',
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
                  text: "Best note played accuracy per music (%)",
                  font: { size: 20 }
              }
            },
            scales: {
              x: {
                  title: { display: true, text: 'Music Filename', font: { size: 16 } },
                  ticks: { font: { size: 16 } }
              },
              y: {
                  min: 0, max: 100, 
                  title: { display: true, text: '(%)', font: { size: 16 } },
                  ticks: { font: { size: 16 } }
              }
            }
        },
        }
      );
    }
  }

  const initialChart_5 = () => {
    if (userTaskSummary && userMusicRecordSummary && userLessonSummary && chartRef_5.current) {
      const data = [];

      let today = new Date();
      for (let index = 0; index < 7; index++) {
        const datestr = today.toISOString().substring(0, 10)
        const taskItem = userTaskSummary[datestr]
        const taskVal = (taskItem)?taskItem.count:0

        const musicItem = userMusicRecordSummary[datestr]
        const musicVal = (musicItem)?musicItem.count:0

        const lessonItem = userLessonSummary[datestr]
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
              { label: 'Number of tasks', data: data.map(row => row.taskvalue) },
              { label: 'Number of music', data: data.map(row => row.musicvalue) },
              { label: 'Number of lessons', data: data.map(row => row.lessonvalue) },
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
                text: "Compare Number Of Lessons, Music Played and Task Finish",
                font: { size: 20 }
              }
            },
            // scales: {
            //   x: {
            //       title: { display: true, text: 'Date', font: { size: 16 } },
            //       ticks: { font: { size: 16 } }
            //   },
            //   y: {
            //       title: { display: true, text: 'Times', font: { size: 16 } },
            //       ticks: { font: { size: 16 }, stepSize: 1 }
            //   }
            // }
        },
        }
      );

    }
  }

  useEffect(() => {
    initialChart_1()
    initialChart_5()
  }, [userLessonSummary]);

  useEffect(() => {
    initialChart_2()
    initialChart_5()
  }, [userMusicRecordSummary]);
  
  useEffect(() => {
    initialChart_3()
    initialChart_5()
  }, [userTaskSummary]);

  useEffect(() => {
    initialChart_4()
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
  }, []);

  return (
    <>
      <div className="card">
          <div className="card-body">
            <div className="row mb-5">
              <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "450px", "maxWidth": "100%"}}><canvas ref={chartRef_1}></canvas></div></div>
              <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "450px", "maxWidth": "100%"}}><canvas ref={chartRef_2}></canvas></div></div>
            </div>
            <div className="row mb-5">
              <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "450px", "maxWidth": "100%"}}><canvas ref={chartRef_3}></canvas></div></div>
              <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "600px", "maxWidth": "100%"}}><canvas ref={chartRef_5}></canvas></div></div>
            </div>
            <div className="row mb-5">
              <div className="col-12"><div style={{"position": "relative", "width": "100%", "height": "600px", "maxWidth": "100%"}}><canvas ref={chartRef_4}></canvas></div></div>
            </div>
          </div>
        </div>
    </>
  );
}

export default StatisticsPage;
