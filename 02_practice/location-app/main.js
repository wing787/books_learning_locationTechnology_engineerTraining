import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import OpacityControl from 'maplibre-gl-opacity';
import 'maplibre-gl-opacity/dist/maplibre-gl-opacity.css';

// setting opacity for hazard map
let opacitySets = 0.8;

const map = new maplibregl.Map({
  container: 'map',
  center: [138, 37],
  zoom: 5,
  minZoom: 5,
  maxZoom: 18,
  maxBounds:[122, 20, 154, 50],
    style: {
        version: 8,
        sources: {
                // Define using data on the map
                gsi: {
                    type: 'raster',
                    tiles: ['https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'],
                    tileSize: 256,  // Tile size in pixels, default is 512
                    maxzoom: 19,
                    attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
                },
                //   source hazard map
                hazard_flood: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '&copy; <a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_hightide: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '&copy; <a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_tsunami: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '&copy; <a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_doseki: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '&copy; <a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_kyukeisha: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '&copy; <a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_jisuberi: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '&copy; <a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
            },
        layers: [
            {
                id: 'gsi-layer',
                source: 'gsi',
                type: 'raster',
            },
            
            {
                id: 'hazard-flood-layer',
                source: 'hazard_flood',
                type: 'raster',
                paint: { 'raster-opacity': opacitySets },
            },
            {
                id: 'hazard-hightide-layer',
                source: 'hazard_hightide',
                type: 'raster',
                paint: { 'raster-opacity': opacitySets },
                layout: { visibility: 'none'},
            },
            {
                id: 'hazard-tsunami-layer',
                source: 'hazard_tsunami',
                type: 'raster',
                paint: { 'raster-opacity': opacitySets },
                layout: { visibility: 'none'},
            },
            {
                id: 'hazard-doseki-layer',
                source: 'hazard_doseki',
                type: 'raster',
                paint: { 'raster-opacity': opacitySets },
                layout: { visibility: 'none'},
            },
            {
                id: 'hazard-kyukeisha-layer',
                source: 'hazard_kyukeisha',
                type: 'raster',
                paint: { 'raster-opacity': opacitySets },
                layout: { visibility: 'none'},
            },
            {
                id: 'hazard-jisuberi-layer',
                source: 'hazard_jisuberi',
                type: 'raster',
                paint: { 'raster-opacity': opacitySets },
                layout: { visibility: 'none'},
            },
        ],
    },
});

// Define the event at which the map will be loaded
map.on('load', () => {
    // Control the background-map and tile map
    const opacity = new OpacityControl({
        baseLayers: {
            // layer-id: layer-name
            'hazard-flood-layer': '洪水浸水想定区域',
            'hazard-hightide-layer': '高潮浸水想定区域',
            'hazard-tsunami-layer': '津波浸水想定区域',
            'hazard-doseki-layer': '土石流警戒区域',
            'hazard-kyukeisha-layer': '急傾斜警戒区域',
            'hazard-jisuberi-layer': '地すべり警戒区域',
        } 
    });
    map.addControl(opacity, 'top-left');  // can setting position as second parameter
});