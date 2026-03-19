// js/agent_detail.js - Scripts for the Industry One-Pager Agent Detail Page

document.addEventListener('DOMContentLoaded', () => {
    initDynamicAgentContent();
    initQuickTags();
    initSourceItems();
    initUploadArea();
    initSelectAll();
    initDragAndDrop();
    initCustomSkillSubmit();
    initGenerationButton();
});

// Dynamic configuration for different Agents
const agentConfig = {
    'one_pager': {
        icon: 'fa-file-lines',
        color: '#E66666',
        title: '行业一页纸',
        sub: '通用',
        skills: ['行业一句话定义', '当前周期判断', '产业链结构', '核心投资逻辑', '关键跟踪指标', '核心标的分层', '风险提示'],
        tags: ['海外对标分析', '机构动向追踪', '价格传导分析', '政策影响评估', '技术路线对比']
    },
    'theme_stock': {
        icon: 'fa-crosshairs',
        color: '#4B85E6',
        title: '主题选股',
        sub: '通用',
        skills: ['主题催化剂分析', '核心受益环节', '板块历史复盘', '龙头个股筛选', '交易拥挤度评估'],
        tags: ['美股映射', '资金面分析', '政策博弈', '业绩兑现']
    },
    'prosperity': {
        icon: 'fa-chart-line',
        color: '#9333EA',
        title: '行业景气度透视',
        sub: '增强',
        skills: ['核心财务指标速览', '上下游排产交叉验证', '价格及库存水位', '产能利用率跟踪'],
        tags: ['业绩超预期', '拐点确认', '补库周期']
    },
    'news_summary': {
        icon: 'fa-newspaper',
        color: '#10B981',
        title: '周度行业新闻总结',
        sub: '通用',
        skills: ['监管政策动态', '重点公司异动', '行业专家观点汇总', '下周重要事件提醒'],
        tags: ['政策解读', '竞争格局边际变化', '融资并购']
    },
    'drug_catalyst': {
        icon: 'fa-pills',
        color: '#F59E0B',
        title: '创新药催化追踪',
        sub: '创新药',
        skills: ['临床数据读出预期', '竞品研发进度', '医保谈判进展', '商业化放量跟踪', '海外授权(BD)潜力'],
        tags: ['ASCO数据', 'FDA获批', '靶点竞争', '出海进展']
    },
    'smart_driving': {
        icon: 'fa-car',
        color: '#F87171',
        title: '智驾渗透率追踪',
        sub: '汽车/科技',
        skills: ['L2+/NOA 落地进度', '核心车企智驾路线对比', '激光雷达/域控出货量', '政策牌照发放追踪'],
        tags: ['特斯拉FSD', '端到端模型', '标配下放', 'Robotaxi商业化']
    },
    'commodity': {
        icon: 'fa-chart-pie',
        color: '#059669',
        title: '大宗商品历史复盘',
        sub: '周期',
        skills: ['历次大涨跌价格走势复盘', '核心供需矛盾分析', '宏观流动性环境', '关联资产表现验证'],
        tags: ['降息预期', '供给侧改革', '地缘冲突']
    },
    'supply_chain': {
        icon: 'fa-diagram-project',
        color: '#F59E0B',
        title: '供应链映射',
        sub: '增强',
        skills: ['BOM成本拆解', '核心环节壁垒分析', '成本/利润传导推演', '海外供应链脱钩风险'],
        tags: ['国产替代', '成本转嫁', '份额提升']
    },
    'global_compare': {
        icon: 'fa-globe',
        color: '#EF4444',
        title: '全球可比公司分析',
        sub: '增强',
        skills: ['核心业务对齐', '估值体系锚定 (PE/PS/EV)', '盈利能力全面对比', '产品矩阵及技术代差'],
        tags: ['全球定价权', '规模效应', '出海逻辑']
    }
};

function initDynamicAgentContent() {
    // Parse URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('agent');

    // Default to one_pager if no valid parameter
    const config = agentConfig[agentId] || agentConfig['one_pager'];

    // Update Header
    const hdIcon = document.getElementById('ad-dynamic-icon');
    const hdTitle = document.getElementById('ad-dynamic-title');
    const hdSubtitle = document.getElementById('ad-dynamic-subtitle');

    if (hdIcon) {
        hdIcon.className = `fa-solid ${config.icon} ad-title-icon`;
        hdIcon.style.color = config.color;
    }
    if (hdTitle) hdTitle.innerText = config.title;
    if (hdSubtitle) hdSubtitle.innerText = '· ' + config.sub;

    // Update Form Panel Icon
    const panelIcon = document.getElementById('ad-dynamic-panel-icon');
    if (panelIcon) {
        panelIcon.className = `fa-solid ${config.icon} ad-panel-title-icon`;
        panelIcon.style.color = config.color;
    }

    // Update Skill List
    const skillList = document.getElementById('ad-dynamic-skill-list');
    if (skillList && config.skills) {
        skillList.innerHTML = config.skills.map((skill, index) => `
            <label class="ad-skill-item">
                <i class="fa-solid fa-grip-vertical ad-drag-handle"></i>
                <input type="checkbox" class="ad-skill-checkbox" checked>
                <span class="ad-skill-name">${skill}</span>
                <div class="ad-skill-badge">${index + 1}</div>
            </label>
        `).join('');
    }

    // Update Tags
    const tagsContainer = document.getElementById('ad-dynamic-cs-tags');
    if (tagsContainer && config.tags) {
        tagsContainer.innerHTML = config.tags.map(tag => `
            <div class="ad-cs-tag">${tag}</div>
        `).join('');
        // Rebind Quick Tags interaction since DOM changed
        initQuickTags();
    }
}

// Add functionality to quick tags to populate the custom skill input
function initQuickTags() {
    const tags = document.querySelectorAll('.ad-cs-tag');
    const input = document.querySelector('.ad-cs-input-wrapper input');

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const currentVal = input.value;
            const newText = tag.innerText;
            if (currentVal) {
                input.value = currentVal + '，' + newText;
            } else {
                input.value = newText;
            }
            input.focus();
        });
    });
}

// Add click effect to list items so checking anywhere on the item checks the box
function initSourceItems() {
    // The <label> wrapping already handles most of this natively, 
    // but we can add any custom UI updates here if needed in the future.
    const removes = document.querySelectorAll('.ad-remove-source');
    removes.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.closest('.ad-added-source');
            if (parent) {
                parent.style.display = 'none';
            }
        });
    });
}

// Upload area drag effects
function initUploadArea() {
    const uploadArea = document.querySelector('.ad-upload-area');
    if (!uploadArea) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.style.borderColor = '#4B85E6';
        uploadArea.style.backgroundColor = '#EEF2FF';
    }

    function unhighlight(e) {
        uploadArea.style.borderColor = '#DCDFE6';
        uploadArea.style.backgroundColor = '#FAFAFB';
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        if (files && files.length > 0) {
            // Mock file upload processing
            const firstFile = files[0];
            alert(`模拟上传成功: ${firstFile.name} `);
        }
    }

    // Trigger file input on click
    uploadArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt';
        input.onchange = e => {
            const files = e.target.files;
            if (files && files.length > 0) {
                alert(`模拟选择成功: ${files[0].name} `);
            }
        }
        input.click();
    });
}

// Select All / Deselect All logic for Data Sources
function initSelectAll() {
    const btn = document.getElementById('data-source-select-all');
    const checkboxes = document.querySelectorAll('.ad-source-list .ad-source-checkbox');
    if (!btn || checkboxes.length === 0) return;

    let allSelected = true;

    btn.addEventListener('click', () => {
        allSelected = !allSelected;
        checkboxes.forEach(cb => cb.checked = allSelected);
    });
}

// Drag and Drop for Skill Templates
function initDragAndDrop() {
    const list = document.querySelector('.ad-skill-list');
    if (!list) return;

    let draggedItem = null;

    const items = document.querySelectorAll('.ad-skill-item');

    items.forEach(item => {
        item.setAttribute('draggable', true);

        item.addEventListener('dragstart', function (e) {
            draggedItem = this;
            setTimeout(() => this.style.opacity = '0.5', 0);
        });

        item.addEventListener('dragend', function () {
            setTimeout(() => {
                this.style.opacity = '1';
                draggedItem = null;
                reorderBadges();
            }, 0);
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        item.addEventListener('dragenter', function (e) {
            e.preventDefault();
            this.style.borderBottom = '2px solid #4B85E6';
        });

        item.addEventListener('dragleave', function () {
            this.style.borderBottom = '1px solid #EAECEF'; // var(--border-color)
        });

        item.addEventListener('drop', function () {
            this.style.borderBottom = '1px solid #EAECEF';
            if (this !== draggedItem) {
                // Determine whether to insert before or after
                let allItems = Array.from(list.querySelectorAll('.ad-skill-item'));
                let draggedIndex = allItems.indexOf(draggedItem);
                let dropIndex = allItems.indexOf(this);

                if (draggedIndex < dropIndex) {
                    this.after(draggedItem);
                } else {
                    this.before(draggedItem);
                }
            }
        });
    });

    function reorderBadges() {
        const currentItems = list.querySelectorAll('.ad-skill-item');
        currentItems.forEach((item, index) => {
            const badge = item.querySelector('.ad-skill-badge');
            if (badge) {
                badge.innerText = index + 1;
            }
        });
    }
}

// Add Custom Skill logic
function initCustomSkillSubmit() {
    const submitBtn = document.querySelector('.ad-cs-submit');
    const input = document.querySelector('.ad-cs-input-wrapper input');
    const list = document.querySelector('.ad-skill-list');

    if (!submitBtn || !input || !list) return;

    submitBtn.addEventListener('click', () => {
        const skillName = input.value.trim();
        if (skillName) {
            // Add new skill item to the top or bottom of the list
            const currentItemCount = list.querySelectorAll('.ad-skill-item').length;
            const newIndex = currentItemCount + 1;

            const newItem = document.createElement('label');
            newItem.className = 'ad-skill-item';
            newItem.setAttribute('draggable', true);
            newItem.innerHTML = `
            < i class="fa-solid fa-grip-vertical ad-drag-handle" ></i >
                <input type="checkbox" class="ad-skill-checkbox" checked>
                    <span class="ad-skill-name">${skillName}</span>
                    <div class="ad-skill-badge">${newIndex}</div>
                    `;

            // Append to DOM
            list.appendChild(newItem);

            // Re-bind DnD for new Item
            newItem.addEventListener('dragstart', function (e) {
                draggedItem = this;
                setTimeout(() => this.style.opacity = '0.5', 0);
            });
            newItem.addEventListener('dragend', function () {
                setTimeout(() => {
                    this.style.opacity = '1';
                    draggedItem = null;
                    // Re-bind requires global scope or restructuring, keeping simple for prototype
                    const currentItems = list.querySelectorAll('.ad-skill-item');
                    currentItems.forEach((item, index) => {
                        const badge = item.querySelector('.ad-skill-badge');
                        if (badge) badge.innerText = index + 1;
                    });
                }, 0);
            });
            newItem.addEventListener('dragover', function (e) { e.preventDefault(); });
            newItem.addEventListener('dragenter', function (e) { e.preventDefault(); this.style.borderBottom = '2px solid #4B85E6'; });
            newItem.addEventListener('dragleave', function () { this.style.borderBottom = '1px solid #EAECEF'; });
            newItem.addEventListener('drop', function () {
                this.style.borderBottom = '1px solid #EAECEF';
                let draggedItem = document.querySelector('.ad-skill-item[style*="opacity: 0.5"]');
                if (draggedItem && draggedItem !== this) {
                    this.before(draggedItem);
                }
            });

            // Clear input 
            input.value = '';
        }
    });

    // Handle Enter Key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
}

// Generate button action
function initGenerationButton() {
    const generateBtn = document.querySelector('.ad-btn-generate');
    if (!generateBtn) return;
    generateBtn.addEventListener('click', () => {
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 正在生成报告...';
        generateBtn.style.opacity = '0.8';
        generateBtn.disabled = true;

        setTimeout(() => {
            generateBtn.innerHTML = '<i class="fa-solid fa-check"></i> 生成完毕';
            generateBtn.style.backgroundColor = '#10B981';

            setTimeout(() => {
                generateBtn.innerHTML = originalText;
                generateBtn.style.backgroundColor = '';
                generateBtn.style.opacity = '1';
                generateBtn.disabled = false;
            }, 3000);
        }, 2000);
    });
}
