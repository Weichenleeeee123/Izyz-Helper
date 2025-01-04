// ==UserScript==
// @name         Izyz-Helper
// @namespace    https://greasyfork.org/users/1417526
// @version      0.0.7
// @description  Help you to use izyz easier!
// @author       Weichenleeeee
// @match        https://www.gdzyz.cn/*
// @icon         https://www.gdzyz.cn/assets/weblogo.1b6eba63.svg
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// ==/UserScript==

(function() {
    'use strict';

    var names = []; // 用实际的名字替换
    var nextButtonEnabled = false; // 是否已点击“添加补录”
    var skipButtonEnabled = false; // 是否点击了跳过按钮
    var volunteersSkipped = [];

    // 检测XLSX库是否加载成功
    setTimeout(function() {
        if (typeof XLSX === "undefined") {
            console.error("XLSX 库加载失败！");
            alert("无法加载 XLSX 库，功能无法使用！");
            return; // 如果加载失败，直接停止脚本
        } else {
            console.log("XLSX 库加载成功！");
        }
    }, 1000); // 延迟1秒检查是否加载成功

    // 添加文件上传按钮
    function createFileInput() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls'; // 限制为 Excel 文件
        input.style.position = 'fixed';
        input.style.bottom = '10px';
        input.style.left = '10px';
        input.style.zIndex = 9999;
        input.style.padding = '5px';
        input.style.borderRadius = '5px';
        input.style.backgroundColor = '#4CAF50';
        input.style.color = 'white';
        input.style.border = 'none';
        input.style.cursor = 'pointer';
        input.addEventListener('change', handleFileSelect);
        document.body.appendChild(input);
    }
    
    // 添加跳过按钮
    function createSkipButton() {
        var skipButton = document.createElement('button');
        skipButton.textContent = '跳过当前志愿者';
        skipButton.style.position = 'fixed';
        skipButton.style.bottom = '50px'; // 放在“上传文件”按钮的上方
        skipButton.style.left = '10px';
        skipButton.style.zIndex = 9999;
        skipButton.style.padding = '10px';
        skipButton.style.borderRadius = '5px';
        skipButton.style.backgroundColor = '#f44336'; // 红色按钮
        skipButton.style.color = 'white';
        skipButton.style.border = 'none';
        skipButton.style.cursor = 'pointer';
        skipButton.style.fontSize = '14px';
        skipButton.addEventListener('click', function() {
            skipButtonEnabled = true; // 设置跳过标志
            console.log('用户点击了跳过按钮1');
            console.log('skipButtonEnabled is ',skipButtonEnabled);
        });
        document.body.appendChild(skipButton);
    }

    // 处理文件选择
    function handleFileSelect(event) {
    var file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var sheet = workbook.Sheets[workbook.SheetNames[0]]; // 默认取第一个工作表

            // 将工作表转换为二维数组，raw: true 确保读取原始数据而不进行格式化
            var json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

            // 打印原始数据以查看第一行
            console.log('读取到的数据：', json);

            // 获取表头
            var header = json[0];
            console.log('表头:', header);

            // 查找"姓名"列的索引，去除每个列名的前后空格
            var nameColumnIndex = header.findIndex(col => col.trim() === "姓名");

            if (nameColumnIndex === -1) {
                alert('未找到“姓名”列，请确保Excel中有“姓名”列');
                console.error('未找到姓名列');
                return;
            }

            // 提取姓名列数据
            names = json.slice(1).map(row => row[nameColumnIndex]).filter(name => name);
            console.log('已加载姓名：', names);
            alert('Excel 文件已成功加载，姓名已提取！');
        };
        reader.readAsBinaryString(file);
    } else {
        alert('请上传有效的 Excel 文件');
        }
    }

    // 创建并显示进度条
    function createProgressBar() {
        var progressContainer = document.createElement('div');
        progressContainer.style.position = 'fixed';
        progressContainer.style.bottom = '90px';
        progressContainer.style.left = '10px';
        progressContainer.style.zIndex = 9999;
        progressContainer.style.width = '300px';
        progressContainer.style.height = '30px';
        progressContainer.style.backgroundColor = '#e0e0e0';
        progressContainer.style.borderRadius = '5px';
            
        var progressBar = document.createElement('div');
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.borderRadius = '5px';
        progressContainer.appendChild(progressBar);
    
        var progressText = document.createElement('span');
        progressText.style.position = 'absolute';
        progressText.style.top = '50%';
        progressText.style.left = '50%';
        progressText.style.transform = 'translate(-50%, -50%)';
        progressText.style.color = 'white';
        progressText.style.fontSize = '14px';
        progressContainer.appendChild(progressText);
    
        var currentVolunteerText = document.createElement('span');
        currentVolunteerText.style.position = 'fixed';
        currentVolunteerText.style.bottom = '130px';
        currentVolunteerText.style.left = '10px';
        currentVolunteerText.style.zIndex = 9999;
        currentVolunteerText.style.fontSize = '14px';
        currentVolunteerText.style.color = '#4CAF50';
        currentVolunteerText.style.fontWeight = 'bold';
        currentVolunteerText.textContent = '当前录入：第 0 个志愿者';
        document.body.appendChild(currentVolunteerText);
    
        document.body.appendChild(progressContainer); // 确保进度条在页面中显示
    
        return { progressBar, progressText, currentVolunteerText };
    
    }

    // 更新进度条
    function updateProgressBar(progressBar, progressText, current, total, currentVolunteerText) {
        var percentage = Math.round((current / total) * 100);
        progressBar.style.width = percentage + '%';
        progressText.textContent = `进度：${percentage}%`;
        currentVolunteerText.textContent = `当前录入：第 ${current} 个志愿者`;
    }


    // 定义一个函数来模拟点击按钮事件
    async function clickButton(selector, delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        var button = document.querySelector(selector);
        if (button) {
            button.click();
            console.log(`${selector} 按钮已点击`);
        } else {
            console.log(`${selector} 按钮未找到`);
        }
    }

    // 定义一个函数来输入姓名
    async function inputName(name, delay) { // 将 inputText 作为参数传递
        await new Promise(resolve => setTimeout(resolve, delay));
        let input = document.querySelectorAll('.el-input__inner')[0];
        if (input) {
            input.value = name; // 使用参数 name 而不是全局变量 inputText
            var event = document.createEvent('HTMLEvents');
            event.initEvent("input", true, true);
            event.eventType = 'message';
            input.dispatchEvent(event);
            console.log('姓名已输入');
        } else {
            console.log('文本框未找到');
        }
    }

    // 等待用户点击“添加补录”或“跳过”按钮
    async function waitForUserAction() {
        return new Promise(resolve => {
            // 监听跳过按钮
            const skipListener = (event) => {
                if (skipButtonEnabled) {
                    console.log('用户点击了跳过按钮2');
                    resolve('SKIP'); // 返回跳过信号
                    document.body.removeEventListener('click', skipListener); // 移除跳过按钮监听
                }
            };

            // 监听“添加补录”按钮
            const nextListener = (event) => {
                if (event.target && event.target.matches('button.el-button.el-button--primary span') && event.target.textContent.trim() === '添加补录') {
                    nextButtonEnabled = true;
                    console.log('用户点击了“添加补录”按钮');
                    resolve('CONTINUE'); // 返回继续信号
                    document.body.removeEventListener('click', nextListener); // 移除添加补录按钮监听
                }
            };

            // 为跳过按钮和“添加补录”按钮分别添加监听
            document.body.addEventListener('click', skipListener);
            document.body.addEventListener('click', nextListener);
        });
    }

    // 定义一个函数来勾选单选框并点击“添加补录”
    async function checkCheckbox(delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        var checkboxes = document.querySelectorAll('.el-checkbox__inner');
        if (checkboxes.length > 4) {
            console.log('超过4个单选框被找到，等待用户操作');
            alert('出现重名，请手动勾选志愿者，并点击“添加补录”');
            await waitForUserAction(); // 等待用户点击“添加补录”
        }
        else if(checkboxes.length < 4){
            // 查无此人的情况，需要手动勾选
            console.log('查无此人，提供跳过或手动选择的选项');
            alert('查无此人，请手动勾选志愿者并点击“添加补录”，或点击“跳过”按钮');
            const result = await waitForUserAction(); // 等待用户点击“添加补录”或“跳过”
            console.log(result);
            if (result === 'SKIP') {
                return 'SKIP'; // 跳过当前志愿者
            }else if (result === 'CONTINUE') {
                return 'CONTINUE';
            }
        }else{
            // 正常情况
            checkboxes.forEach((checkbox) => checkbox.click());
            console.log('单选框已勾选');
            await clickButton('.el-button.el-button--primary[style*="margin-bottom: 20px;"]', 500); // 点击“添加补录”按钮
            nextButtonEnabled = true; // 标志已完成“添加补录”
        }
    }

    // 主处理函数
    async function processNames(names){
        const { progressBar, progressText, currentVolunteerText } = createProgressBar(); // 创建进度条
        for (let i = 0; i < names.length; i++) {
            console.log(`正在处理志愿者：${names[i]}`);
    
            await clickButton('.el-button.el-button--primary', 1000); // 打开输入页面
            await inputName(names[i], 1000); // 输入志愿者姓名
            await clickButton('.queryOrgBtn', 500); // 点击查询按钮
    
            const result = await checkCheckbox(500);
            if (result === 'SKIP') {
                console.log(`跳过志愿者：${names[i]}`);
                // 记录当前志愿者的名字
                volunteersSkipped.push(names[i]);
                console.log(`记录志愿者：${names[i]}`);
                continue; // 跳过当前志愿者，进入下一个
            }else if (result === 'CONTINUE') {
                console.log(`继续处理志愿者：${names[i]}`);
            }
            // 更新进度条
            updateProgressBar(progressBar, progressText, i + 1, names.length, currentVolunteerText);
    
            // 等待用户完成“添加补录”操作
            await clickButton('.el-button.el-button--primary[style*="display: block; margin: 0px auto;"]', 500); // 点击“下一步”按钮
            console.log('“下一步”已被点击');
            nextButtonEnabled = false; // 重置标志
        };
        // 在最后显示被跳过的志愿者名字
        if (volunteersSkipped.length > 0) {
            alert(`录用完成，被跳过的的志愿者：${volunteersSkipped.join(', ')}`);
        }
    }

    // 创建按钮
    createFileInput();
    createSkipButton();

    // 定义菜单命令：开始
    let menu1 = GM_registerMenuCommand('开始', function () {
        if (names.length === 0) {
            alert('请先上传并加载 Excel 文件！');
            return;
        }
        processNames(names);
    }, 'o');

})();