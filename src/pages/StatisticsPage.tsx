import { useState, useEffect, useRef } from 'react';
import { user_lesson_count, user_music_record_count, user_task_count, user_music_entered_count } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import Chart from 'chart.js/auto';

function StatisticsPage() {
  const userInfo = getLoginedUser();

  const chartRef_1 = useRef<HTMLCanvasElement | null>(null);
  const chartRef_2 = useRef<HTMLCanvasElement | null>(null);
  const chartRef_3 = useRef<HTMLCanvasElement | null>(null);
  const chartRef_4 = useRef<HTMLCanvasElement | null>(null);

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
 
      new Chart(
        chartRef_1.current,
        {
          type: 'line',
          data: {
            labels: data.map(row => row.date),
            datasets: [{
                // label: 'Total Complete Lessons',
                data: data.map(row => row.value)
            }]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true, 
                    text: "Number of lessons Completed Recently",
                    font: { size: 20 }
                }
                
            }
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
 
      new Chart(
        chartRef_2.current,
        {
          type: 'line',
          data: {
            labels: data.map(row => row.date),
            datasets: [
              {
                // label: 'Total Complete Lessons',
                data: data.map(row => row.value)
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Number of music Played Recently",
                    font: { size: 20 }
                }
                
            }
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
                // label: 'Day',
                data: data.map(row => row.value)
            }]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Number of task Finish Recently",
                    font: { size: 20 }
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
        data.push({date: userMusicEnteredSummary[item]["filename"], value: (userMusicEnteredSummary[item]["max"] / userMusicEnteredSummary[item]["totalNote"])*100})
      }

      const chart = Chart.getChart(chartRef_4.current);
      if(chart !== undefined) {
        chart.destroy();
      }
 
      new Chart(
        chartRef_4.current,
        {
          type: 'bar',
          data: {
            labels: data.map(row => row.date),
            datasets: [{
                // label: 'Day',
                data: data.map(row => row.value)
            }]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Best note played accuracy per music (%)",
                    font: { size: 20 }
                }
                
            }
        },
        }
      );
    }
  }

  useEffect(() => {
    initialChart_1()
  }, [userLessonSummary]);

  useEffect(() => {
    initialChart_2()
  }, [userMusicRecordSummary]);
  
  useEffect(() => {
    initialChart_3()
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
            <div className="row">
              <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "450px", "maxWidth": "100%"}}><canvas ref={chartRef_1}></canvas></div></div>
              <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "450px", "maxWidth": "100%"}}><canvas ref={chartRef_2}></canvas></div></div>
            </div>
            <div className="row">
              <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "450px", "maxWidth": "100%"}}><canvas ref={chartRef_3}></canvas></div></div>
              <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "450px", "maxWidth": "100%"}}><canvas ref={chartRef_4}></canvas></div></div>
            </div>
          </div>
      </div>
    </>
  );
}

export default StatisticsPage;
