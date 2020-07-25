# 电子时钟组件

** 这是一个电子时钟组件，动态显示当前时间

### 使用

```javascript
import { TimeCanvas } from '@/components/TimeCanvas'
export default {
    components: {
        timeCanvas: TimeCanvas
    }
}

```

```html
    <time-canvas width="300" height="100" x="10" y="10" radius="0.5"></time-canvas>
```

### 参数说明

参数名| 类型| 说明 | 默认值 |
------| ----- | ----- | ----- |
width  | Number/String | canvas宽度  | 300
height  | Number/String | canvas高度 | 100
x       | Number/String | 离 canvas 原点的坐标值 x | 30
y       | Number/String | 离 canvas 原点的坐标值 y | 30
radius  | Number/String | 圆的半径 | 1

