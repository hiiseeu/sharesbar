export default function checkStockTime() {
    // 只在开市时间同步数据
    const curDate = new Date();
    const monrStartDate = new Date();
    const monrEndDate = new Date();
    const aftStartDate = new Date();
    const aftEndDate = new Date();
    monrStartDate.setHours(9);
    monrStartDate.setMinutes(20);
    monrEndDate.setHours(11);
    monrEndDate.setMinutes(30);
    aftStartDate.setHours(13);
    aftStartDate.setMinutes(0);
    aftEndDate.setHours(15);
    aftEndDate.setMinutes(20);
    if ((curDate >= monrStartDate && curDate <= monrEndDate)
        || (curDate >= aftStartDate && curDate <= aftEndDate)) {
            if(curDate.getDay()!==0 && curDate.getDay()!==6){
                return true;
            }
    } else {
        return false;
    }
}