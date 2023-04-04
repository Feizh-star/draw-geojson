import L from 'leaflet'
// 台风风圈
export function drawCircle(TF, typCirLayer) {
	// 求出方位半径方向上弧形经纬度
	const getPoints = (center, cradius, startAngle) => {
		let radius = cradius / 100;
		let pointNum = 90;
		let endAngle = startAngle + 90;
		let points = [];
		let sin;
		let cos;
		let x;
		let y;
		let angle;

		for (var i = 0; i <= pointNum; i++) {
			angle = startAngle + ((endAngle - startAngle) * i) / pointNum;
			sin = Math.sin((angle * Math.PI) / 180);
			cos = Math.cos((angle * Math.PI) / 180);
			x = center[0] + radius * sin;
			y = center[1] + radius * cos;
			points.push([x, y]);
		}
		return points;
	};

	let r7Ne = getPoints([TF.lat, TF.lon], TF.NE_l7 == 999999 ? 0 : TF.NE_l7, 0);
	let r7Nw = getPoints([TF.lat, TF.lon], TF.NW_l7 == 999999 ? 0 : TF.NW_l7, 90);
	let r7Sw = getPoints(
		[TF.lat, TF.lon],
		TF.SW_l7 == 999999 ? 0 : TF.SW_l7,
		180
	);
	let r7Se = getPoints(
		[TF.lat, TF.lon],
		TF.SE_l7 == 999999 ? 0 : TF.SE_l7,
		270
	);
	// console.log(r7Ne)
	let polygon7 = L.polygon(
		[
			...r7Ne, // 东北
			...r7Nw, // 西北
			...r7Sw, // 西南
			...r7Se, // 东南
		], {
			smoothFactor: 0.1,
			fillColor: "rgb(0, 176, 15)",
			color: "rgb(0, 176, 15)",
			weight: 1,
		}
	);
	let r10Ne = getPoints(
		[TF.lat, TF.lon],
		TF.NE_l10 == 999999 ? 0 : TF.NE_l10,
		0
	);
	let r10Nw = getPoints(
		[TF.lat, TF.lon],
		TF.NW_l10 == 999999 ? 0 : TF.NW_l10,
		90
	);
	let r10Sw = getPoints(
		[TF.lat, TF.lon],
		TF.SW_l10 == 999999 ? 0 : TF.SW_l10,
		180
	);
	let r10Se = getPoints(
		[TF.lat, TF.lon],
		TF.SE_l10 == 999999 ? 0 : TF.SE_l10,
		270
	);
	let polygon10 = L.polygon(
		[
			...r10Ne, // 东北
			...r10Nw, // 西北
			...r10Sw, // 西南
			...r10Se, // 东南
		], {
			smoothFactor: 0.1,
			fillColor: "rgb(248, 213, 0)",
			color: "rgb(248, 213, 0)",
			weight: 1,
		}, {
			pane: "img",
		}
	);
	typCirLayer && polygon10.addTo(typCirLayer);
	typCirLayer && polygon7.addTo(typCirLayer);
	return {
		polygon7,
		polygon10,
	};
}

// 根据台风等级不同渲染颜色
export function setTypColor(level) {
	var color;
	switch (level) {
		case "TD":
			color = "#30FC31";
			break; //6~7
		case "TS":
			color = "#307EFA";
			break; //8~9
		case "STS":
			color = " #FEFB00";
			break; //10~11
		case "TY":
			color = " #FF9C00";
			break; //12~13
		case "STY":
			color = " #FB7CFF";
			break; //14~15
		case "Super TY":
			color = " #FA3030";
			break; //16~
		case "超强台风(Super TY)":
			color = " #FA3030";
			break; //16~
		default:
			break;
	}
	return color;
}