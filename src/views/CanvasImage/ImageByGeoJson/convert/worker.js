import { drawImage } from './draw'

self.onmessage = function (e) {
  const {
    // beyond,
    geoData, 
    bounds, 
    simpleInfo,
    resolutionRatio,
    colorInfo,
    shadowInfo
  } = e.data
  console.log('主线程的消息：', e.data)

  draw({
    geoData, 
    bounds, 
    simpleInfo,
    resolutionRatio, 
    colorInfo,
    shadowInfo
  })
}

function draw(drawProps) {
  const { resolutionRatio } = drawProps
  const offscreen = new OffscreenCanvas(resolutionRatio.x, resolutionRatio.y)
  const osCanvas = drawImage({ ...drawProps, canvas: offscreen})
  const imageBitmap = osCanvas.transferToImageBitmap();
  self.postMessage({
    beyond: 'worker',
    imageBitmap
  }, [imageBitmap])
}
