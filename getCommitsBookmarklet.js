javascript:(function() {
    'use strict';

    // --- 1. 创建控制面板 ---
    const panel = document.createElement('div');
    panel.id = 'gl-scraper-container';
    panel.innerHTML = `
        <div id="gl-scraper-panel" style="position:fixed; top:80px; right:20px; z-index:9999; background:#fff; border:1px solid #ddd; border-radius:12px; padding:15px; box-shadow:0 8px 24px rgba(0,0,0,0.2); width:240px; font-family:system-ui, -apple-system, sans-serif;">
            <div id="close-scraper" style="position:absolute; top:8px; right:12px; cursor:pointer; font-size:18px; color:#999; font-weight:bold; line-height:1;" title="关闭面板">×</div>
            <h4 style="margin:0 0 12px; font-size:15px; color:#333; border-bottom:1px solid #eee; padding-bottom:8px; padding-right:20px;">GitLab 采集助手</h4>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">选择目标月份:</label>
                <input type="month" id="target-month" style="width:100%; padding:6px; border:1px solid #dcdfe6; border-radius:4px;" value="${new Date().toISOString().slice(0, 7)}">
            </div>
            <button id="start-btn" style="width:100%; padding:10px; background:#108ee9; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold; transition:all 0.3s;">开始采集</button>
            <div id="status-msg" style="margin-top:12px; font-size:12px; color:#888; line-height:1.6; background:#f9f9f9; padding:8px; border-radius:4px; max-height:100px; overflow-y:auto;">等待操作...</div>
        </div>
    `;
    document.body.appendChild(panel);

    const startBtn = document.getElementById('start-btn');
    const statusMsg = document.getElementById('status-msg');
    const monthInput = document.getElementById('target-month');
    const closeBtn = document.getElementById('close-scraper');

    closeBtn.onclick = () => { if (confirm('确认关闭采集助手？')) panel.remove(); };
    closeBtn.onmouseover = () => { closeBtn.style.color = '#ff4d4f'; };
    closeBtn.onmouseout = () => { closeBtn.style.color = '#999'; };

    function cleanContent(text) {
        if (!text) return '';
        return text.trim().replace(/^[【\s=-]+/, '').replace(/】$/, '');
    }

    startBtn.onclick = async () => {
        const TARGET_MONTH = monthInput.value;
        if (!TARGET_MONTH) return alert('请选择年份和月份');
        startBtn.disabled = true;
        startBtn.innerText = '采集运行中...';
        startBtn.style.background = '#a0cfff';
        const allData = [];
        let pageNo = 1;
        try {
            while (true) {
                statusMsg.innerText = `正在分析第 ${pageNo} 页...`;
                await waitFor(() => document.querySelector('.flex.items-center.mb-4'), 8000);
                const { pageData, isPastTarget } = await scrapeCurrentPage(TARGET_MONTH);
                allData.push(...pageData);
                statusMsg.innerHTML = `已采集 ${allData.length} 条记录<br>当前页：${pageNo}`;
                if (isPastTarget) break;
                const nextBtn = Array.from(document.querySelectorAll('button, div, a'))
                    .find(el => {
                        const txt = el.textContent.trim();
                        return (txt === '下一页' || txt === 'Next') && !el.disabled && !el.classList.contains('t-is-disabled');
                    });
                if (!nextBtn) break;
                nextBtn.click();
                pageNo++;
                await waitForPageChange();
            }
            statusMsg.innerHTML = `<b style="color:#52c41a;">采集成功！共 ${allData.length} 条。</b>`;
            downloadCSV(allData, `GitLab_Export_${TARGET_MONTH}.csv`);
        } catch (err) {
            statusMsg.innerHTML = `<span style="color:red;">失败: ${err}</span>`;
        } finally {
            startBtn.disabled = false;
            startBtn.innerText = '开始采集';
            startBtn.style.background = '#108ee9';
        }
    };

    async function scrapeCurrentPage(targetMonth) {
        const data = [];
        let isPastTarget = false;
        const dateHeaders = document.querySelectorAll('.flex.items-center.mb-4');
        for (const header of dateHeaders) {
            const dayRaw = header.querySelector('.text-sm.text-ter')?.textContent?.trim() || '';
            const day = dayRaw.replace(/^提交于\s*/, '');
            if (day < targetMonth && !day.startsWith(targetMonth)) { isPastTarget = true; continue; }
            if (!day.startsWith(targetMonth)) continue;
            const commitList = header.parentElement.querySelector('ul.commits-item');
            if (!commitList) continue;
            for (const li of commitList.querySelectorAll(':scope > li')) {
                let desc = '';
                const arrow = li.querySelector('.flex.items-center.h-6 > div');
                if (arrow) {
                    arrow.click();
                    for (let i = 0; i < 20; i++) {
                        const descEl = li.querySelector('.text-sm.text-ter.font-Hack');
                        if (descEl) { desc = cleanContent(descEl.textContent); break; }
                        await new Promise(r => setTimeout(r, 50));
                    }
                }
                const title = cleanContent(li.querySelector('span[title]')?.getAttribute('title') || '');
                const authorBlock = li.querySelector('.text-sm.text-sec.max-lg\\:flex-wrap');
                const author = authorBlock?.childNodes[0]?.textContent?.trim() || '';
                const email = authorBlock?.querySelector('span.max-laptop\\:hidden')?.textContent?.trim() || '';
                data.push({ time: day, title, desc, author, email });
            }
        }
        return { pageData: data, isPastTarget };
    }

    function downloadCSV(data, filename) {
        const headers = ['时间', '标题', '描述', '作者', '邮箱'];
        const csvContent = "\uFEFF" + [
            headers.join(','),
            ...data.map(r => [r.time, r.title, r.desc, r.author, r.email]
                .map(v => {
                    let val = (v || '').replace(/"/g, '""');
                    if (/^[-=+@]/.test(val)) val = ' ' + val; 
                    return `"${val}"`;
                }).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    function waitFor(fn, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const st = Date.now();
            const tid = setInterval(() => {
                if (fn()) { clearInterval(tid); resolve(); }
                else if (Date.now() - st > timeout) { clearInterval(tid); reject('加载超时'); }
            }, 300);
        });
    }

    async function waitForPageChange() {
        const oldHref = location.href;
        await waitFor(() => location.href !== oldHref, 5000).catch(() => {});
        await new Promise(r => setTimeout(r, 1200));
    }
})();