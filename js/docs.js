// 文档数据结构
// 这里定义了 doc 目录下的所有文档分类和文件
const docsData = {
    "architectury": {
        name: "Architectury 模组开发",
        icon: "🎮",
        description: "Minecraft 1.21.1 多平台模组开发完整指南",
        files: [
            {
                name: "01-入门指南",
                path: "doc/architectury/01-入门指南.md",
                description: "Architectury 简介、环境要求和快速开始"
            },
            {
                name: "02-环境配置",
                path: "doc/architectury/02-环境配置.md",
                description: "详细的 Gradle 配置和环境搭建"
            },
            {
                name: "03-API核心功能",
                path: "doc/architectury/03-API核心功能.md",
                description: "注册系统、事件系统、网络系统"
            },
            {
                name: "04-多平台开发",
                path: "doc/architectury/04-多平台开发.md",
                description: "跨平台代码组织和 @ExpectPlatform"
            },
            {
                name: "05-高级特性",
                path: "doc/architectury/05-高级特性.md",
                description: "Mixin、Access Transformer、数据生成"
            },
            {
                name: "06-最佳实践",
                path: "doc/architectury/06-最佳实践.md",
                description: "代码组织和性能优化建议"
            },
            {
                name: "07-API参考",
                path: "doc/architectury/07-API参考.md",
                description: "API 速查手册和常用代码片段"
            },
            {
                name: "08-常见问题",
                path: "doc/architectury/08-常见问题.md",
                description: "FAQ 和问题解决方案"
            },
            {
                name: "09-版本迁移",
                path: "doc/architectury/09-版本迁移.md",
                description: "版本升级和平台迁移指南"
            },
            {
                name: "10-快速入门模板",
                path: "doc/architectury/10-快速入门模板.md",
                description: "完整的项目模板代码"
            }
        ]
    }
    // 可以在这里添加更多文档分类
    // "other-category": {
    //     name: "其他分类",
    //     icon: "📖",
    //     description: "其他文档分类描述",
    //     files: [...]
    // }
};

// 当前状态
let currentView = 'list'; // 'list' 或 'detail'
let currentCategory = null;
let currentFile = null;

// DOM 元素
const docGrid = document.getElementById('docGrid');
const docListView = document.getElementById('docListView');
const docDetailView = document.getElementById('docDetailView');
const docTitle = document.getElementById('docTitle');
const docContent = document.getElementById('docContent');
const backBtn = document.getElementById('backBtn');
const sidebarContent = document.getElementById('sidebarContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

// 初始化页面
function init() {
    renderDocGrid();
    renderSidebar();
    setupEventListeners();
    handleUrlParams();
}

// 渲染文档卡片网格
function renderDocGrid() {
    docGrid.innerHTML = '';
    
    for (const [categoryKey, category] of Object.entries(docsData)) {
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.dataset.category = categoryKey;
        card.innerHTML = `
            <div class="doc-card-icon">${category.icon}</div>
            <div class="doc-card-title">${category.name}</div>
            <div class="doc-card-desc">${category.description}</div>
            <div class="doc-card-count">${category.files.length} 篇文档</div>
        `;
        card.addEventListener('click', () => showCategory(categoryKey));
        docGrid.appendChild(card);
    }
}

// 渲染侧边栏
function renderSidebar() {
    sidebarContent.innerHTML = '';
    
    for (const [categoryKey, category] of Object.entries(docsData)) {
        const folderItem = document.createElement('div');
        folderItem.className = 'sidebar-item';
        
        const folder = document.createElement('div');
        folder.className = 'sidebar-folder';
        folder.dataset.category = categoryKey;
        folder.innerHTML = `
            <span class="sidebar-folder-icon">${category.icon}</span>
            <span class="sidebar-folder-name">${category.name}</span>
            <span class="sidebar-folder-count">${category.files.length}</span>
        `;
        
        const filesList = document.createElement('div');
        filesList.className = 'sidebar-files';
        filesList.id = `sidebar-files-${categoryKey}`;
        
        category.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'sidebar-file';
            fileItem.dataset.category = categoryKey;
            fileItem.dataset.index = index;
            fileItem.textContent = file.name;
            fileItem.addEventListener('click', (e) => {
                e.stopPropagation();
                showFile(categoryKey, index);
            });
            filesList.appendChild(fileItem);
        });
        
        folder.addEventListener('click', () => toggleFolder(categoryKey));
        
        folderItem.appendChild(folder);
        folderItem.appendChild(filesList);
        sidebarContent.appendChild(folderItem);
    }
}

// 切换文件夹展开/收起
function toggleFolder(categoryKey) {
    const filesList = document.getElementById(`sidebar-files-${categoryKey}`);
    const folder = document.querySelector(`.sidebar-folder[data-category="${categoryKey}"]`);
    
    // 切换展开状态
    filesList.classList.toggle('show');
    folder.classList.toggle('active');
}

// 显示分类下的文件列表
function showCategory(categoryKey) {
    currentCategory = categoryKey;
    currentView = 'list';
    
    const category = docsData[categoryKey];
    docListView.querySelector('h1').textContent = `${category.icon} ${category.name}`;
    docListView.querySelector('p').textContent = category.description;
    
    // 重新渲染该分类的文件卡片
    docGrid.innerHTML = '';
    category.files.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.innerHTML = `
            <div class="doc-card-title">${file.name}</div>
            <div class="doc-card-desc">${file.description}</div>
        `;
        card.addEventListener('click', () => showFile(categoryKey, index));
        docGrid.appendChild(card);
    });
    
    // 更新视图
    docListView.classList.add('active');
    docDetailView.classList.remove('active');
    
    // 更新侧边栏状态
    updateSidebarActive(categoryKey, null);
    
    // 更新 URL
    updateUrl(categoryKey, null);
}

// 显示具体的文档文件
function showFile(categoryKey, fileIndex) {
    currentCategory = categoryKey;
    currentFile = fileIndex;
    currentView = 'detail';
    
    const category = docsData[categoryKey];
    const file = category.files[fileIndex];
    
    // 更新标题
    docTitle.textContent = file.name;
    
    // 显示加载状态
    docContent.innerHTML = '<div class="loading">加载中</div>';
    
    // 切换视图
    docListView.classList.remove('active');
    docDetailView.classList.add('active');
    
    // 更新侧边栏状态
    updateSidebarActive(categoryKey, fileIndex);
    
    // 展开对应的文件夹
    const filesList = document.getElementById(`sidebar-files-${categoryKey}`);
    const folder = document.querySelector(`.sidebar-folder[data-category="${categoryKey}"]`);
    if (filesList) filesList.classList.add('show');
    if (folder) folder.classList.add('active');
    
    // 加载文档内容
    loadMarkdown(file.path);
    
    // 更新 URL
    updateUrl(categoryKey, fileIndex);
}

// 加载 Markdown 文件
async function loadMarkdown(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        
        // 使用 marked.js 渲染 Markdown
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true
            });
            docContent.innerHTML = marked.parse(markdown);
        } else {
            // 如果 marked.js 未加载，显示原始文本
            docContent.innerHTML = `<pre>${escapeHtml(markdown)}</pre>`;
        }
        
        // 滚动到顶部
        docContent.scrollTop = 0;
    } catch (error) {
        docContent.innerHTML = `
            <div class="loading" style="color: #e06c75;">
                加载失败: ${error.message}
            </div>
        `;
    }
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 更新侧边栏激活状态
function updateSidebarActive(categoryKey, fileIndex) {
    // 移除所有激活状态
    document.querySelectorAll('.sidebar-folder').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sidebar-file').forEach(el => el.classList.remove('active'));
    
    // 添加新的激活状态
    const folder = document.querySelector(`.sidebar-folder[data-category="${categoryKey}"]`);
    if (folder) folder.classList.add('active');
    
    if (fileIndex !== null) {
        const file = document.querySelector(`.sidebar-file[data-category="${categoryKey}"][data-index="${fileIndex}"]`);
        if (file) file.classList.add('active');
    }
}

// 更新 URL 参数
function updateUrl(categoryKey, fileIndex) {
    const params = new URLSearchParams();
    if (categoryKey) params.set('category', categoryKey);
    if (fileIndex !== null) params.set('file', fileIndex);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
}

// 处理 URL 参数
function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const file = params.get('file');
    
    if (category && docsData[category]) {
        if (file !== null && docsData[category].files[parseInt(file)]) {
            showFile(category, parseInt(file));
        } else {
            showCategory(category);
        }
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 返回按钮
    backBtn.addEventListener('click', () => {
        if (currentCategory) {
            showCategory(currentCategory);
        } else {
            showListView();
        }
    });
    
    // 侧边栏切换按钮
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
    // 浏览器前进/后退按钮
    window.addEventListener('popstate', () => {
        handleUrlParams();
    });
    
    // 点击侧边栏外部关闭（移动端）
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// 显示默认列表视图
function showListView() {
    currentCategory = null;
    currentFile = null;
    currentView = 'list';
    
    docListView.querySelector('h1').textContent = '📚 文档中心';
    docListView.querySelector('p').textContent = '选择一个文档分类开始阅读';
    
    renderDocGrid();
    
    docListView.classList.add('active');
    docDetailView.classList.remove('active');
    
    // 清除侧边栏激活状态
    document.querySelectorAll('.sidebar-folder').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sidebar-file').forEach(el => el.classList.remove('active'));
    
    // 更新 URL
    window.history.pushState({}, '', window.location.pathname);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
