import { ImageLayer, LineLayer, Scene } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
import stringRandom from 'string-random';

// export function LoadMap(domId){
//     let scene = new Scene({
//         id:domId,
//         map:new GaodeMap({
//             pitch:0,
//             style:'light',
//             center:[114.618,30.457],
//             zoom:15,
//         }),
//         logoVisible:false,
//     });

//     scene.on('loaded',()=>{
//         addLayer(scene);
//     })
// };

// function addLayer(Scene){
//     let layer = new ImageLayer({}).source('/static/Plugins/Imageroy/base.png',{
//         parser:{
//             type:'image',
//             extent:[114.6097,30.4539,114.6236,30.4608]
//         }
//     }).style({
//         opacity:1,
//     });
//     Scene.addLayer(layer);
// }
export class AntvMap {
    constructor(id, center = [114.618, 30.457], pitch = 0, zoom = 15, style = 'light', logoVisible = false) {
        this.scene = null;
        this.id = id;
        this.center = center;
        this.pitch = pitch;
        this.zoom = zoom;
        this.style = style;
        this.logoVisible = logoVisible;
        this.layerDict = {}
    };

    // 加载底图
    loadMap(extent = [114.6097, 30.4539, 114.6236, 30.4608]) {
        this.scene = new Scene({
            id: this.id,
            map: new GaodeMap({
                pitch: this.pitch,
                style: this.style,
                center: this.center,
                zoom: this.zoom
            }),
            logoVisible: this.logoVisible,
        })

        this.scene.on('loaded', () => {
            let layer = new ImageLayer({
                name: 'baseImg'
            }).source('/static/Plugins/Imageroy/base.png', {
                parser: {
                    type: 'image',
                    extent: extent
                }
            }).style({
                opacity: 1
            });

            this.scene.addLayer(layer);
            this.layerDict['baseImg'] = layer;
        })
    }

    // 加载线图层
    addLine(data) {
        try {
            let layer = new LineLayer({
                    name: ('name' in data) ? data.name : stringRandom(8)
                }).source(data.data, {
                    parser: {
                        type: 'json',
                        coordinates: "path"
                    }
                }).size(('size' in data) ? data.size : 1).shape('line')
                .color(('color' in data) ? data.color : '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0"))
                .animate({
                    interval: ('interval' in data) ? data.interval : 0.6,
                    trailLength: ('trailLength' in data) ? data.trailLength : 1.5,
                    duration: ('duration' in data) ? data.duration : 1.5
                });
            this.scene.addLayer(layer);
            this.layerDict[('name' in data) ? data.name : stringRandom(8)] = layer;
        } catch (exception) {
            console.error('添加图层失败:', exception.toString())
        }
    }

    removeLayer(name) {
        this.scene.removeLayer(this.layerDict[name]);
    }

    removeAll() {
        this.scene.removeAllLayer();
    }

}