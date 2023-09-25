<template>
    <div class="navContainer">
        <ul class="iocnoNav">
            <li>
                <a @click="changeStyleShowFileExplorer" @mouseenter="enterChangeIconStyle" href="#"
                    @mouseleave="leaveChangeIconStyle" onclick="return false">
                    <img id="dir" class="directoryImg" src="../assets/rescourse/directory0.png" ref="fileExplorerIcon">
                </a>
            </li>
        </ul>
    </div>
</template>

<script  setup>
import { usefileStore } from '../stores/counter';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

// 获取文件资源管理器图标 DOM 元素
const fileExplorerIcon = ref(null);
// 鼠标进入和离开图标时改变图标样式
const enterChangeIconStyle = () => {
    if (fileExplorerShow.value) {
    } else {
        fileExplorerIcon.value.src = new URL("../assets/rescourse/directory1.png", import.meta.url);
    }
}
const leaveChangeIconStyle = () => {
    if (fileExplorerShow.value) {
    } else {
        fileExplorerIcon.value.src = new URL("../assets/rescourse/directory0.png", import.meta.url);
    }
}


// 获取文件资源管理器显示状态
const { fileExplorerShow } = storeToRefs(usefileStore());
const { toggleFileExplorerShow } = usefileStore();
// 改变文件资源管理器显示状态并且改变图标样式
const changeStyleShowFileExplorer = () => {
    if (fileExplorerShow.value) {
        toggleFileExplorerShow(false);
        fileExplorerIcon.value.src = new URL("../assets/rescourse/directory0.png", import.meta.url);
    } else {
        toggleFileExplorerShow(true);
        fileExplorerIcon.value.src = new URL("../assets/rescourse/directory1.png", import.meta.url);
    }
}



// 监听文件资源管理器显示状态改变图标样式
watch(fileExplorerShow, (newValue) => {
    if (newValue === true) {
        fileExplorerIcon.value.src = new URL("../assets/rescourse/directory1.png", import.meta.url);
    } else {
        fileExplorerIcon.value.src = new URL("../assets/rescourse/directory0.png", import.meta.url);
    }
})
</script>

<style lang="less" scoped>
.navContainer {
    position: relative;
    min-width: 52px;
    height: 100%;
    background-color: #383838;

    .directoryImg {
        width: 33px;
        height: 33px;
    }

    .iocnoNav {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translate(-50%);

        li {
            list-style: none;
            margin-bottom: 15px;
        }
    }


}
</style>