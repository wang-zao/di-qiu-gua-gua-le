<template>
  <div class="home_wrap">
    <div class="globe_base" id="globeViz"
    ></div>
    <global-router
      :currentRoute="currentRoute"
      @handleRouteChange="handleRouteChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Globe from 'globe.gl';
import * as THREE from 'three';
import MainMenu from './Tabs/MainMenu.vue';
import GlobalRouter from './component/GlobalRouter.vue';
import {
  normalMaterial,
} from '@/utils/material';
import { EventBus } from '@/utils/eventBus';
import store from '@/store';
import { sleeper } from '@/utils/helper';
import Fly from '@/utils/fireFly';
// import * as d3 from 'd3';

@Component({
  components: {
    MainMenu,
    GlobalRouter,
  },
})

export default class Home extends Vue {
  currentRoute = 'main-menu'
  globe = {
    threeJsModel: null,
  }
  data = {
    voronoi: null as any,
    currentCityIdx: 0,
  }
  sleeper = sleeper;


  mounted() {
    const render = this.renderInit();
    render.renderGlobe();
    this.actionManager().initWatchers();
  }

  renderInit() {
    const that = {
      renderGlobe: () => {
        const world: any = Globe({
            rendererConfig: {
              powerPreference: "high-performance",
            },
          })
          // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .globeImageUrl('./globe_terrain.jpeg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl('./grey-sky.png')

          // .backgroundColor('#002E94')
          .lineHoverPrecision(0)
          .onGlobeReady(() => {
            console.log('world.scene()', world.scene())
            // directionalLight.intensity = 1
            that.renderClouds(world);
            that.renderLight(world.scene());
            this.globe.threeJsModel = world;
          })
          (document.getElementById('globeViz') as any)
        const globeMaterial = world.globeMaterial();
        globeMaterial.bumpScale = 10;
        new THREE.TextureLoader().load(
          '//unpkg.com/three-globe/example/img/earth-water.png',
          (texture: any) => {
            globeMaterial.specularMap = texture;
            globeMaterial.specular = new THREE.Color('grey');
            globeMaterial.shininess = 15;
        });
        // Auto-rotate
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.35;
        // get voronoi data
        this.dataManager().getVoronois();
      },
      renderScratches: (world: any) => {
        const voronoi = this.data.voronoi;
        if (voronoi) {
          world
            .polygonsData((voronoi as any).features)
            .polygonAltitude((d: any) => d.properties.polygonAltitude)
            .polygonCapCurvatureResolution(10)
            .polygonCapMaterial(normalMaterial)
            .polygonSideColor(() => '#444444')
            .polygonsTransitionDuration(1000)
          console.log('loaded completely')
        }
      },
      clearScratches: (world: any) => {
        console.log('clearScratches')
        world
          .polygonAltitude(-0.1)
      },
      renderClouds: (world: any) => {
        // Add clouds sphere
        const CLOUDS_IMG_URL = './clouds.png'; // from https://github.com/turban/webgl-earth
        const CLOUDS_ALT = 0.009;
        const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

        new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture: any) => {
          const clouds = new THREE.Mesh(
            new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
            new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
          );
          world.scene().add(clouds);

          (function rotateClouds() {
            clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
            requestAnimationFrame(rotateClouds);
          })();
        });
      },
      renderLight: (scene: any) => {
        // adjust ambientLight
        const ambientLight = scene.children.find((obj3d: any) => obj3d.type === 'AmbientLight');
        ambientLight.intensity = 0.5
        // adjust directionalLight
        const directionalLight = scene.children.find((obj3d: any) => obj3d.type === 'DirectionalLight');
        directionalLight.intensity = 0
        // directionalLight && directionalLight.position.set(1, 0, -1);
        // creat a temp ball
        const radius = 500;
        // creat a point light
        const pointLight1 = new THREE.PointLight( 0xffffff, 1, 1000 );
        const pointLight2 = new THREE.PointLight( 0xffffff, 1, 1000 );
        const pointLight3 = new THREE.PointLight( 0xffffff, 1, 1000 );
        pointLight1.position.set( radius, 0, 0 );
        pointLight2.position.set( -0.5*radius, 0.866*radius, 0 );
        pointLight3.position.set( -0.5*radius, -0.866*radius, 5 );
        scene.add( pointLight1, pointLight2, pointLight3 );


        (function rotateLights() {
          const speedIdx = 4000;
          // rotate the point light
          pointLight1.position.set( radius*Math.cos(Date.now()/speedIdx), 0, radius*Math.sin(Date.now()/speedIdx) );
          pointLight2.position.set( -radius*Math.cos(Date.now()/(speedIdx*2)), -radius, radius*Math.sin(Date.now()/(speedIdx*2)) );
          pointLight3.position.set( radius*Math.cos(Date.now()/(speedIdx*2)), radius, radius*Math.sin(Date.now()/(speedIdx*2)) );


          requestAnimationFrame(rotateLights);
        })();
      },
    };
    return that;
  }

  dataManager() {
    const that = this;
    return {
      getVoronois: async () => {
        await store.dispatch('loadDataset');
        console.log('ressss', store.state.cityData)
        that.data.voronoi = store.state.voronoiData;
        if (that.data.voronoi) {
          that.data.voronoi.features
            .forEach((d: any) => d.properties.polygonAltitude = 0.06)
        }
      },
      updataVoronoi: (voronoiData: any) => {
        console.log('updating voronoi', voronoiData)
        that.data.voronoi = voronoiData;
        if (that.data.voronoi) {
          that.data.voronoi.features
            .forEach((d: any) => d.properties.polygonAltitude = 0.06)
        }
        const world = that.globe.threeJsModel;
        (world as any).polygonsData((voronoiData as any).features)
      },
      reInitVoronoiData: () => {
        const newVoronoi = JSON.parse(JSON.stringify(that.data.voronoi));
        if (newVoronoi) {
          newVoronoi.features
            .forEach((d: any) => d.properties.polygonAltitude = 0.06)
        }
        that.data.voronoi = newVoronoi;

      },
      changeRevealedScratchAltitude: (idx: number, value: number)  => {
        const id = that.data.voronoi.features[idx].properties.polygonAltitude = value
      },
    };
  }

  actionManager() {
    const that = this;
    return {
      scratchUpdate: (id: number, altitude: number) => {
        const idx = that.data.voronoi.features.findIndex((d: any) => d.properties.id === id);
        that.dataManager().changeRevealedScratchAltitude(idx, altitude);
        const world = that.globe.threeJsModel;
        const voronoi = that.data.voronoi;
        (world as any).polygonsData((voronoi as any).features)
      },
      initWatchers: () => {
        this.actionManager().watchScratchUp();
        this.actionManager().watchScratchDown();
        this.actionManager().watchScratchOff();
        this.actionManager().watchFlyTo();
        this.actionManager().watchGlobeRotate();
        this.actionManager().watchUpdateVoronoi();
        this.actionManager().watchRenderScratches();
      },
      watchScratchUp: () => {
        EventBus.$on('scratchUp', (id: number) => that.actionManager().scratchUpdate(id, 0.02));
      },
      watchScratchDown: () => {
        EventBus.$on('scratchDown', (id: number) => that.actionManager().scratchUpdate(id, 0.04));
      },
      watchScratchOff: () => {
        EventBus.$on('scratchOff', (id: number) => that.actionManager().scratchUpdate(id, -0.1));
      },
      watchUpdateVoronoi: () => {
        EventBus.$on('updateVoronoi', (voronoiData: any) => that.dataManager().updataVoronoi(voronoiData));
      },
      watchRenderScratches: () => {
        EventBus.$on('renderScratches', async (payloads: any) => {
          // 1. clear all scratches
          const world = that.globe.threeJsModel;
          that.renderInit().clearScratches(world);
          // 2. wait 1000ms for the clean
          await sleeper(1000);
          // 3. change voronoi data if needed

          // 4. reinit voronoi data
          that.dataManager().reInitVoronoiData();
          // 5. render scratches
          await that.renderInit().renderScratches(world);
          payloads();
        });
      },
      watchFlyTo: () => {
        EventBus.$on('flyTo', (city: any) => that.animationManager().flyToPosition({
          delay: 100,
          lat: city.lat,
          lng: city.lon,
          time: 800,
        }));
      },
      watchGlobeRotate: () => {
        EventBus.$on('globeRotate', (value: boolean) => {
          const world = that.globe.threeJsModel;
          (world as any).controls().autoRotate = value;
        });
      },
    };
  }

  animationManager() {
    const that = this;
    return {
      flyToPosition: (config:
        {delay: number, lat: number, lng: number, time: number}
      )  => {
        const world = that.globe.threeJsModel;
        setTimeout(() => {
          if (world) {
            (world as any).pointOfView({
              ...config }, config.time)
          }
        }, config.delay);
      }
    };
  }

  
  handleRouteChange(route: string) {
    this.currentRoute = route;
    if (route === 'main-menu') {
      EventBus.$emit('enableEarthRotation');
    } else if (route === 'playing') {
      EventBus.$emit('disableEarthRotation');
      EventBus.$emit('playAgain');
    }
  }
}
</script>


<style scoped lang="stylus">

.home_wrap
  width 100vw
  height 100vh
  position relative
  .globe_base
    position absolute
    z-index 1
    width 100vw
    height 100vh
    overflow hidden
  .tab_item
    position absolute
    left 50%
    top 90%
    transform translate(-50%, -50%)


    z-index 2
</style>