const a = {
  // 台风路径
  typhoon: {
    defView: {
      latLng: {
        lat: 33.086898808,
        lng: 114.09591,
      },
      zoomLev: 3,
    },
    typhoonLayer: null,
    typCirLayer: null, // 风圈LayerGroup
    typhCirList: {}, // 查询id对应的风圈LayerGroup
    tempIcon: null, // 旋转的gif图标marker
    windLayerList: {}, // 查询id对应的点，线，gif标记...

    timers: null,

    isTyphCir: {}, // 风圈的描述信息：半径相关数值
    typhoonObj, // 台风路径提示
    clearTyphoon(methodData) {
      myMap.removeAllLayer("WarnLine_pop");
      let flag = false;
      if (typeof methodData == "string") {
        flag = true;
      }
      const typhoon = myMap.typhoon;
      clearTimeout(typhoon.timers);
      Object.keys(typhoon.typhCirList).forEach((key) => {
        let has = flag || methodData.find((ele) => (ele = key));
        if (!!has) {
          console.log(typhoon.typhCirList[key]);
          typhoon.typhCirList[key].clearLayers();
          typhoon.windLayerList[key].forEach((r) => {
            typhoon.typhoonLayer.removeLayer(r.e);
          });
          typhoon.tempIcon &&
            typhoon.typhoonLayer.removeLayer(typhoon.tempIcon);
          typhoon.windLayerList[key] = null;
          delete typhoon.typhCirList[key];
        }
      });
    },
    addTyphoon(methodData) {
      // myMap.typhoon.clearTyphoon("all")
      methodData.forEach((item) => {
        let { num_nati, typh_skdata, typh_fcstdata } = item;
        if (num_nati === undefined) {
          num_nati = typh_skdata[0].numNati;
        }
        const typhoon = myMap.typhoon;
        if (!typhoon.typhoonLayer) {
          typhoon.typhoonLayer = new L.LayerGroup(null, {
            attribute: "WarnLine",
          }).addTo(myMap.map);
        }
        let layer = typhoon.typhoonLayer;

        let windListItem = [];
        //创建风圈图层组
        typhoon.typCirLayer = new L.LayerGroup(null, {
          attribute: "WarnLine",
        }).addTo(myMap.map);
        //放进风圈图层组列表列表里
        typhoon.typhCirList[num_nati] = typhoon.typCirLayer;
        const windCircle = (item, layer) => {
          if (typhoon.isTyphCir) {
            layer.clearLayers();
          }
          typhoon.isTyphCir = {
            NE_l7: item.radiuBear1WingA7,
            NE_l10: item.radiuBear1WingA10,
            NW_l7: item.radiuBear2WingA7,
            NW_l10: item.radiuBear2WingA10,
            SE_l7: item.radiuBear3WingA7,
            SE_l10: item.radiuBear3WingA10,
            SW_l7: item.radiuBear4WingA7,
            SW_l10: item.radiuBear4WingA10,
            lat: item.lat,
            lon: item.lon,
          };
          typhCir(typhoon.isTyphCir, layer);
        };

        //台风实况数据
        typh_skdata.map((item, index, arr) => {
          // 画圈
          let circle = L.circleMarker([item.lat, item.lon], {
            stroke: true,
            color: setTypColor(item.typhGrade),
            opacity: 1,
            weight: 1,
            fillColor: setTypColor(item.typhGrade),
            fillOpacity: 1,
            radius: 6,
            pane: "circle",
            attribute: "WarnLine",
          });
          windListItem.push({
            type: "point",
            e: circle,
            point: [item.lat, item.lon],
            data: item,
          });

          // //提示对应信息

          //点击圆圈出现风圈
          circle.off("click").on("click", (e) => {
            windCircle(item, typhoon.typCirLayer);
            typhoon.isTips(circle, typhoon.typhoonObj, item);
          });

          //多个线
          if (index != arr.length - 1) {
            let line = L.polyline(
              [
                [item.lat, item.lon],
                [arr[index + 1].lat, arr[index + 1].lon],
              ],
              {
                color: setTypColor(item.typhGrade),
                weight: 2,
                attribute: "WarnLine",
              }
            );
            windListItem.push({
              type: "line",
              e: line,
            });
          } else {
            // gif图片
            let myIcon = L.icon({
              iconUrl: `./static/img/typhoon/tf1.gif`,
              attribute: "WarnLine",
              iconAnchor: [20, 20],
            });
            let windIcon = L.marker([item.lat, item.lon], {
              icon: myIcon,
              attribute: "WarnLine",
            });
            windListItem.push({
              type: "windIcon",
              e: windIcon,
            });
          }
        });

        const addLine = async () => {
          const addFunc = (element, index) => {
            typhoon.timers = setTimeout(() => {
              element.e.addTo(layer);
              if (element.type === "point") {
                if (typhoon.tempIcon) {
                  // 移除上个旋转的图标
                  layer.removeLayer(typhoon.tempIcon);
                }
                let myIcon = L.icon({
                  iconUrl: `./static/img/typhoon/tf1.gif`,
                  attribute: "WarnLine",
                  iconAnchor: [20, 20],
                });
                typhoon.tempIcon = L.marker(element.point, {
                  attribute: "WarnLine",
                  icon: myIcon,
                });
                typhoon.tempIcon.addTo(layer);

                // 风圈
                windCircle(element.data, typhoon.typCirLayer);
              }
              if (index != windListItem.length - 1) {
                index = index + 1;
                addFunc(windListItem[index], index);
              } else {
                prediction();
              }
            }, 10);
          };
          addFunc(windListItem[0], 0);
          //预报信息
          const prediction = () => {
            if (typh_fcstdata[0]) {
              let lastPoint = typh_skdata[typh_skdata.length - 1];
              let nextPoint = typh_fcstdata[0];
              let dashLine = L.polyline(
                [
                  [lastPoint.lat, lastPoint.lon],
                  [nextPoint.lat, nextPoint.lon],
                ],
                {
                  dashArray: "20",
                  color: setTypColor(lastPoint.typhGrade),
                  weight: 2,
                  attribute: "WarnLine",
                }
              ).addTo(layer);
              windListItem.push({
                type: "point",
                e: dashLine,
              });
            }

            typh_fcstdata.map((i, _index, arr) => {
              // 圆圈
              let circle = L.circleMarker([i.lat, i.lon], {
                stroke: true,
                color: setTypColor(i.typhGrade),
                opacity: 1,
                weight: 1,
                fillColor: setTypColor(i.typhGrade),
                fillOpacity: 1,
                radius: 6,
                attribute: "WarnLine",
                pane: "circle",
              }).addTo(layer);
              let isTyphoonObj = {
                ...myMap.typhoon.typhoonObj,
              };
              isTyphoonObj.fcstHour = ["预报时效", "h"];
              //提示对应信息
              circle.off("click").on("click", (e) => {
                windCircle(i, typhoon.typCirLayer);
                typhoon.isTips(circle, isTyphoonObj, i);
              });
              windListItem.push({
                type: "point",
                e: circle,
                point: [i.lat, i.lon],
                data: i,
              });
              if (_index != arr.length - 1) {
                let line = L.polyline(
                  [
                    [i.lat, i.lon],
                    [arr[_index + 1].lat, arr[_index + 1].lon],
                  ],
                  {
                    color: setTypColor(i.typhGrade),
                    attribute: "WarnLine",
                    weight: 2,
                    dashArray: "20",
                  }
                ).addTo(layer);
                windListItem.push({
                  type: "line",
                  e: line,
                });
              }
            });
          };
        };
        addLine();
        typhoon.windLayerList[num_nati] = windListItem;
      });
      let view = myMap.typhoon.defView;
      if (!!methodData?.length)
        myMap.map.setView([view.latLng.lat, view.latLng.lng], view.zoomLev);
    },
    isTips(example, data, item) {
      function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      item.dataTime = moment(item.dataTime, "YYYYMMDDHHmmss").format(
        "YYYY年MM月DD日 HH:mm"
      );
      var tip =
        "<view style='padding:5px 10px 0px 5px;color:#000;display:flex;flex-direction:column;width:220px'>";
      for (let key in data) {
        tip +=
          "<view style='font-style:normal;font-weight:normal;font-size:14px;line-height:18px;display:flex;'>" +
          data[key][0] +
          "：" +
          ((item[key] + "").includes("999999") //item[key] >= 9999 && typeof item[key] != "string"
            ? ""
            : item[key] +
              data[key][1] +
              (data[key][0] === "台风等级"
                ? "(" + data[key][2][item.typhGrade] + ")"
                : "")) +
          "</view>";
      }

      //  example.on("click", function () {
      try {
        let latlng = [item.lat, item.lon];
        myMap.popLayer = new L.popup({
          // minWidth: 260,
          autoClose: true,
          closeButton: false,
          closeOnEscapeKey: true,
          closeOnClick: true,
          pane: "popupPane",
          autoPan: false,
          attribute: "WarnLine_pop",
          offset: L.point(-myMap.iconheight / 2, -myMap.iconheight),
        }).setLatLng(latlng);
        myMap.popLayer.setContent(tip);
        myMap.popLayer.openOn(myMap.map);
      } catch (error) {}
      //    });

      // example.bindTooltip(tip, {
      //   pane: "top",
      // });
    },
  },
}