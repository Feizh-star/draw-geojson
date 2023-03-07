import * as turf from '@turf/turf'
self.onmessage = function (e) {
  const {
    // beyond,
    geoData, 
    bounds, 
    minArea,
    resolutionRatio,
    backgroundColor,
    lineColor,
  } = e.data
  console.log('主线程的消息：', e.data)

  draw({
    geoData, 
    bounds, 
    minArea,
    resolutionRatio, 
    backgroundColor, 
    lineColor
  })
}

function draw({
  geoData, 
  bounds, 
  minArea,
  resolutionRatio,
  backgroundColor,
  lineColor,
}) {
  const offscreen = new OffscreenCanvas(resolutionRatio.x, resolutionRatio.y)
  const computedBoundInfo = computedBounds(bounds)
  const ctx = offscreen.getContext("2d");
  const coordinates = geoData.features[0].geometry.coordinates

  ctx.fillStyle = backgroundColor || '#FFFFFF'
  ctx.strokeStyle = lineColor || '#000000'
  ctx.lineWidth = 1
  ctx.fillRect(0, 0, resolutionRatio.x, resolutionRatio.y)

  const areas = []
  const time_start = new Date().getTime()
  for (let i = 0; i < coordinates.length; i++) {
    // console.log(coordinates[i][0])
    const line = coordinates[i][0]
    const area = computeArea(line)
    if (area < minArea * 10000000) {
      areas.push(area)
      continue
    }
    drawEdge(offscreen, computedBoundInfo, line)
  }
  const time_end = new Date().getTime()
  console.log('async', time_end - time_start, areas.sort((a, b) => a - b))

  const imageBitmap = offscreen.transferToImageBitmap();
  self.postMessage({
    beyond: 'worker',
    imageBitmap
  }, [imageBitmap])
}

// 计算线条围成的区域的面积
function computeArea(line) {
  const polygon = turf.polygon([line.concat([line[0]])]);
  const area = turf.area(polygon);
  return area
}

// 计算边界和坐标转换参数
function computedBounds(bounds) {
  const { lb, rt } = bounds
  const lngBound = rt[0] - lb[0]
  const latBound = rt[1] - lb[1]
  const lngBoundHalf = lngBound / 2
  const latBoundHalf = latBound / 2
  const lngBoundCenter = (rt[0] + lb[0]) / 2
  const latBoundCenter = (rt[1] + lb[1]) / 2
  return {
    lb, 
    rt,
    lngBound,
    latBound,
    lngBoundHalf,
    latBoundHalf,
    lngBoundCenter,
    latBoundCenter
  }
}

// 定义一个函数，将 GeoJSON 对象转换为 Canvas 上的坐标
function geoJSONToCanvasCoord(geoJSONCoord, computedBoundInfo, canvasWidth, canvasHeight) {
  const [lng, lat] = geoJSONCoord;
  const {
    lngBound,
    latBound,
    lngBoundHalf,
    latBoundHalf,
    lngBoundCenter,
    latBoundCenter
  } = computedBoundInfo
  // const x = (lng + 180) * (canvasWidth / 360);
  // const y = (90 - lat) * (canvasHeight / 180);
  const x = (lng - lngBoundCenter + lngBoundHalf) * (canvasWidth / lngBound);
  const y = ((-(lat - latBoundCenter)) + latBoundHalf) * (canvasHeight / latBound);
  return [x, y];
}
// 绘制一个线条
function drawEdge(canvas, computedBoundInfo, edgeCoords) {
  const ctx = canvas.getContext("2d");
  const [startX, startY] = geoJSONToCanvasCoord(edgeCoords[0], computedBoundInfo, canvas.width, canvas.height);
  // let ctxClose = false
  // ctx.clearRect(0, 0,800,800);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  for (let i = 1; i < edgeCoords.length; i++) {
    const [x, y] = geoJSONToCanvasCoord(edgeCoords[i], computedBoundInfo, canvas.width, canvas.height);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}