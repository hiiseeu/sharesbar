export default function checkStockTime() {
    // 只在开市时间同步数据
    const curDate = new Date();
    const monrStartDate = new Date();
    const monrEndDate = new Date();
    const aftStartDate = new Date();
    const aftEndDate = new Date();
    monrStartDate.setHours(9);
    monrStartDate.setMinutes(27);
    monrEndDate.setHours(11);
    monrEndDate.setMinutes(30);
    aftStartDate.setHours(13);
    aftStartDate.setMinutes(0);
    aftEndDate.setHours(15);
    aftEndDate.setMinutes(1);

    // 清理缓存
    clearStockDate()

    if ((curDate >= monrStartDate && curDate <= monrEndDate)
        || (curDate >= aftStartDate && curDate <= aftEndDate)) {
        if (curDate.getDay() !== 0 && curDate.getDay() !== 6) {
            return true;
        }
    } else {
        return false;
    }
}

function clearStockDate() {
    const updateDate = localStorage.getItem("updateDate")
    if (JSON.stringify(new Date().getDate()) !== updateDate && updateDate) { //说明是前一天的数据，清理前一天的数据
        const stockStr = localStorage.getItem("mystock");
        if (stockStr) {
            const arrData = stockStr.split("=")
            if (!arrData[0]) {
                arrData.shift(); //删除头部空数组
            }
            arrData.forEach((row, index) => {
                row = JSON.parse(row)
                if (typeof row === 'string') {
                    row = JSON.parse(row)
                }
                localStorage.removeItem(row.stockNum.substring(2))
            })
        }
        localStorage.removeItem("上")
        localStorage.removeItem("深")
        localStorage.removeItem("创")
        localStorage.setItem("updateDate", new Date().getDate())
    }
}