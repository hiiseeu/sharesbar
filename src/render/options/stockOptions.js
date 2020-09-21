// 头部大盘指数数据定义
let stockOptions = [];
// 如果缓存里有则从缓存获取 自选股列表
if (localStorage.getItem('stockList')) {
    stockOptions = JSON.parse(localStorage.getItem('stockList'))
}

export default stockOptions;