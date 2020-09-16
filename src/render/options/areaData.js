const data = [
    { p: 441 }, { p: 451 }, { p: 461 }, { p: 441 }, { p: 421 }, { p: 401 }, { p: 441 }, { p: 451 }
]

export function getData(props) {
    const preData = props.item.stockNum ? localStorage.getItem(props.item.stockNum)
        : localStorage.getItem(props.item.name)
    if (preData) {
        const arrData = preData.split("=")
        return arrData.map(row => JSON.parse(row))
    }
    return data
}
export default data