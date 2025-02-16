const sampleTasks = [
    {
        group_id: 1,
        title: "Self Study",
        tasks: [
            { task_id: 1, name: "Accuracy more then 70%", progress: 1, progressPerc: 100, finish_number: 1, is_finished: true },
            { task_id: 2, name: "Play 10 minutes long music", progress: 200, progressPerc: 33, finish_number: 600, is_finished: false },
            { task_id: 3, name: "Get 3000 score", progress: 1500, progressPerc: 50, finish_number: 3000, is_finished: false },
        ],
    },
    {
        group_id: 2,
        title: "Learning",
        tasks: [
            { task_id: 4, name: "Finish 1 lesson", progress: 1, progressPerc: 100, finish_number: 1, is_finished: true },
            { task_id: 5, name: "Finish 2 lesson", progress: 1, progressPerc: 50, finish_number: 2, is_finished: false },
            { task_id: 6, name: "Finish 3 lesson", progress: 1, progressPerc: 33.3, finish_number: 3, is_finished: false },
        ],
    },
];

export default sampleTasks;