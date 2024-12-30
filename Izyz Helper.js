// ==UserScript==
// @name         Izyz Helper
// @version      0.0.1
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
    var names = ["李伟宸", "秦海烨", "涂天笑"]; // 用实际的名字替换

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
    
    // 定义一个函数来勾选单选框
    async function checkCheckbox(delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        var checkbox = document.querySelector('.el-checkbox__inner');
        if (checkbox) {
            checkbox.click();
            console.log('单选框已勾选');
        } else {
            console.log('单选框未找到');
        }
    }
    async function processNames(names){
            for (const name of names) {
                await clickButton('.el-button.el-button--primary', 1000); // 点击“添加补录”按钮
                await inputName(name, 1000); // 输入姓名，传递当前名字
                await clickButton('.queryOrgBtn', 500); // 点击“仅在本组织内查询”按钮
                await checkCheckbox(500); // 勾选单选框
                await clickButton('.el-button.el-button--primary[style*="margin-bottom: 20px;"]', 500); // 再次点击“添加补录”按钮
                await clickButton('.el-button.el-button--primary[style*="display: block; margin: 0px auto;"]', 500); // 点击下一步按钮
        };
    }
    
    // 定义菜单命令：开始
    let menu1 = GM_registerMenuCommand('开始', function () {
        processNames(names);
    }, 'o');
})();