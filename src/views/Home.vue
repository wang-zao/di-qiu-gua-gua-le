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
import {
  sleeper,
  getOffsetLookAtLat,
} from '@/utils/helper';

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
    scratchesThickness: 0.04,
    waterShiness: 20,
    pointLightIntensity: 0.7,
    ambientLightIntensity: 0.7,
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
          .globeImageUrl('./globe_terrain.jpeg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl('./grey-sky.png')
          .atmosphereColor('#d7f0f6')
          .atmosphereAltitude(0.25)
          .lineHoverPrecision(0)
          .onGlobeReady(() => {
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
            globeMaterial.shininess = this.globe.waterShiness;
        });
        // Auto-rotate
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.35;
        // allow resize
        window.addEventListener('resize', () => {
          world.width(window.innerWidth);
          world.height(window.innerHeight);
        });
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
            .polygonsTransitionDuration(2000)
        }
      },
      clearScratches: (world: any) => {
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
        ambientLight.intensity = this.globe.ambientLightIntensity;
        // adjust directionalLight
        const directionalLight = scene.children.find((obj3d: any) => obj3d.type === 'DirectionalLight');
        directionalLight.intensity = 0;
        // creat a temp ball
        const radius = 500;
        // creat a point light
        const pointLight1 = new THREE.PointLight( 0xffffff, this.globe.pointLightIntensity, 1000 );
        const pointLight2 = new THREE.PointLight( 0xffffff, this.globe.pointLightIntensity, 1000 );
        const pointLight3 = new THREE.PointLight( 0xffffff, this.globe.pointLightIntensity, 1000 );

        pointLight1.position.set( radius, 0, 0 );
        pointLight2.position.set( -0.5*radius, 0.866*radius, 0 );
        pointLight3.position.set( -0.5*radius, -0.866*radius, 5 );
        scene.add( pointLight1, pointLight2, pointLight3 );
      },
    };
    return that;
  }

  dataManager() {
    const that = this;
    return {
      getVoronois: async () => {
        await store.dispatch('loadDataset');
        that.data.voronoi = store.state.voronoiData;
        if (that.data.voronoi) {
          that.data.voronoi.features
            .forEach((d: any) => {
              d.properties.polygonAltitude = that.globe.scratchesThickness;
            })
        }
      },
      reInitVoronoiData: () => {
        const newVoronoi = JSON.parse(JSON.stringify(that.data.voronoi));
        if (newVoronoi) {
          newVoronoi.features
            .forEach((d: any) => d.properties.polygonAltitude = that.globe.scratchesThickness)
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
        this.actionManager().watchRenderScratches();
        this.actionManager().watchUpdateVoroniData();
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
      watchUpdateVoroniData: () => {
        EventBus.$on('updateVoroniData', async (payloads: any) => {
          await that.dataManager().getVoronois();
          payloads();
        });
      },
      watchFlyTo: () => {
        EventBus.$on('flyTo', (city: any) => that.animationManager().flyToPosition({
          delay: 100,
          lat: getOffsetLookAtLat(city.lat, 20),
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