# LunaTV-config API代理部署完全指南（Cloudflare最新界面版）

## 概述

本指南将帮助您在Cloudflare Workers上部署API代理和JSON订阅器功能，实现配置文件的自动代理和Base58编码订阅服务。

## 前提条件

1. 一个Cloudflare账户（[免费注册](https://dash.cloudflare.com/sign-up)）
2. 基本的Web浏览器操作能力
3. 访问本项目的CORSAPI目录

## 部署步骤

### 第一步：准备部署环境

1. 访问Cloudflare Dashboard: https://dash.cloudflare.com/
2. 登录您的Cloudflare账户
3. 确保您已完成邮箱验证（如未验证，按照提示完成）

### 第二步：创建Cloudflare Worker（最新界面版）

1. 在Cloudflare Dashboard左侧导航菜单中，找到并点击 **Workers & Pages**（工人与页面）
   - 如果找不到，可以尝试点击菜单顶部的搜索框，输入"Workers"快速查找
2. 在**Workers & Pages**页面，点击右上角的 **Create** 按钮
3. 在弹出的菜单中，选择 **Worker** 选项（不是"Pages"）
4. 在弹出的窗口中：
   - 为您的Worker命名（例如：`lunatv-api-proxy`）
   - 点击 **Create worker** 按钮

### 第三步：部署Worker代码

1. 在Worker编辑页面，找到代码编辑器区域
2. 打开终端，运行我们的部署辅助脚本：
   ```bash
   cd /root/LunaTV-config/CORSAPI
   ./deploy_helper.sh
   ```
3. 根据提示选择要部署的Worker类型（1=禁18源, 2=精简版）
4. 复制脚本输出的完整代码
5. 回到Cloudflare Worker编辑器，清空现有的默认代码
6. 粘贴从脚本复制的代码到编辑器中
7. 点击右上角的 **Deploy** 按钮
8. 等待部署完成，您会看到"Successfully deployed"的提示
9. 部署完成后，页面会显示您的Worker的访问URL

### 第四步：测试部署

1. 复制显示的Worker URL，在浏览器中访问以测试是否正常工作
2. 尝试访问 `https://<您的Worker域名>/?config=0`，如果能看到JSON配置内容，说明Worker工作正常

### 第五步：配置自定义域名（可选）

1. 在Worker详情页面，点击**Custom Domains**标签
2. 点击**Add Custom Domain**按钮
3. 输入您想使用的子域名（例如：`api.yourdomain.com`）
4. 按照提示完成DNS配置

## 部署辅助脚本使用说明

我们提供了一个辅助脚本`deploy_helper.sh`，用于简化部署过程：

```bash
# 运行脚本
cd /root/LunaTV-config/CORSAPI
./deploy_helper.sh

# 脚本功能：
# 1. 提示用户选择要部署的Worker类型
# 2. 显示对应的Worker代码
# 3. 提供详细的部署步骤说明（基于最新Cloudflare界面）
# 4. 列出部署后的使用方法
# 5. 提供常见问题解答
```

## 部署后功能说明

部署完成后，您的Worker将具备以下功能：

| 功能 | URL格式 | 说明 |
|------|---------|------|
| 通用API代理 | `https://<您的Worker域名>/?url=https://目标地址` | 代理任意API请求，解决跨域问题 |
| 获取原始JSON配置 | `https://<您的Worker域名>/?config=0` | 返回未加代理的原始配置 |
| 获取带代理的JSON配置 | `https://<您的Worker域名>/?config=1` | 自动为配置中的所有API添加您的代理前缀 |
| 获取Base58编码订阅 | `https://<您的Worker域名>/?config=1&encode=base58` | 生成可直接用于LunaTV的Base58编码订阅 |

## 两种Worker版本说明

1. **禁18源版本** (`jin18_worker.js`)
   - 基于`jin18.json`配置文件
   - 移除了成人内容源
   - 适合家庭和公共环境使用

2. **精简版** (`jingjian_worker.js`)
   - 基于`jingjian.json`配置文件
   - 剔除了无搜索结果和污染搜索结果的源
   - 提供更纯净的使用体验

## 常见问题解答

**Q: 部署Worker需要付费吗？**
A: Cloudflare Workers提供免费计划，每月包含100,000次请求和10ms CPU时间，足够个人使用。

**Q: 找不到"Create Worker"选项怎么办？**
A: 请确认您在"Workers & Pages"页面，并点击右上角的"Create"按钮，然后选择"Worker"选项。Cloudflare可能会不定期更新界面，如有变化，请参考页面上的最新指引。

**Q: 如何检查Worker是否正常工作？**
A: 访问`https://<您的Worker域名>/?config=0`，如果能看到JSON配置内容，说明Worker工作正常。

**Q: 可以同时部署两个版本的Worker吗？**
A: 可以，您需要创建两个不同名称的Worker实例，分别部署不同的代码。

**Q: 部署后如何更新代码？**
A: 登录Cloudflare Dashboard，找到您的Worker，编辑代码后重新部署即可。

**Q: 为什么我的代理请求失败了？**
A: 可能的原因包括目标API不可用、请求超时或Cloudflare限制。请检查目标API是否可以正常访问。

**Q: 没有权限创建Worker？**
A: 请检查您的Cloudflare账号是否有足够权限，或者是否需要升级计划。免费账户通常拥有创建Worker的基础权限。

**Q: 部署后无法访问？**
A: 请检查网络连接，或等待几分钟后再次尝试。新部署的Worker可能需要一点时间才能完全生效。

## 注意事项

1. Cloudflare Workers有使用限制，请参考[Cloudflare Workers定价](https://developers.cloudflare.com/workers/platform/pricing/)
2. 不要将Worker用于非法活动或高流量场景
3. 定期检查您的Worker使用情况，避免超出免费额度
4. 如果需要更高的并发和更稳定的服务，建议升级到付费计划
5. Cloudflare可能会更新其界面，如有界面变化，请以官方最新指引为准

## 联系支持

如果您在部署过程中遇到问题，可以参考[Cloudflare Workers文档](https://developers.cloudflare.com/workers/)或在项目仓库中提交Issue。