<template>
  <div class="home">
    <div id="globeViz"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Globe from 'globe.gl';
import * as d3 from 'd3';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  created() {
    this.renderGlobe();
  }

  renderGlobe() {
    const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

    // GDP per capita (avoiding countries with small pop)
    const getVal = (feat: any) => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

    fetch('./ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
    {
      const maxVal = Math.max(...countries.features.map(getVal));
      colorScale.domain([0, maxVal]);

      const world: any = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
        .polygonAltitude(0.06)
        .polygonCapColor(feat => colorScale(getVal(feat)))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
          Population: <i>${d.POP_EST}</i>
        `)
        .onPolygonHover(hoverD => world
          .polygonAltitude((d: any) => d === hoverD ? 0.12 : 0.06)
          .polygonCapColor((d: any) => d === hoverD ? 'steelblue' : colorScale(getVal(d)))
        )
        .polygonsTransitionDuration(300)
      (document.getElementById('globeViz') as any)
    });
  }
}
</script>
