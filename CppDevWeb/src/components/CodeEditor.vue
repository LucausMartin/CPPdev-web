<template>
    <div class="codeContainer">
        <CodePageNavigation></CodePageNavigation>
        <div class="code">
            <CodePageColumn></CodePageColumn>
        </div>
    </div>
</template>

<script  setup>
import CodePageNavigation from './CodePageNavigation.vue';
import CodePageColumn from './CodePageColumn.vue';
</script>

<style lang="less" scoped>
.codeContainer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fa0606;

    .code {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        background-color: aqua;
    }
}
</style>