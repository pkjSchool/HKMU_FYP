function isBlack(noteNumber: number) : number {
	return (noteNumber + 11) % 12 == 0 ||
		(noteNumber + 8) % 12 == 0 ||
		(noteNumber + 6) % 12 == 0 ||
		(noteNumber + 3) % 12 == 0 ||
		(noteNumber + 1) % 12 == 0
		? 1
		: 0
}


const formatTime = (time:number) => {
    let second = time
    if (second < 0) {second = 0}
    
    let date = new Date(second * 1000);
    let mm = (((date.getUTCHours()*60)+date.getUTCMinutes())+"").padStart(2, '0');
    let ss = (date.getSeconds()+"").padStart(2, '0');
    let ms = (date.getMilliseconds()+"").padStart(3, '0');

    let t = mm+":"+ss+":"+(ms).substring(0, 2);
    return t
  }

export { isBlack, formatTime };