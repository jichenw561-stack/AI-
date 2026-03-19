// hot_tracks.js - Scripts for the Hot Tracks page

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function () {
    initCharts();
    initFeatureTabs();
});

// Modal logic removed, pages navigate directly to agent detail.

// ---------- Data Workshop Accordion ---------- //
function toggleAccordion(element) {
    const parent = element.parentElement;
    parent.classList.toggle('active');
}

// ---------- Smart QA Chat Logic ---------- //
function handleQaKeyPress(e) {
    if (e.key === 'Enter') {
        sendQaMessage();
    }
}

function sendQaMessage() {
    const input = document.getElementById('qa-input-field');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user');
    input.value = '';

    // Simulate Agent Thinking
    const chatBox = document.getElementById('qa-chat-box');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'msg msg-agent';
    loadingDiv.innerHTML = `<div class="typing-indicator" style="display:inline-block; margin-top:2px;"><span></span><span></span><span></span></div>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate Network Request
    setTimeout(() => {
        chatBox.removeChild(loadingDiv);
        let response = "抱歉，我目前无法回答这个问题。";
        if (msg.includes("复合增长率")) {
            response = "根据左侧赛道增长分析折线图，该赛道2023-2025年复合增长率为 <strong>15.2%</strong>。该增速在整个新能源汽车板块中处于前 10% 水平。";
        } else if (msg.includes("龙头企业") || msg.includes("A")) {
            response = "龙头企业A的优势主要体现在完整的垂直整合供应链体系，使其产品毛利率较行业平均水平高出 5 个百分点，同时在下一代感知技术上拥有超 200 项核心专利。";
        } else {
            response = "基于当前的特色分析数据，我们建议您进一步关注其Q3季报警气度反转信号。如果需要更详细的数据，您可以运行左侧的「竞争格局分析 Agent」。";
        }
        appendMessage(response, 'agent');
    }, 1500);
}

function appendMessage(text, sender) {
    const chatBox = document.getElementById('qa-chat-box');
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'msg msg-user' : 'msg msg-agent';
    div.innerHTML = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------- Feature Analysis Tabs ---------- //
function initFeatureTabs() {
    const tabs = document.querySelectorAll('.fa-tab');
    const contents = document.querySelectorAll('.fa-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // Trigger resize to fix ECharts rendering in hidden divs
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 50);
        });
    });
}

// ---------- ECharts Initialization ---------- //
function initCharts() {
    // Tabs 1, 2, 3 charts have been replaced by custom HTML widgets

    // Tab 4: 产业链 (Currently using custom HTML dashboard, but keep empty functions if needed later)
}

// Handle window resize dynamically to maintain responsiveness
window.addEventListener('resize', () => {
    // Only resize if there are any remaining echarts on the page
});

// ---------- Data Workshop -> Data Browser Navigation ---------- //
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.data-panel .ht-table tbody tr').forEach(row => {
        const btn = row.querySelector('.btn-link');
        if (btn) {
            const indicatorName = row.cells[0].innerText.trim();
            btn.addEventListener('click', () => {
                window.location.href = `data_browser.html?indicator=${encodeURIComponent(indicatorName)}`;
            });
        }
    });
});


