#!/bin/bash

# LunaTV-config API代理部署辅助脚本（Cloudflare最新界面版）
# 注意：此脚本仅作为指南，实际部署需要在Cloudflare Dashboard上完成

# 脚本说明：
# 1. 登录Cloudflare Dashboard (https://dash.cloudflare.com/)
# 2. 创建新的Worker应用
# 3. 复制对应的worker代码到编辑器
# 4. 保存并部署

# 提示用户选择要部署的Worker类型
read -p "请选择要部署的Worker类型 (1=禁18源, 2=精简版): " choice

case $choice in
    1) 
        echo "\n您选择了部署[禁18源]Worker"
        echo "请复制以下代码到Cloudflare Worker编辑器："
        echo "----------------------------------------"
        cat jin18_worker.js
        echo "----------------------------------------"
        ;;
    2) 
        echo "\n您选择了部署[精简版]Worker"
        echo "请复制以下代码到Cloudflare Worker编辑器："
        echo "----------------------------------------"
        cat jingjian_worker.js
        echo "----------------------------------------"
        ;;
    *) 
        echo "无效的选择，请重新运行脚本。"
        exit 1
        ;;
esac

echo "\n部署完成后，您可以使用以下功能："
echo "1. 代理任意API: https://<您的Worker域名>/?url=https://目标地址"
echo "2. 获取原始JSON配置: https://<您的Worker域名>/?config=0"
echo "3. 获取带代理的JSON配置: https://<您的Worker域名>/?config=1"
echo "4. 获取Base58编码的订阅: https://<您的Worker域名>/?config=1&encode=base58"

echo "\n[最新版Cloudflare界面]详细部署教程："
echo "\n第一步：准备工作"
echo "1. 确保您已有Cloudflare账号（如无，请先注册）"
echo "2. 登录Cloudflare Dashboard (https://dash.cloudflare.com/)"

echo "\n第二步：创建Worker"
echo "3. 在左侧导航菜单中，找到并点击 'Workers & Pages'（工人与页面）"
echo "   - 如果找不到，可以尝试点击菜单顶部的搜索框，输入'Workers'快速查找"
echo "4. 在'Workers & Pages'页面，点击右上角的 'Create' 按钮"
echo "5. 在弹出的菜单中，选择 'Worker' 选项（不是'Pages'）"
echo "6. 为您的Worker设置一个名称（例如：lunatv-proxy），然后点击 'Create worker' 按钮"

echo "\n第三步：部署代码"
echo "7. 进入Worker编辑页面后，您会看到默认的代码编辑器"
echo "8. 清空编辑器中的默认代码"
echo "9. 将本脚本显示的代码复制粘贴到编辑器中"
echo "10. 点击右上角的 'Deploy' 按钮进行部署"
echo "11. 部署完成后，页面会显示您的Worker的访问URL"

echo "\n第四步：测试与使用"
echo "12. 复制显示的URL，在浏览器中访问以测试是否正常工作"
echo "13. 您可以通过添加不同的URL参数来使用不同功能"

echo "\n[常见问题与解决方案]"
echo "Q: 找不到'Create Worker'选项？"
echo "A: 请确认您在'Workers & Pages'页面，并点击右上角的'Create'按钮，然后选择'Worker'"
echo "Q: 没有权限创建Worker？"
echo "A: 请检查您的Cloudflare账号是否有足够权限，或者是否需要升级计划"
echo "Q: 部署后无法访问？"
echo "A: 请检查网络连接，或等待几分钟后再次尝试"

# 显示一个交互式提示，让用户可以复制代码
echo "\n按Enter键继续..."
read