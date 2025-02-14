import { useState, useEffect, useRef } from 'react';
import { user_lesson_count } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import Chart from 'chart.js/auto';

function MorePage() {
  const userInfo = getLoginedUser();

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const [settingRef, setsettingRef] = useState(null)
  interface LessonSummary {
    [key: string]: { count: number };
  }
  
  const [userLessonSummary, setUserLessonSummary] = useState<LessonSummary | null>(null);

  const initialChart = () => {
    if (userLessonSummary && chartRef.current) {
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

      const chart = Chart.getChart(chartRef.current);
      if(chart !== undefined) {
        chart.destroy();
      }
 
      new Chart(
        chartRef.current,
        {
          type: 'bar',
          data: {
            labels: data.map(row => row.date),
            datasets: [
              {
                label: 'Complete Lessons',
                data: data.map(row => row.value)
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
          }
        }
      );
    }
  }

  useEffect(() => {
    initialChart()
  }, [userLessonSummary]);

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
  }, []);

  return (
    <>
    <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "450px", "maxWidth": "100%"}}><canvas ref={chartRef}></canvas></div></div>
            {/* <div className="col-6"><canvas ref={chartRef}></canvas></div> */}
          </div>
        </div>
    </div>
    </>
  );
}

export default MorePage;
