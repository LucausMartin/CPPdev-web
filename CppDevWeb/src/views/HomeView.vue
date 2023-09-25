<template>
    <div class="contanier">
        <ToolBar></ToolBar>
        <Main></Main>
    </div>
</template>
<script setup>
import  ToolBar  from '../components/ToolBar.vue'
import Main from '../components/Main.vue'
</script>

<style lang="less" scoped>
.contanier {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%; 
  flex-direction: column;
}
</style>