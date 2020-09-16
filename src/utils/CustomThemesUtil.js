import { generate } from '@ant-design/colors';

const upValue = localStorage.getItem('upColor');
const downValue = localStorage.getItem('downColor');
const midValue = localStorage.getItem('midColor');
let upColor;
let downColor;
let midColor;
if (upValue) {
    upColor = generate(upValue);
    downColor = generate(downValue);
    midColor = generate(midValue);
} else {
    localStorage.setItem('upColor', '#cb293e');
    localStorage.setItem('downColor', '#69d321');
    localStorage.setItem('midColor', '#8c8c8c');
    upColor = generate('#cb293e');
    downColor = generate('#69d321');
    midColor = generate('#8c8c8c');
}

export { upColor, downColor, midColor};
