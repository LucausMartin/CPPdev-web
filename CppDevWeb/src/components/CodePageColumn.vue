<template>
    <div class="codeColumnRoot">
        <div class="codeEdit">
            <div class="codeContainer">
                <div @keydown.ctrl.s.prevent="saveFile" @keydown.ctrl.r.prevent="runCode" class="monaco" ref="MonacoEditor">
                </div>
            </div>
            <div v-show="outputShow" ref="father" class="father">
                <div ref="tem" class="tem"></div>
                <div ref="ter" class="output">
                    <pre id="terminal">{{ message }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as monaco from 'monaco-editor';
import { usefileStore } from '../stores/counter';
import { storeToRefs } from 'pinia';
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';


const { cppContent, fileExplorerShow, workFiles, fileContent, mmm, message, fileExplorerWidth, outputShow } = storeToRefs(usefileStore());


// 编辑器实例
let instance = null;
// 获取编辑器容器
const MonacoEditor = ref(null);
// 初始化编辑器配置项
const editorOptions = ref({
    language: "cpp", // 支持语言
    theme: "vs-dark", // vs, hc-black, or vs-dark 主题
    /*  */
    fontSize: 16, // 字体大小
    // lineNumbers: 'on', // 行号
    // selectOnLineNumbers: false, // 行号选中
    // glyphMargin: true, // 字形边距
    // quickSuggestionsDelay: 500, // 快速建议延迟
    // useTabStops: false, // 使用TabStops
    /**
     * 更多配置项
     * Detail: https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html
     */
    // acceptSuggestionOnCommitCharacter: true, // 接受关于提交字符的建议
    // acceptSuggestionOnEnter: 'on', // 接受输入建议 "on" | "off" | "smart"
    // accessibilityPageSize: 10, // 辅助功能页面大小 Number 说明：控制编辑器中可由屏幕阅读器读出的行数。警告：这对大于默认值的数字具有性能含义。
    // accessibilitySupport: 'on', // 辅助功能支持 控制编辑器是否应在为屏幕阅读器优化的模式下运行。
    // autoClosingBrackets: 'always', // 是否自动添加结束括号(包括中括号) "always" | "languageDefined" | "beforeWhitespace" | "never"
    // autoClosingDelete: 'always', // 是否自动删除结束括号(包括中括号) "always" | "never" | "auto"
    // autoClosingOvertype: 'always', // 是否关闭改写 即使用insert模式时是覆盖后面的文字还是不覆盖后面的文字 "always" | "never" | "auto"
    // autoClosingQuotes: 'always', // 是否自动添加结束的单引号 双引号 "always" | "languageDefined" | "beforeWhitespace" | "never"
    // autoIndent: 'None', // 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
    // automaticLayout: true, // 自动布局
    // codeLens: false, // 是否显示codeLens 通过 CodeLens，你可以在专注于工作的同时了解代码所发生的情况 – 而无需离开编辑器。 可以查找代码引用、代码更改、关联的 Bug、工作项、代码评审和单元测试。
    // codeLensFontFamily: '', // codeLens的字体样式
    // codeLensFontSize: 14, // codeLens的字体大小
    // colorDecorators: false, // 呈现内联色彩装饰器和颜色选择器
    // comments: {
    //   ignoreEmptyLines: true, // 插入行注释时忽略空行。默认为真。
    //   insertSpace: true // 在行注释标记之后和块注释标记内插入一个空格。默认为真。
    // }, // 注释配置
    contextmenu: true, // 启用上下文菜单
    // columnSelection: false, // 启用列编辑 按下shift键位然后按↑↓键位可以实现列选择 然后实现列编辑
    // autoSurround: 'never', // 是否应自动环绕选择
    // copyWithSyntaxHighlighting: true, // 是否应将语法突出显示复制到剪贴板中 即 当你复制到word中是否保持文字高亮颜色
    // cursorBlinking: 'Solid', // 光标动画样式
    // cursorSmoothCaretAnimation: true, // 是否启用光标平滑插入动画  当你在快速输入文字的时候 光标是直接平滑的移动还是直接"闪现"到当前文字所处位置
    // cursorStyle: 'UnderlineThin', // "Block"|"BlockOutline"|"Line"|"LineThin"|"Underline"|"UnderlineThin" 光标样式
    // cursorSurroundingLines: 0, // 光标环绕行数 当文字输入超过屏幕时 可以看见右侧滚动条中光标所处位置是在滚动条中间还是顶部还是底部 即光标环绕行数 环绕行数越大 光标在滚动条中位置越居中
    // cursorSurroundingLinesStyle: 'all', // "default" | "all" 光标环绕样式
    // cursorWidth: 2, // <=25 光标宽度
    // minimap: {
    //   enabled: false // 是否启用预览图
    // }, // 预览图设置
    // folding: true, // 是否启用代码折叠
    // links: true, // 是否点击链接
    // overviewRulerBorder: false, // 是否应围绕概览标尺绘制边框
    // renderLineHighlight: 'gutter', // 当前行突出显示方式
    // roundedSelection: false, // 选区是否有圆角
    // scrollBeyondLastLine: false, // 设置编辑器是否可以滚动到最后一行之后
    // readOnly: false // 是否为只读模 式
})
// 初始化编辑器
const initMonacoEditor = () => {
    instance = monaco.editor.create(MonacoEditor.value, {
        value: cppContent.value,
        ...editorOptions.value
    })
    instance.onDidChangeModelContent(() => {
        const newValue = instance.getValue()
        if (newValue !== cppContent.value) {
            cppContent.value = newValue
            // 在 workFiles 中找到当前文件， 并且修改文件对象的 ischanged 值
            workFiles.value.forEach((item) => {
                if (item.path === fileContent.value.path) {
                    item.isChanged.value = true;
                    item.newCppContent = cppContent.value;
                }
            })
        }
    })
}
watch(mmm, () => {
    // 在 workFiles 中找到当前文件， 并且修改文件对象的 ischanged 值
    workFiles.value.forEach((item) => {
        if (item.path === fileContent.value.path) {
            if (item.isChanged.value) {
                cppContent.value = item.newCppContent;
            }
        }
    })
    if (showCode.value) {
        instance.dispose()
        initMonacoEditor()
        nextTick(() => {
            instance.layout()
        })
    } else {
        initMonacoEditor();
        showCode.value = true;
        nextTick(() => {
            instance.layout()
        })
    }
})

let showCode = ref(false);

// 监视文件管理器是否显示并且重新布局编辑器
watch(fileExplorerShow, () => {
    if (instance) {
        nextTick(() => {
            instance.layout()
        })
    }
})

const ter = ref(null);
const tem = ref(null);
const father = ref(null);
// 监视窗口大小变化并且重新布局编辑器
onMounted(() => {
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        if (instance) {
            instance.layout()
        }
    })
    ter.value.style.width = '100%';

    let startY = 0;
    let startHeight = 0;

    tem.value.addEventListener("mousedown", (e) => {
        e.preventDefault();
        startY = e.pageY;
        startHeight = father.value.offsetHeight;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
    });

    function resize(e) {
        const deltaY = e.pageY - startY;
        father.value.style.height = startHeight - deltaY + "px";
        ter.value.style.height = startHeight - deltaY + "px";
    }

    function stopResize() {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
})

onBeforeUnmount(() => {
    if (instance) {
        instance.dispose()
    }
})

watch(fileExplorerWidth, (val) => {
    nextTick(() => {
        instance.layout()
    })
    let temp = val + 71;
    if (!fileExplorerShow.value) {
        temp = temp - 5
    }
    ter.value.style.width = `calc(100% - ${temp}px)`;
    tem.value.style.width = `calc(100% - ${temp}px)`;
})

// 保存文件
const { saveFileContent, sendFileToBackground } = usefileStore();
const saveFile = () => {
    saveFileContent(1);
}

const runCode = async () => {
    outputShow.value = true;
    await sendFileToBackground(fileContent.value);
}
</script>

<style lang="less" scoped>
.codeColumnRoot {
    width: 100%;
    height: 100%;

    .codeEdit {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: #353434;

        .codeContainer {
            display: flex;
            width: 100%;
            height: 100%;
            outline: none;

            .monaco {
                display: flex;
                width: 100%;
                height: 100%;
                text-align: left;
                height: inherit;
            }
        }
    }

    .father {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 300px;

        .tem {
            position: absolute;
            top: 0;
            left: 0px;
            right: 0px;
            width: 100%;
            height: 3px;
            background-color: rgb(61, 61, 61);
            cursor: ns-resize;

            &:hover {
                background-color: rgb(102, 140, 221);
            }
        }

        .output {
            position: absolute;
            top: 3px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            background-color: rgb(61, 61, 61);
            font-size: 17px;
            color: #dad7d7;
            padding-left: 10px;
            overflow: auto;
            overflow-y: scroll;
            padding-bottom: 10px;
            padding-top: 10px;

            &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 5px;
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
        }
    }
}
</style>