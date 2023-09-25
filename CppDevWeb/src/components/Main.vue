<template>
    <div class="mainContainer">
        <div class="leftBox">
            <Navigate></Navigate>
            <FileExplorer v-show="fileExplorerShow"></FileExplorer>
        </div>
        <div class="labelRightBox">
            <div v-if="!codeEditorShow" class="rightBox">
                <CodeEditorArea></CodeEditorArea>
            </div>
            <div v-show="codeEditorShow" class="rightBox">
                <CodeEditor></CodeEditor>
            </div>
        </div>
    </div>
</template>

<script  setup>
import Navigate from './Navigate.vue';
import FileExplorer from './FileExplorer.vue';
import CodeEditorArea from './CodeEditorArea.vue';
import CodeEditor from './CodeEditor.vue';
// import { ref } from 'vue';
import { usefileStore } from '../stores/counter.js';
import { storeToRefs } from 'pinia';

// 是否展示代码编辑处
const { codeEditorShow } = storeToRefs(usefileStore());


// 是否展示文件浏览器
const fileExplorerShowStore = usefileStore();
const { fileExplorerShow } = storeToRefs(fileExplorerShowStore);
</script>

<style lang="less" scoped>
.mainContainer {
    overflow: overlay;
    flex: 1;
    display: flex;
    width: 100%;
    background-color: #383838;
    padding: 0;
    margin: 0;

    .leftBox {
        display: flex;
        height: 100%;
        background-color: #383838;
    }

    .labelRightBox {
        overflow: hidden;
        height: 100%;
        width: 100%;
        background-color: #000000;
    }

    .rightBox {
        // position: fixed;
        height: 100%;
        width: 100%;
        background-color: #000000;
    }
}
</style>