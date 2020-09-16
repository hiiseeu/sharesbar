// 头部大盘指数数据定义
let stockOptions = [{
    id: '1',
    name: '万达电影',
    price: '17.84',
    change: '0.17',
    changeP: '0.96',
    stockType: 'sz',
    stockNum: '002739'
}, {
    id: '2',
    name: '好太太',
    price: '14.18',
    change: '-0.21',
    changeP: '1.50',
    stockType: 'sh',
    stockNum: '603848'
}, {
    id: '3',
    name: '陈志股份',
    price: '13.65',
    change: '0.20',
    changeP: '1.49',
    stockType: 'sz',
    stockNum: '000990'
}];
// let stockOptions = []
// let stockOptions = []
// 如果缓存里有则从缓存获取 自选股列表
if (localStorage.getItem('stockList')) {
    stockOptions = JSON.parse(localStorage.getItem('stockList'))
}

export default stockOptions;