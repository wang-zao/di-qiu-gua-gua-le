<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="stylus">
@import './assets/font.css';


body
  padding 0
  margin 0
  
body,html
  position fixed
  top 0
  left 0
  margin 0
  width 100%
  height 100%
  overflow hidden

#app
  font-family 'tengxiangjialidayuan', 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  padding 0

#nav
  padding 0
  a
    font-weight bold
    color #2c3e50
    &.router-link-exact-active
      color #42b983
</style>
