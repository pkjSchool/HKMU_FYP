export const calcLessonStarNumber = (score:number, lessonMaxScore:number) => {
    return Math.floor(score / lessonMaxScore * 2) + 1
}

export const printLessonStar = (score:number, lessonMaxScore:number) => {
    let star = ""
    const number = calcLessonStarNumber(score, lessonMaxScore)
    for (let index = 0; index < number; index++) {
    star += '⭐'
    }
    return star
}