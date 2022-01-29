### 3D model viewer

View 3D models on the web, currently supporting gltf/glb formats

### Usage

#### install

use npm：

`npm install @swordword/model-viewer`

or use yarn：

`yarn add @swordword/model-viewer`

#### Use

```html
<canvas id='c'></canvas>
```



```js
import {Model} from '@swordword/model-viewer'
const canvas = document.getElementById('c')
const model = new Model({
    dom: ref.current,
    type:'gltf',
		file: 'https://gltf-file-address'
  })
model.load() 
```

