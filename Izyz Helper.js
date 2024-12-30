// ==UserScript==
// @name         Izyz Helper
// @version      0.0.2
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
// ==/UserScript==

(function() {
    'use strict';

    // 假设这是从Excel表格中读取的名字数组
    var names = ["李伟宸", "谢宇轩","雷军","秦海烨"]; // 用实际的名字替换
    var nextButtonEnabled = false; // 是否已点击“添加补录”

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

    // 定义一个函数来勾选单选框并点击“添加补录”
    async function checkCheckbox(delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        var checkboxes = document.querySelectorAll('.el-checkbox__inner');
        if (checkboxes.length > 4) {
            // 重名的情况，需要手动勾选
            console.log('超过4个单选框被找到，等待“添加补录”按钮被点击');
            alert('出现重名，请手动勾选志愿者，并点击“添加补录”');
            // 事件代理：在父元素上监听点击事件
            document.body.addEventListener('click', function onClick(event) {
                if (event.target && event.target.matches('button.el-button.el-button--primary span') && event.target.textContent === '添加补录') {
                    console.log('用户点击了“添加补录”按钮，继续执行');
                    nextButtonEnabled = true; // 设置标志，允许继续执行后续操作
                    document.body.removeEventListener('click', onClick); // 移除事件监听器，避免重复监听
                }
            });
        }
        else if(checkboxes.length < 4){
            // 查无此人的情况，需要手动勾选
            console.log('查无此人，等待“添加补录”按钮被点击');
            alert('查无此人，请手动勾选志愿者，并点击“添加补录”');
            // 事件代理：在父元素上监听点击事件
            document.body.addEventListener('click', function onClick(event) {
                if (event.target && event.target.matches('button.el-button.el-button--primary span') && event.target.textContent === '添加补录') {
                    console.log('用户点击了“添加补录”按钮，继续执行');
                    nextButtonEnabled = true; // 设置标志，允许继续执行后续操作
                    document.body.removeEventListener('click', onClick); // 移除事件监听器，避免重复监听
                }
            });
        }else{
            // 正常情况
            checkboxes.forEach((checkbox) => checkbox.click());
            console.log('单选框已勾选');
            await clickButton('.el-button.el-button--primary[style*="margin-bottom: 20px;"]', 500); // 再次点击“添加补录”按钮
            console.log('“添加补录”按钮已被点击，等待“下一步”按钮');
            nextButtonEnabled = true;// “添加补录”按钮已被点击，允许点击“下一步”
        }
    }

    // 定义一个函数来进行录入志愿者
    async function processNames(names){
        for (const name of names) {
            await clickButton('.el-button.el-button--primary', 1000); // 点击“添加补录”按钮
            await inputName(name, 1000); // 输入姓名，传递当前名字
            await clickButton('.queryOrgBtn', 500); // 点击“仅在本组织内查询”按钮
            await checkCheckbox(500); // 勾选单选框
            // 等待“添加补录”按钮被点击后，再点击“下一步”按钮
            while (!nextButtonEnabled) {
                await new Promise(resolve => setTimeout(resolve, 500)); // 每0.5秒检查一次
            }
            await clickButton('.el-button.el-button--primary[style*="display: block; margin: 0px auto;"]', 500); // 点击“下一步”按钮
            console.log('"下一步"已被点击')
            nextButtonEnabled = false; // 重置标志
        };
    }

    // 定义菜单命令：开始
    let menu1 = GM_registerMenuCommand('开始', function () {
        processNames(names);
    }, 'o');

})();