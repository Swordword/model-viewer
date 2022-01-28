import React, { useEffect, useRef } from 'react'
import { Foo } from 'model-viewer'
import './index.css'

const ModelViewer = () => {
  const ref = useRef()
  useEffect(() => {
    const foo = new Foo({
      dom: ref.current,
      type:'glb',
      file:'http://r6ev1zfxk.hn-bkt.clouddn.com/%E5%B0%8F%E7%94%BB%E5%AE%B6%E5%88%86%E7%BB%847.glb'
    })
    foo.load()
  }, [])
  return (
    <div>
      <canvas className='container' ref={ref}></canvas>
    </div>
  )
}

export default ModelViewer
