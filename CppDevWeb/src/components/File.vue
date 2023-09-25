<template>
    <details>
        <summary @mousedown="newFile" @click="showFileContent" class="fileTitle">
            <span :class="itemIcon"> {{ rootDirData.name }}</span>
        </summary>
        <File :file="item" v-for="item in rootDirData.children" :key="item.name" :path="myPath"/>
    </details>
</template> 

<script setup>
import { ref, onMounted, onBeforeUpdate } from 'vue';
import { usefileStore } from '../stores/counter.js';
import { storeToRefs } from 'pinia';

const itemIcon = ref("itemDirectoryIcon");

const myPath = ref("")
// 获取每一代文件句柄的内容
const props = defineProps(["file", "path"])
// 将每一代的存在本地使
const rootDirData = ref({})
// 在每一代的 File 组件挂载时都进行排序和本地变量的赋值
const updateRootData = () => {
    rootDirData.value = props.file;
    // 添加唯一路径作为id
    myPath.value = props.path + " > " + props.file.name;
    // 为每一个文件添加唯一路径
    rootDirData.value.path = myPath.value;
    if (rootDirData.value.children) {
        rootDirData.value.children.sort((a, b) => {
            if (a.kind === 'directory' && b.kind === 'file') {
                return -1;
            } else if (a.kind === 'file' && b.kind === 'directory') {
                return 1;
            } else {
                return 0;
            }
        })
    }
    if (rootDirData.value.kind === 'directory') {
        itemIcon.value = "itemDirectoryIcon";
    } else if (rootDirData.value.kind === 'file') {
        itemIcon.value = "itemFileIcon";
    } else {
        return;
    }
}
onBeforeUpdate(() => {
    updateRootData();
})
onMounted(() => {
    updateRootData();
})


const { toggleCodeEditorShow, getFileContentFn } = usefileStore();
const { workFiles } = storeToRefs(usefileStore());

const showFileContent = () => {
    if (rootDirData.value.kind === 'file') {
        // 检查元素是否存在于 workFiles 中
        const isExist = workFiles.value.some((item) => {
            return item.path === rootDirData.value.path;
        })
        if (!isExist) {
            rootDirData.value.isChoosed = true;
            rootDirData.value.isChanged = ref(false);
            workFiles.value.push(rootDirData.value);
            // 遍历 workFiles 中的元素，将其 isChoosed 属性设置为 false
            workFiles.value.forEach((item) => {
                if (item.path !== rootDirData.value.path) {
                    item.isChoosed = false;
                }
            })
        } else {
            // 遍历 workFiles 中的元素，将其 ischoosed 属性设置为 false
            workFiles.value.forEach((item) => {
                if (item.path === rootDirData.value.path) {
                    item.isChoosed = true;
                } else {
                    item.isChoosed = false;
                }
            })
        }
        getFileContentFn(rootDirData.value);
        toggleCodeEditorShow(true);
    }
}

// const newFile = (e) => {
//     if ( e.button === 2 ) {
//         // 创建一个input框
//         const input = document.createElement("input");
//         input.type = "text";
//         input.value = "新建文件";
//         input.style.width = "100%";
//         input.style.height = "100%";
//         input.style.marginTop = "5px";
//         input.style.marginBottom = "2px";
//         // 插入到当前文件夹下面
//         // 先判断有没有input框，如果有就不创建
//         if (e.target.parentNode.children.length === 1) {
//             e.target.parentNode.appendChild(input);
//         }
//     }
// }
</script>

<style lang="less" scoped>
details {
    display: table;
    padding-left: 12px;
    padding-right: 3px;

    &[open]>summary {
        &:only-child {
            background-image: none;
        }

        background-image: url("../assets/rescourse/wuhu1.png");
    }

    summary {
        color: rgb(255, 255, 255);
        list-style: none;
        background: url("../assets/rescourse/wuhu.png") no-repeat;
        background-size: 10px 10px;
        background-position: left;
        padding-left: 13px;
        padding-right: 15px;
        padding-bottom: 5px;

        &:only-child {
            background-image: none;
        }

        &:only-child>span {
            // background: url("../assets/rescourse/file.png") no-repeat;
            background-size: 15px 15px;
            background-position: left;
            padding-left: 22px;
        }

        &:hover {
            background-color: rgba(155, 166, 177, 0.2);
        }

        &:active {
            background-color: rgba(155, 166, 177, 0.4);
        }

        &:focus {
            outline: none;
            background-color: rgba(66, 95, 124, 0.4);
        }
    }

    .itemDirectoryIcon {
        font-size: 15px;
        font-family: "Microsoft YaHei";
        background: url("../assets/rescourse/directory.png") no-repeat;
        background-size: 17px 17px;
        background-position: left;
        padding-left: 22px;
    }

    .itemFileIcon {
        font-size: 15px;
        font-family: "Microsoft YaHei";
        background: url("../assets/rescourse/file.png") no-repeat;
        background-size: 17px 17px;
        background-position: left;
        padding-left: 22px;
    }
}
</style>