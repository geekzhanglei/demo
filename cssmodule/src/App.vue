<template>
  <div :id='$style.app'>
      <div :class="$style.block" >
        <p>这是第一个正方形</p>
      </div>
      <Child></Child>
  </div>
</template>

<script>
import Child from './components/Child.vue'

export default {
  name: 'app',
  components: {
    Child
  }
}
</script>

<style module>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.base {
  width:200px;
  height: 200px;
}
.block {
  composes:base;
  composes:new-block from './my.css';
  background: red;
}
:global(.block) {
  width:200px;
  height: 200px;
  background: greenyellow;
}
</style>

