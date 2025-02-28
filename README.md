# Izyz-Helper 使用说明

![Tampermonkey 脚本图标](https://www.gdzyz.cn/assets/weblogo.1b6eba63.svg)

## 📖 项目描述
**Izyz-Helper** 是一个 Tampermonkey 用户脚本，旨在简化在 [广东志愿者服务平台](https://www.gdzyz.cn/) 上批量录入志愿者信息的过程。支持通过 Excel 文件或图片快速导入名单，并自动完成表单填写、查重和补录操作。

---

## 🚀 主要功能
- **Excel 文件导入**  
  支持 `.xlsx` 或 `.xls` 格式文件，自动提取“姓名”列数据。
- **图片 OCR 识别**  
  通过百度云 OCR 自动识别图片中的中文姓名（支持 JPG/PNG 格式）。
- **批量自动化录入**  
  自动勾选志愿者、点击补录按钮，并支持进度条显示。
- **跳过机制**  
  可手动跳过无法识别的志愿者，并在完成后显示被跳过的名单。
- **防重名处理**  
  检测到重复或无效姓名时，提示用户手动选择。

---

## 🛠️ 安装与使用

### 安装步骤
1. 安装浏览器插件 [Tampermonkey](https://www.tampermonkey.net/)。
2. 点击 [此处](https://greasyfork.org/en/scripts/522290-izyz-helper) 安装脚本。

### 使用方法
1. **上传名单**  
   - **Excel 文件**：点击页面左下角的 `上传志愿者名单` 按钮，选择包含“姓名”列的 Excel 文件。
   - **图片**：点击 `上传志愿者照片` 按钮，上传包含姓名的图片（如名单截图）。
     > 注：图片需清晰，姓名格式为纯中文（2-4字），支持多行识别。

2. **开始录入**  
   - 点击 Tampermonkey 菜单栏中的 **开始**（快捷键 `O`）。
   - 脚本会自动打开录入页面并填充姓名。

3. **处理异常**  
   - **重名提示**：手动勾选正确志愿者后点击 `添加补录`。
   - **查无此人**：点击 `跳过当前志愿者` 按钮，该姓名会被记录。

4. **完成提示**  
   - 进度条显示当前录入状态。
   - 完成后弹窗显示被跳过的志愿者名单。

---

## ⚠️ 注意事项
1. **百度云 OCR 配置**  
   - 脚本依赖百度云 OCR，需自行申请 API 密钥并替换代码中的 `BAIDU_API_KEY` 和 `BAIDU_SECRET_KEY`。
   - 申请地址：[百度AI开放平台](https://ai.baidu.com/tech/ocr/general)

2. **Excel 格式要求**  
   - 必须包含 **“姓名”列**，且位于第一个工作表。
   - 支持自动过滤姓名前的数字（如 `1.张三` 会转为 `张三`）。

3. **兼容性**  
   - 仅在 `https://www.gdzyz.cn/` 域名下生效。
   - 依赖 `XLSX` 库，若加载失败请检查网络或手动引入。

---

## 📦 依赖项
- [xlsx.full.min.js](https://unpkg.com/xlsx/dist/xlsx.full.min.js)  
- 百度云 OCR API

---

## 👤 作者信息
- **作者**：Weichenleeeee
- **反馈渠道**：[Greasy Fork 主页](https://greasyfork.org/users/1417526)

---

## 更新说明

### [2025-02-11] 版本更新
#### 新增
- 增加了项目README文档

### [2025-01-18] 功能优化
#### 改进
- 调整各组件布局结构
#### 修复
- 修复导入表格时错误提取"姓名"字段的问题

### [2025-01-17] 新增功能
#### 新增
- 支持手动修改/选择图像识别的志愿者结果

### [2025-01-11] 表格功能增强
#### 新增
- 实现图片签到表上传及姓名识别功能
#### 恢复
- 重新启用表格上传功能

### [2025-01-10] 功能优化与修复
#### 新增
- 自动过滤表格中姓名前的班级信息
#### 优化
- 改进按钮点击事件监听逻辑
#### 修复
- 修复添加补录按钮偶发无法监听的问题
- 修复界面跳过功能失效的问题

### [2025-01-04] 功能改进
#### 新增
- 结果显示界面增加跳过的志愿者名单展示
#### 修复
- 修复手动勾选志愿者后流程卡住的问题

### [2024-12-31] 基础功能增强
#### 新增
- 增加操作进度条指示
#### 已知问题
- 特殊情况下手动录用功能可能出现界面卡顿

---

## 🔗 许可证
本项目基于 MIT 许可证开源。详见脚本头部注释。