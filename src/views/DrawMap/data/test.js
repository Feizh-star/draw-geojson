// 获取 Canvas 元素
const canvas = document.getElementById('my-canvas');

// 获取 Canvas 2D 上下文
const ctx = canvas.getContext('2d');

// 获取 GeoJSON 数据
const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -73.935242,
          40.730610
        ]
      },
      "properties": {
        "name": "New York City"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -118.243683,
          34.052235
        ]
      },
      "properties": {
        "name": "Los Angeles"
      }
    }
  ]
};

// 定义绘制函数
function drawGeoJSON(data) {
  data.features.forEach(function(feature) {
    if (feature.geometry.type === 'Point') {
      // 将经纬度转换为画布上的坐标
      const coordinates = feature.geometry.coordinates;
      const x = (coordinates[0] + 180) * (canvas.width / 360);
      const y = (canvas.height / 2) - (coordinates[1] * (canvas.height / 180));

      // 绘制点
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();

      // 绘制标签
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(feature.properties.name, x, y - 10);
    }
  });
}

// 调用绘制函数
drawGeoJSON(geojsonData);