import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const onLoad = () => {}
const onProgress = () => {}
const onError = (error: Error) => {
  console.error(error.message)
}

class Foo {
  dom: any
  type: any
  file: any
  scene: new THREE.Scene()
  canvas: any
  renderer: any
  container: any
  camera: any
  constructor(config: any) {
    const { dom, type, file } = config
    const canvas = dom
    this.canvas = canvas
    this.container = canvas
    this.type = type
    this.file = file
    this.init()
  }
  init() {
    // const scene = new THREE.Scene()
    // this.scene = scene
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // 执行抗锯齿
      antialias: true,
      // 包含透明度
      alpha: true,
      // 设置为可缓存
      preserveDrawingBuffer: true,
    })
    this.renderer = renderer
  }
  initCamera() {
    const camera = new THREE.PerspectiveCamera(
      45,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      1000
    )
    camera.position.set(0, 10, 20)
    this.camera = camera
  }
  initLight() {
    const ambientLight = new THREE.AmbientLight('#ffffff', 1)
    this.scene.add(ambientLight)
  }
  render() {
    this.renderer.render(this.scene, this.camera)
  }
  load() {
    const loader = new GLTFLoader()
    loader.load(
      this.file,
      (gltf) => {
        console.log('gltf', gltf)
        this.scene.add(gltf.scene)
        // 初始化相机
        this.initCamera()
        // 初始化光源
        this.initLight()
        this.render()
      },
      onProgress,
      (error) => {
        console.error(error)
      }
    )
  }
}

export { Foo }
