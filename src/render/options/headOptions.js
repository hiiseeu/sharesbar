// 头部大盘指数数据定义
let Options = [{
    id: '1',
    name: '上',
    price: '0.00',
    change: '0.00',
    changeP: '0.00'
}, {
    id: '2',
    name: '深',
    price: '0.00',
    change: '0.00',
    changeP: '0.00'
}, {
    id: '3',
    name: '创',
    price: '0.00',
    change: '0.00',
    changeP: '0.00'
}];
// 如果缓存里有则从缓存获取
if (localStorage.getItem('zs')) {
    Options = JSON.parse(localStorage.getItem('zs'))
}

export default Options;