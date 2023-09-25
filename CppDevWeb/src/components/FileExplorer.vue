<template>
    <div class="fileExplorerContainer" ref="fileExplorer">
        <button v-if="!alreadyOpen && !loading" class="selectDir" @click="openDirFn">hello directory</button>
        <div v-show="alreadyOpen" class="fileExplorer">
            <div class="fileExplorerTitle">
                <span>File Explorer</span>
            </div>
            <File :file="root" :path="root.name"/>
        </div>
        <div v-show="loading" class="loading">
            <div class="dot" v-for="i in 20" :key="i"></div>
            <div class="loadingText">
                {{ loadingText }}
            </div>
        </div>
    </div>
</template>

<script  setup>
import { ref, watch,onMounted } from 'vue';
import { usefileStore } from '../stores/counter.js';
import { storeToRefs } from 'pinia';
import File from './File.vue';

// 获取文件的状态
const { root, alreadyOpen, loading, fileExplorerWidth } = storeToRefs(usefileStore());
const { openDirFn } = usefileStore();


const loadingText0 = "Loading";
const loadingText1 = "Loading.";
const loadingText2 = "Loading..";
const loadingText3 = "Loading...";
const loadingText = ref(loadingText0);
const timeObj = ref(null);

watch(loading, (val) => {
    if (val) {
        timeObj.value = setInterval(() => {
            if (loadingText.value === loadingText0) {
                loadingText.value = loadingText1;
            } else if (loadingText.value === loadingText1) {
                loadingText.value = loadingText2;
            } else if (loadingText.value === loadingText2) {
                loadingText.value = loadingText3;
            } else if (loadingText.value === loadingText3) {
                loadingText.value = loadingText0;
            }
        }, 500);
    } else {
        clearInterval(timeObj.value);
        loadingText.value = loadingText0;
    }
})

const fileExplorer = ref(null);
// 监视 fileExplorer 大小变化
const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
        const cr = entry.contentRect.width;
        fileExplorerWidth.value = cr;
    }
});


onMounted(() => {
    observer.observe(fileExplorer.value);
})

</script>

<style lang="less" scoped>
@ballSize: 6px; // 小球的大小
@containerSize: 80px; // 容器的大小
@ballNum: 20; // 小球的数量
@pdeg: 360deg / @ballNum; // 每个小球的角度
@time: 2s; // 动画时间

.fileExplorerContainer {
    position: relative;
    min-width: 280px;
    height: 100%;
    background-color: #2b2a2a;
    overflow-y: scroll;

    &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 5px;
        height: 0px;
    }

    &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
    }

    &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #2c2b2b;
    }

    .selectDir {
        position: absolute;
        top: 150px;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #a02727;
        color: #ffffff;
        font-size: 17px;
        font-weight: 600;
        text-align: center;
        padding: 10px;
        border-radius: 8px;

        &:hover {
            background-color: #8d1414;
            color: #ffffff;
            cursor: pointer;
        }

        &:active {
            background-color: #580707;
            color: #dad5d5;
        }
    }

    .fileExplorer {
        display: table;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #2b2a2a;

        .fileExplorerTitle {
            position: relative;
            width: 100%;
            height: 40px;
            background-color: #2b2a2a;
            text-align: left;
            line-height: 40px;
            font-size: 25px;
            font-weight: 900;
            color: #dfdfdf;
            padding-left: 11px;
        }
    }

    .loading {
        // 居中显示
        margin: 0 auto;
        margin-top: 70px;
        width: @containerSize;
        height: @containerSize;
        position: relative;
        border-radius: 50%;

        .loadingText {
            position: absolute;
            left: 50%;
            top: 130px;
            transform: translate(-50%, -50%);
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
        }

        .dot {
            position: absolute;
            left: 50%;
            top: 50%;
            width: @ballSize;
            height: @ballSize;
            margin-left: -(@ballSize / 2);
            margin-top: -(@ballSize / 2);
            perspective: 70px;
            transform-style: preserve-3d;

            &::before,
            &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }

            &::before {
                background: #2dc9f0;
                top: 100%;

            }

            &::after {
                background: #e426d4;
                top: -100%;
            }

        }
    }
}

.loop(@i) when (@i <=@ballNum) {
    .dot:nth-child(@{i}) {
        transform: rotate((@pdeg * @i)) translateY(-(@containerSize / 2));

        &::before {
            animation: moveWhite @time infinite -(6 * @time * (@i / @ballNum));
        }

        &::after {
            animation: moveBlack @time infinite -(6 * @time * (@i / @ballNum));
        }
    }

    .loop(@i + 1);
}

.loop(1);

@keyframes moveBlack {
    0% {
        animation-timing-function: ease-in;
    }

    25% {
        transform: translate3d(0, 100%, @ballSize);
        animation-timing-function: ease-out;
    }

    50% {
        transform: translate3d(0, 200%, 0);
        animation-timing-function: ease-in;
    }

    75% {
        transform: translate3d(0, 100%, -@ballSize);
        animation-timing-function: ease-out;
    }
}

@keyframes moveWhite {
    0% {
        animation-timing-function: ease-in;
    }

    25% {
        transform: translate3d(0, -100%, -@ballSize);
        animation-timing-function: ease-out;
    }

    50% {
        transform: translate3d(0, -200%, 0);
        animation-timing-function: ease-in;
    }

    75% {
        transform: translate3d(0, -100%, @ballSize);
        animation-timing-function: ease-out;
    }
}
</style>