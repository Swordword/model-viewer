### 三维模型查看器

在web端查看三维模型，目前支持 gltf/glb 格式

### 使用方法

#### 安装

使用 npm：

`npm install @swordword/model-viewer`

或者使用 yarn：

`yarn add @swordword/model-viewer`

#### 使用

```html
<canvas id='c'></canvas>
```

```js
import {Model} from '@swordword/model-viewer'
const canvas = document.getElementById('c')
const model = new Model({
    dom: canvas,
    type:'gltf',
    file: 'https://gltf-file-address'
  })
model.load() 
```

