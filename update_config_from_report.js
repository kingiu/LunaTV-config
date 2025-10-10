const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, 'report.md');
const configPath = path.join(__dirname, 'LunaTV-config.json');
const MIN_AVAILABILITY = 98.0; // 最小可用率阈值

// 读取 report.md
if (!fs.existsSync(reportPath)) {
    console.error('❌ report.md 不存在，请先运行 check_apis.js');
    process.exit(1);
}

// 读取 LunaTV-config.json
if (!fs.existsSync(configPath)) {
    console.error('❌ LunaTV-config.json 不存在');
    process.exit(1);
}

const reportContent = fs.readFileSync(reportPath, 'utf-8');
const configContent = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configContent);

// 提取 Markdown 表格
const tableMatch = reportContent.match(/\| 状态 \|[\s\S]+?\n\n/);
if (!tableMatch) {
    console.error('❌ report.md 中未找到表格');
    process.exit(1);
}

const tableMd = tableMatch[0].trim();
const lines = tableMd.split('\n');
const rows = lines.slice(2); // 跳过表头

// 解析每一行数据，提取API信息
const apiStats = {};
const apiUrls = []; // 使用数组而不是Set，保留顺序

rows.forEach(line => {
    const cols = line.split('|').map(c => c.trim());
    const status = cols[1]; // 状态列
    const apiName = cols[2]; // API名称列
    const apiAddress = cols[3]; // API地址列
    const availabilityStr = cols[6]; // 可用率列
    
    // 提取可用率数字（去掉%符号）
    const availabilityMatch = availabilityStr.match(/(\d+\.?\d*)%/);
    const availability = availabilityMatch ? parseFloat(availabilityMatch[1]) : 0;
    
    // 记录API地址及其出现顺序
    apiUrls.push(apiAddress);
    
    apiStats[apiAddress] = {
        name: apiName,
        availability: availability
    };
});

// 找出所有重复的API地址
const duplicateApis = new Set();
const seenApis = new Map(); // 记录每个API第一次出现的位置

apiUrls.forEach((url, index) => {
    if (seenApis.has(url)) {
        duplicateApis.add(url);
    } else {
        seenApis.set(url, index);
    }
});

// 更新config，删除可用率低于98%和重复的API（从下往上删除，保留先添加的）
const originalApiCount = Object.keys(config.api_site).length;
const filteredApiSite = {};
const deletedApis = [];

// 用于跟踪已经保留的API地址（从原配置中从前到后遍历）
const keptApiUrls = new Set();

// 从前到后遍历，保留第一个出现的重复API，删除后面的
Object.entries(config.api_site).forEach(([key, apiInfo]) => {
    const apiAddress = apiInfo.api;
    const apiStatsInfo = apiStats[apiAddress];
    
    // 如果API不在report中，保留它
    if (!apiStatsInfo) {
        filteredApiSite[key] = apiInfo;
        keptApiUrls.add(apiAddress);
        return;
    }
    
    // 检查可用率
    if (apiStatsInfo.availability < MIN_AVAILABILITY) {
        deletedApis.push({
            key: key,
            name: apiInfo.name,
            api: apiAddress,
            reason: `可用率低于${MIN_AVAILABILITY}% (${apiStatsInfo.availability}%)`
        });
        return;
    }
    
    // 检查重复（从下往上删除，保留先添加的）
    if (duplicateApis.has(apiAddress) && keptApiUrls.has(apiAddress)) {
        deletedApis.push({
            key: key,
            name: apiInfo.name,
            api: apiAddress,
            reason: '重复API（后添加的重复内容）'
        });
        return;
    }
    
    // 保留API
    filteredApiSite[key] = apiInfo;
    keptApiUrls.add(apiAddress);
});

// 更新config对象
config.api_site = filteredApiSite;

// 写回文件
fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

// 输出统计信息
console.log(`✅ LunaTV-config.json 已更新`);
console.log(`- 原始API数量: ${originalApiCount}`);
console.log(`- 更新后API数量: ${Object.keys(filteredApiSite).length}`);
console.log(`- 删除的API数量: ${deletedApis.length}`);

if (deletedApis.length > 0) {
    console.log('\n🗑️ 删除的API列表:');
    deletedApis.forEach((api, index) => {
        console.log(`${index + 1}. ${api.name} (${api.key}): ${api.reason}`);
    });
}

// 导出函数以便在其他脚本中使用（如果需要）
module.exports = {
    updateConfigFromReport: () => {
        // 这里可以放置主要逻辑，但实际上已经在脚本顶部执行了
        return { updated: true, deletedCount: deletedApis.length };
    }
};