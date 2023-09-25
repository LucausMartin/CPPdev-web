<template>
    <div ref="workFileContainer" @wheel="scrollXEvent" class="pageNav">
        <div style="background-color: #353434;" v-for="item in workFiles" :key="item.path">
            <div v-show="item.isChoosed" class="workFileContainer2">
                <div class="workFileContent2">
                    {{ item.name }}
                </div>
                <div v-show="false">
                    {{ item.path }}
                </div>
                <button v-if="!item.isChanged.value" ref="closeBtn" @click.stop="closeWorkFile($event, item)"
                    class="workFileClose">×</button>
                <div v-show="false">
                    {{ item.path }}
                </div>
                <button v-if="item.isChanged.value" class="unsaveBtn" @click.stop="closeWorkFile($event, item)">•</button>
            </div>
            <div v-show="!item.isChoosed" @click="changeFile($event, item)" class="workFileContainer1">
                <div class="workFileContent1">
                    {{ item.name }}
                </div>
                <div v-show="false">
                    {{ item.path }}
                </div>
                <button v-if="!item.isChanged.value" ref="closeBtn" @click.stop="closeWorkFile1($event, item)"
                    class="workFileClose">×</button>
                <div v-show="false">
                    {{ item.path }}
                </div>
                <button v-if="item.isChanged.value" class="unsaveBtn" @click.stop="closeWorkFile1($event, item)">•</button>
            </div>
        </div>
        <div class="runCode">
            <a @click="changeStyleShowFileExplorer" @mouseenter="enterChangeCompileIconStyle" href="#"
                @mouseleave="leaveChangeCompileIconStyle" onclick="return false">
                <img class="compile" @click="compile" src="../assets/rescourse/compile.png" alt="compile... ctrl + n"
                    title="compile... ctrl + r">
            </a>
            <a @click="changeStyleShowFileExplorer" @mouseenter="enterChangeSaveIconStyle" href="#"
                @mouseleave="leaveChangeSaveIconStyle" onclick="return false">
                <img class="save" @click="saveFile()" src="../assets/rescourse/save1.png" alt="save... ctrl + s"
                    title="save... ctrl + s">
            </a>
        </div>
    </div>
    <div class="pathNav">
        {{ counterPath.split(/\>(.+)/)[1] }}
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usefileStore } from '../stores/counter';
import { storeToRefs } from 'pinia';

const { counterPath, workFiles, codeEditorShow, fileContent } = storeToRefs(usefileStore());
const { getFileContentFn, saveFileContent } = usefileStore();
const workFileContainer = ref(null);
const closeWorkFile = async (e, item) => {
    if (item.isChanged.value) {
        let result = confirm("文件未保存，是否保存？");
        console.log(result);
        if (result) {
            // 保存文件
            saveFileContent(2);
            // 以兄弟节点的内容进行过滤
            workFiles.value = workFiles.value.filter(item => item.path !== e.target.previousSibling.innerText);
            if (workFiles.value.length === 0) {
                codeEditorShow.value = false;
            } else {
                workFiles.value.forEach(item => {
                    item.isChoosed = false;
                })
                workFiles.value[0].isChoosed = true;
                getFileContentFn(workFiles.value[0]);
            }
        } else {
            // 以兄弟节点的内容进行过滤
            workFiles.value = workFiles.value.filter(item => item.path !== e.target.previousSibling.innerText);
            if (workFiles.value.length === 0) {
                codeEditorShow.value = false;
            } else {
                workFiles.value.forEach(item => {
                    item.isChoosed = false;
                })
                workFiles.value[0].isChoosed = true;
                getFileContentFn(workFiles.value[0]);
            }
        }
    } else {
        // 以兄弟节点的内容进行过滤
        workFiles.value = workFiles.value.filter(item => item.path !== e.target.previousSibling.innerText);
        if (workFiles.value.length === 0) {
            codeEditorShow.value = false;
        } else {
            workFiles.value.forEach(item => {
                item.isChoosed = false;
            })
            workFiles.value[0].isChoosed = true;
            getFileContentFn(workFiles.value[0]);
        }
    }
}

const closeWorkFile1 = (e, item) => {
    if (item.isChanged.value) {
        let result = confirm("文件未保存，是否保存？");
        if (result) {
            // 保存文件
            saveFileContent(2);
            item.isChanged.value = false;
            // 以兄弟节点的内容进行过滤
            workFiles.value = workFiles.value.filter(item => item.path !== e.target.previousSibling.innerText);
        } else {
            item.isChanged.value = false;
            // 以兄弟节点的内容进行过滤
            workFiles.value = workFiles.value.filter(item => item.path !== e.target.previousSibling.innerText);
        }
    } else {
        // 以兄弟节点的内容进行过滤
        workFiles.value = workFiles.value.filter(item => item.path !== e.target.previousSibling.innerText);
    }
}

const scrollXEvent = (e) => {
    workFileContainer.value.scrollLeft += e.deltaY / 4;
}

const changeFile = (event, item) => {
    // 遍历所有的文件，将所有的文件的 isChoosed 设置为 false
    workFiles.value.forEach(item => {
        item.isChoosed = false;
    })
    // 将当前点击的文件的 isChoosed 设置为 true
    item.isChoosed = true;
    getFileContentFn(item)
}

const enterChangeCompileIconStyle = () => {
    document.querySelector('.compile').src = new URL('../assets/rescourse/compile1.png', import.meta.url);
}
const leaveChangeCompileIconStyle = () => {
    document.querySelector('.compile').src = new URL('../assets/rescourse/compile.png', import.meta.url);
}
const enterChangeSaveIconStyle = () => {
    document.querySelector('.save').src = new URL('../assets/rescourse/save.png', import.meta.url);
}
const leaveChangeSaveIconStyle = () => {
    document.querySelector('.save').src = new URL('../assets/rescourse/save1.png', import.meta.url);
}

const saveFile = async () => {
    let flag = await saveFileContent(2);
    if (flag) {
        alert('保存成功');
        // 在 workFiles 中找到当前文件，将 isChanged 设置为 false
        workFiles.value.forEach(item => {
            if (item.path === fileContent.value.path) {
                item.isChanged.value = false;
            }
        })
    } else {
        alert('保存失败');
    }
}

const { sendFileToBackground } = usefileStore();
const { message, outputShow } = storeToRefs(usefileStore());
// 发送请求，将文件内容发送到后端
const compile = async () => {
    outputShow.value = true;
    await sendFileToBackground(fileContent.value);
}
</script>

<style lang="less" scoped>  .pageNav {
      display: flex;
      // 横向排列元素
      flex-direction: row;
      min-height: 36.5px;
      width: calc(100% - 100px);
      height: 39px;
      background-color: #353434;
      overflow-x: auto;
      overflow-y: hidden;

      &::-webkit-scrollbar {
          /*滚动条整体样式*/
          height: 5px;
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

      .runCode {
          width: 100px;
          height: 36.5px;
          background-color: aqua;
          position: absolute;
          right: 0px;
          background-color: #353434;

          .compile {
              width: 27px;
              height: 27px;
              // 垂直居中
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 5px;
              right: 15px;
          }

          .save {
              width: 27px;
              height: 27px;
              // 垂直居中
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              right: 50px;
              top: 5px;
          }
      }


      .workFileContainer1 {
          height: 100%;
          // 垂直居中
          display: flex;
          align-items: center;
          justify-content: space-around;
          background-color: #313030;
          min-width: 120px;
          color: aliceblue;
          margin-right: 2px;

          &:hover {
              background-color: #444343;
          }

          &:active {
              background-color: #1e1e1e;
          }

          .workFileContent1 {
              margin-left: 10px;
              // 文字撑满元素，不允许换行和溢出
              white-space: nowrap;
              text-overflow: ellipsis;
          }
      }

      .workFileContainer2 {
          height: 100%;
          // 垂直居中
          display: flex;
          align-items: center;
          justify-content: space-around;
          background-color: #1e1e1e;
          min-width: 120px;
          margin-right: 2px;
          color: aliceblue;

          .workFileContent2 {
              margin-left: 10px;
              // 文字撑满元素，不允许换行和溢出
              white-space: nowrap;
              text-overflow: ellipsis;
          }
      }


      .workFileClose {
          // 垂直居中
          display: flex;
          align-items: center;
          justify-content: center;
          width: 17px;
          height: 17px;
          // 圆角
          border-radius: 20%;
          margin-left: 10px;
          margin-right: 8px;
          background: none;
          color: #9c9b9b;
          font-size: 20px;

          &:hover {
              background-color: #444343;
          }

          &:active {
              background-color: #000000;
          }
      }

      .unsaveBtn {
          // 垂直居中
          display: flex;
          align-items: center;
          justify-content: center;
          width: 17px;
          height: 17px;
          // 圆角
          border-radius: 20%;
          margin-left: 10px;
          margin-right: 8px;
          background: none;
          color: #9c9b9b;
          font-size: 40px;
          color: rgb(182, 55, 55);

          &:hover {
              background-color: #444343;
          }

          &:active {
              background-color: #000000;
          }
      }
  }

  .pathNav {
      width: 100%;
      height: 25px;
      color: rgb(170, 170, 170);
      padding-left: 20px;
      font-family: 'Consolas';
      background-color: #1e1e1e;
      // 文字撑满元素，不允许换行和溢出
      white-space: nowrap;
      text-overflow: ellipsis;
  }
</style>