// 定义一个表示岛屿的 GeoJSON 对象
const islandGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          
        ]
      }
    }
  ]
};
// import worldMerge from './worldMerge.json'
// const world: any = worldMerge
// import taiwansheng from './台湾省.json'
// const taiwan: any = taiwansheng
export interface IBounds {
  // lngBounds: Array<number>
  // latBounds: Array<number>
  lb: [number, number]
  rt: [number, number]
}
export interface IBoundsRes extends IBounds {
  lngBound: number
  latBound: number
  lngBoundHalf: number
  latBoundHalf: number
  lngBoundCenter: number
  latBoundCenter: number
}
// 定义一个函数，将 GeoJSON 对象转换为 Canvas 上的坐标
function geoJSONToCanvasCoord(geoJSONCoord: number[], computedBoundInfo: IBoundsRes, canvasWidth: number, canvasHeight: number): [number, number] {
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
function computedBounds(bounds: IBounds): IBoundsRes {
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

export function drawGeo(canvas: HTMLCanvasElement, geoData: any, bounds: IBounds):void {
  const computedBoundInfo: IBoundsRes = computedBounds(bounds)
  console.log(computedBoundInfo)
  const canvasContainerWidth = parseFloat(getComputedStyle(canvas).width)
  const canvasContainerHeight = parseFloat(getComputedStyle(canvas).height)
  const ctx = canvas.getContext("2d") as any;
  const coordinates = geoData.features[0].geometry.coordinates

  // 设置 Canvas 大小
  // canvas.width = canvasContainerWidth;
  // canvas.height = canvasContainerHeight;
  canvas.width = 800;
  canvas.height = 800;

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  const time_start = new Date().getTime()
  for (let i = 0; i < coordinates.length; i++) {
    // console.log(coordinates[i][0])
    drawEdge(canvas, computedBoundInfo, coordinates[i][0])
  }
  const time_end = new Date().getTime()
  console.log(time_end - time_start)
}

function drawEdge(
  canvas: HTMLCanvasElement,
  computedBoundInfo: IBoundsRes, 
  edgeCoords: Array<Array<number>>
):void {
  const ctx = canvas.getContext("2d") as any;
  const { lb, rt } = computedBoundInfo
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

// if (
//   edgeCoords[i][0] > rt[0] || 
//   edgeCoords[i][0] < lb[0] ||
//   edgeCoords[i][1] > rt[1] ||
//   edgeCoords[i][1] < lb[1]
// ) {
//   if (!ctxClose) {
//     // ctx.closePath();
//     ctx.stroke();
//     ctxClose = !ctxClose
//   }
//   ctx.stroke();
//   continue
// }
// if (ctxClose) {
//   ctxClose = !ctxClose
//   const [newStartX, newStartY] = geoJSONToCanvasCoord(edgeCoords[i - 1], computedBoundInfo, canvas.width, canvas.height);
//   ctx.beginPath();
//   ctx.moveTo(newStartX, newStartY);
// }