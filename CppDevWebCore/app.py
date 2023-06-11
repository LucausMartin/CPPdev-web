from flask import Flask, Response, request, send_file
import os
import subprocess

app = Flask(__name__)

@app.route('/compile', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file uploaded.'
    
    file = request.files['file']
    
    # 判断文件是不是 .c 或者 .cpp 文件
    if file.filename.split('.')[-1] not in ['c', 'cpp']:
        return 'File type not supported.', 201
    
    
    # 在这里可以对上传的文件进行处理，比如保存到磁盘或进行其他操作
    # # 打印文件名
    print(file.filename)
    # 读取文件并打印内容
    print(file.read().decode('utf-8'))
    file.seek(0)
    
    
    # 以原文件名保存在本地
    file_path = os.path.join(file.filename)
    file.save(file_path)
    
    
    # 编译文件并捕获错误输出
    cmd = 'g++ ' + file_path + ' -o ' + file.filename.split('.')[0]
    proc = subprocess.Popen(cmd, stderr=subprocess.PIPE, shell=True)
    out, err = proc.communicate() 
    path = os.path.abspath(file.filename.split('.')[0])


    # 检查编译是否成功
    if proc.returncode != 0:    
    # 如果编译失败，输出错误信息
        return err.decode('utf-8'), 202
    else:
        # 如果编译成功，返回下载地址
        # 获取 .cpp 前面的文件名
        fileName = file.filename.split('.')[0]
        return  'http://localhost:5000/sendFile?fileName=' + fileName + '.exe', 200
    
@app.route('/sendFile', methods=['GET'])
def sendfile():
    fileName = request.args.get('fileName')
    file = send_file(fileName, as_attachment=True)
    return file


if __name__ == '__main__':
    app.run()