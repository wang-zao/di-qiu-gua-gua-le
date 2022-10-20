<template>
  <div class="home_wrap">
    <div class="globe_base" id="globeViz"></div>
    <!-- <main-menu class="tab_item"
      @btnClicked="() => actionManager().btnClicked()"
    /> -->
    
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
import { EventBus } from '@/utils/eventBus';
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
    scratchRevealedIdList: [] as number[],
    threeJsModel: null,
  }
  data = {
    voronoi: null as any,
    currentCityIdx: 0,
  }


  mounted() {
    const render = this.renderInit();
    render.renderGlobe();
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
            that.renderScratches(world);
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
      },
      renderScratches: async (world: any) => {
        // const response = await fetch('./voronoi_mature.geojson')
        await this.dataManager().getVoronoi();
        const voronoi = this.data.voronoi;
        if (voronoi) {
          const material = new THREE.MeshPhongMaterial({
            shininess: 5,
            color: '#666666',
            // emissive: '#1c1c1c',
            specular: '#888888',
            reflectivity: 0.5,
            flatShading: true,
            transparent: true,
            opacity: 1,
          });
          world
            .polygonsData((voronoi as any).features.filter(this.dataManager().filterByRevealList))
            .polygonAltitude((d: any) => d.properties.polygonAltitude)
            .polygonCapCurvatureResolution(10)
            .polygonCapMaterial(material)
            .polygonSideColor(() => '#444444')
            .polygonsTransitionDuration(2000)
        }
      },
      renderClouds: (world: any) => {
        // Add clouds sphere
        const CLOUDS_IMG_URL = './clouds.png'; // from https://github.com/turban/webgl-earth
        const CLOUDS_ALT = 0.009;
        const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

        new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture: any) => {
          const clouds = new THREE.Mesh(
            new THREE.SphereBufferGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
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
        ambientLight.intensity = 1
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
      }
    };
    return that;
  }

  dataManager() {
    const that = this;
    return {
      getVoronoi: async () => {
        const response = await fetch('./voronoi_mature.geojson')
        that.data.voronoi = await response.json();
        if (that.data.voronoi) {
          that.data.voronoi.features
            .sort((a: any, b: any) => a.properties.id - b.properties.id)
            .forEach((d: any) => d.properties.polygonAltitude = 0.02)
        }
        console.log('that.data.voronoi.features', that.data.voronoi.features.map((i: any) => i.properties.id))
      },
      addRevealedScratch: (idx: number)  => {
        const id = that.data.voronoi.features[idx].properties.id;
        that.globe.scratchRevealedIdList.push(id);
      },
      changeRevealedScratchAltitude: (idx: number)  => {
        const id = that.data.voronoi.features[idx].properties.polygonAltitude = -0.1;
        // that.globe.scratchRevealedIdList.push(id);
      },
      filterByRevealList: (d: any) => {
        // console.log('filterByRevealList', d.properties.id)
        // console.log('!(this.globe.scratchRevealedIdList as number[]).includes(d.properties.id)', !(this.globe.scratchRevealedIdList as number[]).includes(d.properties.id))
        return !this.globe.scratchRevealedIdList.includes(d.properties.id);
      }
    };
  }

  actionManager() {
    const that = this;
    return {
      btnClicked: ()  => {
        // that.dataManager().addRevealedScratch(that.data.currentCityIdx)
        that.dataManager().changeRevealedScratchAltitude(that.data.currentCityIdx)
        that.data.currentCityIdx += 1;
        console.log('btnClicked!', that.data.currentCityIdx)
        const world = that.globe.threeJsModel;
        const voronoi = that.data.voronoi;
        console.log('world!', world)
        console.log('voronoi!', voronoi)
        console.log('voronoi!', (voronoi as any).features.filter(
              this.dataManager().filterByRevealList
            ))
        if (world && voronoi) {
          // update voronoi data
          (world as any)
            .polygonsData((voronoi as any).features.filter(
              this.dataManager().filterByRevealList
            ))
          // fly to next place
          const nextCity = that.data.voronoi.features[that.data.currentCityIdx]
          that.animationManager().flyToPosition({
            delay: 800,
            lat: nextCity.properties.lat,
            lng: nextCity.properties.lon,
            time: 800,
          })
        }

      }
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
  .tab_item
    position absolute
    left 50%
    top 90%
    transform translate(-50%, -50%)


    z-index 2
</style>