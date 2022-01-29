import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const onLoad = () => {}
const onProgress = () => {}
const onError = (error: Error) => {
  console.error(error.message)
}

class Model {
  protected type: any
  protected file: any
  protected scene: THREE.Scene
  protected canvas: HTMLCanvasElement
  protected renderer: THREE.WebGLRenderer
  protected camera: THREE.PerspectiveCamera
  protected rootModel: THREE.Group | undefined
  protected controls: OrbitControls | undefined
  protected clock: THREE.Clock | undefined
  protected animationFrame: number | undefined
  constructor(config: any) {
    const { dom, type, file } = config
    this.type = type
    this.file = file
    this.scene = new THREE.Scene()
    this.canvas = dom
    // init渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // 执行抗锯齿
      antialias: true,
      // 包含透明度
      alpha: true,
      // 设置为可缓存
      preserveDrawingBuffer: true,
    })
    // init相机
    const camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.offsetWidth / this.canvas.offsetHeight,
      0.1,
      1000
    )
    camera.position.set(0, 10, 20)
    this.camera = camera
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  }
  load() {
    const loader = new GLTFLoader()
    loader.load(
      this.file,
      (gltf) => {
        const root = gltf.scene
        this.rootModel = root
        this.scene.add(root)
        this.initLight()
        this.updateCamera()
        this.initControls()
        this.render()
      },
      onProgress,
      (error) => {
        console.error(error)
      }
    )
  }
  /** 根据模型的尺寸调整相机的位置及视距 */
  frameArea(
    sizeToFitOnScreen: number,
    boxSize: number,
    boxCenter: THREE.Vector3,
    camera: THREE.PerspectiveCamera
  ) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5)
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY)
    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize()
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter))
    camera.near = boxSize / 1000
    camera.far = boxSize * 1000
    camera.updateProjectionMatrix()
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
  }
  /** 更新相机 */
  updateCamera() {
    const camera = this.camera!
    const root = this.rootModel!
    const box = new THREE.Box3().setFromObject(root)
    const boxSize = box.getSize(new THREE.Vector3()).length()
    const boxCenter = box.getCenter(new THREE.Vector3())
    this.frameArea(boxSize * 1.2, boxSize, boxCenter, camera)
  }
  initLight() {
    const ambientLight = new THREE.AmbientLight('#ffffff', 1)
    this.scene.add(ambientLight)
  }
  initControls() {
    const root = this.rootModel!
    // 获取模型的尺寸
    const box = new THREE.Box3().setFromObject(root)
    const boxSize = box.getSize(new THREE.Vector3()).length()
    const boxCenter = box.getCenter(new THREE.Vector3())
    console.log('boxSize 添加成功', boxSize)
    console.log('boxCenter 添加成功', boxCenter)
    const orbitControl = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    // 设置控制器最远距离与目标
    orbitControl.maxDistance = boxSize * 10
    orbitControl.target.copy(boxCenter)
    orbitControl.update()
    // 控制器中心
    this.controls = orbitControl
    // 用于更新轨道控制器
    this.clock = new THREE.Clock()
  }
  // 刷新渲染器至图布
  resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = this.canvas
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }
  render() {
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.canvas
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }
    this.renderer.render(this.scene, this.camera!)
    this.animationFrame = requestAnimationFrame(this.render.bind(this))
  }
}

export { Model }
