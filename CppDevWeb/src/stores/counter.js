import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import FileSaver from 'file-saver'

export const usefileStore = defineStore('file', () => {
  const loading = ref(false);
  // 是否展示文件浏览器以及是否去掉按钮的显示
  const alreadyOpen = ref(false);
  const fileExplorerShow = ref(false);
  // 切换文件浏览器的显示
  const toggleFileExplorerShow = (value) => {
    fileExplorerShow.value = value;
  }

  const codeEditorShow = ref(false);
  const toggleCodeEditorShow = (value) => {
    codeEditorShow.value = value;
  }


  const root = ref({});
  // 打开文件并且赋值文件的状态
  const openFileFn = async () => {
    loadingShow();
    try {
      const handel = await showOpenFilePicker();
      const file = await handel[0].getFile();
      const text = await file.text();
      root.value = {
        kind: 'file',
        name: handel[0].name,
        text,
      };
      alreadyOpen.value = true;
      loading.value = false;
      console.log(root.value)
    } catch (error) {
      if (root.value.kind === 'file' || root.value.kind === 'directory') {
        alreadyOpen.value = true;
        fileExplorerShow.value = true;
        loading.value = false;
      } else {
        alreadyOpen.value = false;
        loading.value = false;
      }
    }
  }
  // 打开文件夹并且赋值文件夹的状态
  const openDirFn = async () => {
    loadingShow();
    try {
      const handel = await showDirectoryPicker();
      const rootRes = await processHandel(handel);
      root.value = rootRes;
      alreadyOpen.value = true;
      loading.value = false;
    } catch (error) {
      console.log(error);
      if (root.value.kind === 'file' || root.value.kind === 'directory') {
        alreadyOpen.value = true;
        fileExplorerShow.value = true;
        loading.value = false;
      } else {
        alreadyOpen.value = false;
        loading.value = false;
      }
    }
  }
  const processHandel = async (handel) => {
    if (handel.kind === 'file') {
      return handel;
    }
    handel.children = [];
    // 得到异步迭代器
    const iterator = handel.entries();
    for await (const item of iterator) {
      handel.children.push(await processHandel(item[1]));
    }
    return handel;
  }



  const loadingShow = () => {
    loading.value = true;
    alreadyOpen.value = false;

  }

  // 文件的句柄
  const fileContent = ref({
  })
  // 创建一个响应式对象来存储cpp文件的内容
  const cppContent = ref("");
  // 获取文件句柄
  const getFileContentFn = (value) => {
    fileContent.value = value;
    if (fileContent.value.isChanged) {
    } else {
      fileContent.value.isChanged = ref(false);
    }
    getFileContent();
  }
  const counterPath = ref("");
  const falg = ref(true);
  // 获取文件内容并存储到变量
  const getFileContent = async () => {
    if (fileContent.value.path === counterPath.value) {
      falg.value = true
      return;
    } else {
      falg.value = false
      counterPath.value = fileContent.value.path;
      if (fileContent.value.text) {
        const text = await fileContent.value.text;
        if (text === '') {
          cppContent.value = '/* code */';
        }
        else {
          cppContent.value = text;
        }
        mmm.value = !mmm.value;
      } else {
        const file = await fileContent.value.getFile();
        const text = await file.text();
        if (text === '') {
          cppContent.value = '/* code */';
        }
        else {
          cppContent.value = text;
        }
        mmm.value = !mmm.value;
      }
    }
  }


  const saveFileContent = async (a) => {
    let text = cppContent.value;
    if (a === 1) {
      try {
        const writable = await fileContent.value.createWritable();
        await writable.write(text);
        await writable.close();
        // 在 workFiles 中找到当前文件， 并且修改文件对象的 ischanged 值
        workFiles.value.forEach((item) => {
          if (item.path === fileContent.value.path) {
            item.isChanged.value = false;
          }
        })
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      try {
        const writable = await fileContent.value.createWritable();
        await writable.write(text);
        await writable.close();
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }


  const mmm = ref(true);
  const workFiles = ref([]);


  const sendFileToBackground = async (fileHandle) => {
    message.value = "compiling..."
    let sendFile = await fileHandle.getFile();
    const fileData = new Blob([sendFile], { type: sendFile.type });
    const formData = new FormData();
    formData.append('file', fileData, sendFile.name);
    await axios.post('/api/compile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      if (res.status === 200) {
        message.value = "compile success"
        // 将获取到的 url 放到 a 标签进行新标签页
        const a = document.createElement('a');
        a.href = res.data;
        a.target = '_blank';
        a.click();
        // 卸载 a 
        a.remove();
      } else {
        message.value = "compile error " + res.data
      }
      return res;
    }
    ).catch((err) => {
      message.value = "system error " + err.message
    }
    )
  }

  const message = ref('');
  const fileExplorerWidth = ref(0);
  const outputShow = ref(false);

  return {
    outputShow,
    fileExplorerWidth,
    message,
    mmm,
    falg,
    cppContent,
    codeEditorShow,
    loading,
    alreadyOpen,
    root,
    fileExplorerShow,
    counterPath,
    workFiles,
    fileContent,
    toggleFileExplorerShow,
    openDirFn,
    openFileFn,
    toggleCodeEditorShow,
    getFileContentFn,
    getFileContent,
    saveFileContent,
    sendFileToBackground
  };
})
