<template>
    <div class="toolContainer">
        <img class="symbol" src="../assets/rescourse/CodeSandbox1.png" alt="">
        <div class="fileDown">
            <button @click="showFileDown">File</button>
            <div tabindex="-1" @blur="hiddenDown" v-show="downContent.fileDownContent" class="DownContent" ref="fileDown">
                <p @click="showFileExplorerFile">Open&nbsp;File...</p>
                <p @click="showFileExplorerDirectory">Open&nbsp;Folder...</p>
                <p>Save...</p>
                <p>Save as...</p>
            </div>
        </div>
        <div class="editDown">
            <button @click="showEditDown">Edit</button>
            <div tabindex="-1" @blur="hiddenDown" v-show="downContent.editDownContent" class="DownContent" ref="editDown">
                <p>Undo...</p>
                <p>Redo...</p>
                <p>Cut...</p>
                <p>Copy...</p>
                <p>Paste...</p>
            </div>
        </div>
        <div class="viewDown">
            <button @click="showViewFileDown">View</button>
            <div tabindex="-1" @blur="hiddenDown" v-show="downContent.viewDownContent" class="DownContent" ref="viewDown">
                <p>Command&nbsp;Palette...</p>
                <p>Open&nbsp;View...</p>
                <p>Search...</p>
            </div>
        </div>
        <div class="outputDown">
            <button @click="showOutputDown">Output</button>
            <div tabindex="-1" @blur="hiddenDown" v-show="downContent.outputContent" class="DownContent" ref="outputDown">
                <p @click="isOutputShow">Output&nbsp;Show...</p>
                <!-- <p>Open&nbsp;View...</p>
                <p>Search...</p> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import { usefileStore } from '../stores/counter';
import { storeToRefs } from 'pinia';


// 下拉框内容是否显示的变量
const downContent = ref({
    fileDownContent: false,
    editDownContent: false,
    viewDownContent: false,
    outputContent: false
});
// 获取下拉框 DOM 元素
const fileDown = ref(null);
const editDown = ref(null);
const viewDown = ref(null);
const outputDown = ref(null);
// 点击事件后显示下拉框并且获取下拉框焦点
const showFileDown = () => {
    downContent.value.fileDownContent = !downContent.value.fileDownContent;
    downContent.value.editDownContent = false;
    downContent.value.viewDownContent = false;
    downContent.value.outputContent = false;
    nextTick(() => {
        fileDown.value.focus();
    })
};
const showEditDown = () => {
    downContent.value.editDownContent = !downContent.value.editDownContent;
    downContent.value.fileDownContent = false;
    downContent.value.viewDownContent = false;
    downContent.value.outputContent = false;
    nextTick(() => {
        editDown.value.focus();
    });
};
const showViewFileDown = () => {
    downContent.value.viewDownContent = !downContent.value.viewDownContent;
    downContent.value.fileDownContent = false;
    downContent.value.editDownContent = false;
    downContent.value.outputContent = false;
    nextTick(() => {
        viewDown.value.focus();
    });
};

const showOutputDown = () => {
    downContent.value.outputContent = !downContent.value.outputContent;
    downContent.value.fileDownContent = false;
    downContent.value.editDownContent = false;
    downContent.value.viewDownContent = false;
    nextTick(() => {
        outputDown.value.focus();
    });
};


// 点击其他地方隐藏下拉框公共事件
const hiddenDown = () => {
    downContent.value.fileDownContent = false;
    downContent.value.editDownContent = false;
    downContent.value.viewDownContent = false;
    downContent.value.outputContent = false;
};

const { toggleFileExplorerShow, openDirFn, openFileFn } = usefileStore();
const { outputShow } = storeToRefs(usefileStore());

const isOutputShow = () => {
    outputShow.value = !outputShow.value;
}

const showFileExplorerDirectory = () => {
    fileDown.value.blur();
    toggleFileExplorerShow(true);
    openDirFn();
}

const showFileExplorerFile = () => {
    fileDown.value.blur();
    toggleFileExplorerShow(true);
    openFileFn();
}
</script>

<style lang="less" scoped>
.toolContainer {
    display: flex;
    position: relative;
    width: 100%;
    height: 35px;
    background-color: #414141;

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-family: 'Microsoft YaHei', sans-serif;
        position: relative;
        top: 50%;
        min-width: 34px;
        height: 22px;
        background-color: #414141;
        color: #ebe8e8;
        border-radius: 5px;
        transform: translateY(-50%);
        margin-left: 10px;

        &:hover {
            background-color: #5e5c5c;
        }

        &:active {
            background-color: #807d7d;
        }
    }

    .symbol {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        background-color: #414141;
        margin-left: 10px;
    }

    .fileDown {
        position: relative;
        display: inline-block;

    }

    .editDown {
        position: relative;
        display: inline-block;
    }

    .viewDown {
        position: relative;
        display: inline-block;
    }

    .outputDown {
        position: relative;
        display: inline-block;
    }

    .DownContent {
        z-index: 1;
        position: absolute;
        top: 31px;
        left: 6px;
        background-color: #2e2e2e;
        border-radius: 5px;
        box-shadow: 1px 1px 4px 1px rgba(250, 248, 248, 0.2);

        p {
            padding-left: 7px;
            padding-right: 7px;
            padding-top: 3px;
            padding-bottom: 3px;
            font-size: 13px;
            font-family: 'Microsoft YaHei', sans-serif;
            color: #ebe8e8;

            &:hover {
                background-color: #474747;
            }

            &:active {
                background-color: #5e5e5e;
            }
        }
    }

}
</style>