import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import OpacityControl from 'maplibre-gl-opacity';
import 'maplibre-gl-opacity/dist/maplibre-gl-opacity.css';
import { useGsiTerrainSource } from 'maplibre-gl-gsi-terrain';

import distance from '@turf/distance';

// setting opacity for hazard map
let opacitySets = 0.75;

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
                gsi_pale: {
                    type: 'raster',
                    tiles: ['https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'],
                    tileSize: 256,  // Tile size in pixels, default is 512
                    maxzoom: 19,
                    attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
                },
                //   source hazard map
                hazard_flood: {
                    type: 'raster',
                    tiles: ['	https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_hightide: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_tsunami: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_doseki: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_kyukeisha: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                hazard_jisuberi: {
                    type: 'raster',
                    tiles: ['https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png'],
                    minzoom: 2,
                    maxzoom: 17,
                    tileSize: 256,
                    attribution: '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>',
                },
                skhb: {
                    // Vector tiles of the skhb
                    type: 'vector',
                    tiles: [`${location.href.replace('/index.html', '')}/skhb/{z}/{x}/{y}.pbf`,],
                    minzoom: 5,
                    maxzoom: 8,
                    attribution: '<a href="https://www.gsi.go.jp/bousaichiri/hinanbasho.html" target="_blank">国土地理院:指定緊急避難場所データ</a>'
                },
                route: {
                    // The Line what join current position and nearest featrues
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [],
                    },
                },
            },
        layers: [
            {
                id: 'gsi-layer',
                source: 'gsi',
                type: 'raster',
                layout: { visibility: 'none'},
            },
            {
                id: 'gsi-pale-layer',
                source: 'gsi_pale',
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
            {
                id: 'skhb-1-layer',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                    'circle-radius':[
                        // Circle size in zoom level
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        14, 6
                    ],
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#ffffff',
                },
                filter: ['==', 'disaster1', '1'],
            },
            {
                id: 'skhb-2-layer',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                    'circle-radius':[
                        // Circle size in zoom level
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        14, 6
                    ],
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#ffffff',
                },
                filter: ['==', 'disaster2', '1'],
                layout: { visibility: 'none'},
            },
            {
                id: 'skhb-3-layer',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                    'circle-radius':[
                        // Circle size in zoom level
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        14, 6
                    ],
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#ffffff',
                },
                filter: ['==', 'disaster3', '1'],
                layout: { visibility: 'none'},
            },
            {
                id: 'skhb-4-layer',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                    'circle-radius':[
                        // Circle size in zoom level
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        14, 6
                    ],
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#ffffff',
                },
                filter: ['==', 'disaster4', '1'],
                layout: { visibility: 'none'},
            },
            {
                id: 'skhb-5-layer',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                    'circle-radius':[
                        // Circle size in zoom level
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        14, 6
                    ],
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#ffffff',
                },
                filter: ['==', 'disaster5', '1'],
                layout: { visibility: 'none'},
            },
            {
                id: 'skhb-6-layer',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                    'circle-radius':[
                        // Circle size in zoom level
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        14, 6
                    ],
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#ffffff',
                },
                filter: ['==', 'disaster6', '1'],
                layout: { visibility: 'none'},
            },
            {
                id: 'skhb-7-layer',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                    'circle-radius':[
                        // Circle size in zoom level
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        14, 6
                    ],
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#ffffff',
                },
                filter: ['==', 'disaster7', '1'],
                layout: { visibility: 'none'},
            },
            {
                id: 'skhb-8-layer',
                source: 'skhb',
                'source-layer': 'skhb',
                type: 'circle',
                paint: {
                    'circle-radius':[
                        // Circle size in zoom level
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        14, 6
                    ],
                    'circle-stroke-width': 0.3,
                    'circle-stroke-color': '#ffffff',
                },
                filter: ['==', 'disaster8', '1'],
                layout: { visibility: 'none'},
            },
            {
                // 
                id: 'route-layer',
                source: 'route',
                type: 'line',
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 4,
                    'line-dasharray': [5, 5],
                    'line-width': 5,
                },
            },
        ],
    },
});

// The variable to store the user's location data
let userLocation = null;

// The function to get the user's location data of Maplibre GL JS
const geolocationControl = new maplibregl.GeolocateControl({
   trackUserLocation: true, 
});
map.addControl(geolocationControl, 'bottom-right');
geolocationControl.on('geolocate', (e) => {
    // 
    userLocation = [e.coords.longitude, e.coords.latitude];
});

// 現時点で選択されている指定緊急避難場所レイヤー(skhb)を特定しそのfilter条件を返す
const getCurrentSkhbLayerFilter = () => {
    const style = map.getStyle();
    const skhbLayers = style.layers.filter((layer) =>
        // `skhb`から始まるLayerを抽出
        layer.id.startsWith('skhb'),
    );
    const visibleSkhbLayers = skhbLayers.filter(
        (layer) => layer.layout.visibility === 'visible',
    );
    return visibleSkhbLayers[0].filter;
};

// 経緯度を渡すと最寄りの指定緊急避難場所を返す
const getNearestFeature = (longitude, latitude) => {
    // 現在表示中の指定緊急避難場所のタイルデータ(=地物)を取得する
    const currentSkhbLayerFilter = getCurrentSkhbLayerFilter();
    const features = map.querySourceFeatures('skhb', {
        sourceLayer: 'skhb',
        filter: currentSkhbLayerFilter,// 表示中のレイヤーのfilter条件に合致する条件のみを抽出
    });

    // 現在地に最も近い地物を見つける
    const nearestFeature = features.reduce((minDistFeature, feature) => {
        const dist = distance(
            [longitude, latitude],
            feature.geometry.coordinates,
        );
        if (minDistFeature === null || minDistFeature.properties.dist > dist)
            // 1つ目の地物、もしくは現在の地物が最寄りの場合は最寄りデータを使用
            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    dist,    
                },
            };

        return minDistFeature;
    }, null);

    return nearestFeature;
};

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

    // Control the skhb-layers
    const opacitySkhb = new OpacityControl({
       baseLayers: {
           'skhb-1-layer': '洪水',
           'skhb-2-layer': '崖崩れ/土石流/地すべり',
           'skhb-3-layer': '高潮',
           'skhb-4-layer': '地震',
           'skhb-5-layer': '津波',
           'skhb-6-layer': '大規模な火事',
           'skhb-7-layer': '内水氾濫',
           'skhb-8-layer': '火山現象',
       },
    });

    map.addControl(opacity, 'top-left');  // can setting position as second parameter
    map.addControl(opacitySkhb, 'top-right');

    

    // The event to drag the map
    map.on('drag', (e) => {
        map.getCanvas().style.cursor = 'move';
    });

    // The event to click on the map
    map.on('click', (e) => {
        // Check to exist the layer in the click point
        const features = map.queryRenderedFeatures(e.point, {
           layers: [
               'skhb-1-layer',
               'skhb-2-layer',
               'skhb-3-layer',
               'skhb-4-layer',
               'skhb-5-layer',
               'skhb-6-layer',
               'skhb-7-layer',
               'skhb-8-layer',
           ], 
        });
        // if nothing features, End process
        if (features.length == 0) return;

        // if exist features, show the popup
        const feature = features[0];  // get the first feature
        const popup = new maplibregl.Popup()
            .setLngLat(feature.geometry.coordinates)  // [lon, lat]
            // 
            .setHTML(
                `\
            <div style="font-weight: 900; font-size: 1rem;">${
                feature.properties.name
            }</div>\
            <div>${feature.properties.address}</div>\
            <div>\
            <span${
                feature.properties.disaster1 ? '' : ' style="color: #ccc;"'
            }">洪水</span>\
            <span${
                feature.properties.disaster2 ? '' : ' style="color: #ccc;"'
            }">崖崩れ/土石流/地すべり</span>\
            <span${
                feature.properties.disaster3 ? '' : ' style="color: #ccc;"'
            }">高潮</span>\
            <span${
                feature.properties.disaster4 ? '' : ' style="color: #ccc;"'
            }">地震</span>\
            <span${
                feature.properties.disaster5 ? '' : ' style="color: #ccc;"'
            }">津波</span>\
            <span${
                feature.properties.disaster6 ? '' : ' style="color: #ccc;"'
            }">大規模な火事</span>\
            <span${
                feature.properties.disaster7 ? '' : ' style="color: #ccc;"'
            }">内水氾濫</span>\
            <span${
                feature.properties.disaster8 ? '' : ' style="color: #ccc;"'
            }">火山現象</span>\
            </div>`,
            )
            .addTo(map);
    });
    // The event to move cursor on the map
    map.on('mousemove', (e) => {
        // Check to exist the layer in the click point
        const features = map.queryRenderedFeatures(e.point, {
           layers: [
               'skhb-1-layer',
               'skhb-2-layer',
               'skhb-3-layer',
               'skhb-4-layer',
               'skhb-5-layer',
               'skhb-6-layer',
               'skhb-7-layer',
               'skhb-8-layer',
           ], 
        });
        if (features.length > 0) {
            // if exist features, cursor to pointer
            map.getCanvas().style.cursor = 'pointer';
        } else {
            // if not exist features, cursor to default
            map.getCanvas().style.cursor = 'default';
        }
    });
    
    //
    map.on('render', () => {
        // If Off GeolocationControl, 
        if (geolocationControl._watchState === 'OFF') userLocation = null;
        
        // 
        if (map.getZoom() < 7 || userLocation === null) {
            map.getSource('route').setData({
                type: 'FeatureCollection',
                features: [],
            });
            return;
        }

        // Get the nearest feature where position
        const nearestFeature = getNearestFeature(
            userLocation[0], 
            userLocation[1]
        );
        // The GeoJSON feature of line to join with current position & nearest feature
        const routeFeature = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [
                    userLocation,
                    nearestFeature._geometry.coordinates,
                ],
            },
        };
        // Update the geojson data of style.sources.route
        map.getSource('route').setData({
            type: 'FeatureCollection',
            features: [routeFeature],
        });
    });

    // Generate topologinc data (GSI terrain tile)
    const gsiTerrainSource = useGsiTerrainSource(maplibregl.addProtocol);
    // Add topologic data to the map(type=raster-dem)
    map.addSource('terrain', gsiTerrainSource);

    // Add shading chart
    map.addLayer(
        {
            id: 'hillshade',
            source: 'terrain',
            type: 'hillshade',
            paint: {
                'hillshade-illumination-anchor': 'map',
                'hillshade-exaggeration': 0.2,
            },
        },
        'hazard-jisuberi-layer',
    );

    // Add 3dmap
    map.addControl(
        new maplibregl.TerrainControl({
            source: 'terrain',  // The source id of type="raster-dem"
            exaggeration: 1,
        }),
    );
});