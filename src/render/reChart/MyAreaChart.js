import React, { PureComponent } from 'react'
import { getData } from '../options/areaData'
import { AreaChart, Area, XAxis, YAxis } from 'recharts'
import {upColor,downColor,midColor} from '../../utils/CustomThemesUtil'

export default class MyAreaChart extends PureComponent {

    render() {
        const data = getData(this.props)
        const max = Math.max.apply(Math, data.map(value => value.p))
        const min = Math.min.apply(Math, data.map(value => value.p))
        const width = this.props.options.chartOptions.width
        const height = this.props.options.chartOptions.height

        let fill = "url(#colorUp)"
        let stroke = upColor
        if (this.props.item.change === 0) {
            fill = "url(#colorMid)"
            stroke = midColor
        } else if (this.props.item.change < 0){
            fill = "url(#colorDown)"
            stroke = downColor
        }
        return (
            <div>
                <AreaChart
                    width={width}
                    height={height}
                    data={data}
                    syncId="anyId"
                    margin={{
                        top: 0, right: 30, left: 5, bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={downColor[5]} stopOpacity={0.5} />
                            <stop offset="95%" stopColor={downColor[5]} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={upColor[5]} stopOpacity={0.5} />
                            <stop offset="100%" stopColor={upColor[5]} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorMid" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={midColor[5]} stopOpacity={0.5} />
                            <stop offset="100%" stopColor={midColor[5]} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis hide={true} />
                    <YAxis hide={true} type='number' domain={[min, max]} />
                    {/* <Tooltip /> */}
                    <Area dataKey="p" stroke={stroke[5]} fillOpacity={1} fill={fill} />
                </AreaChart>
            </div>
        );
    }
}
