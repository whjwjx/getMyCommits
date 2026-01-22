---
name: "monthly-report-generator"
description: "自动生成GitLab月度工作报告，支持MD/Word/JSON格式输出，包含每日工作记录和统计分析。适用于月度工作总结汇报。"
---

# 月度工作报告生成器

这是一个专门为开发团队设计的GitLab月度工作报告生成工具，能够自动解析GitLab导出的CSV数据，生成结构化的工作报告。

## 🎯 功能特性

- **智能分类**: 自动将提交记录分类为功能开发、问题修复、样式优化等8个类别
- **每日记录**: 详细记录每日工作内容，按时间顺序组织
- **统计分析**: 提供工作分类统计、功能模块统计、作者活跃度分析
- **多格式输出**: 支持Markdown、Word、JSON三种格式输出
- **工作总结**: 自动生成工作总结和亮点分析

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装Python依赖包
python .trae/skills/monthly-report/monthly_report_generator.py <your_gitlab_export.csv> --install-deps
```

### 2. 基本使用

```bash
# 生成Markdown格式报告
python .trae/skills/monthly-report/monthly_report_generator.py <your_gitlab_export.csv>

# 生成Word格式报告
python .trae/skills/monthly-report/monthly_report_generator.py <your_gitlab_export.csv> --format word

# 生成所有格式报告
python .trae/skills/monthly-report/monthly_report_generator.py <your_gitlab_export.csv> --format all

# 指定输出文件路径
python .trae/skills/monthly-report/monthly_report_generator.py <your_gitlab_export.csv> --output ./reports/my_monthly_report.md
```

## 📊 报告内容

### 月度统计概览
- 总提交次数
- 活跃天数统计
- 主要工作分类分布

### 每日工作记录
按日期组织，包含：
- 提交标题和详细描述
- 工作分类标签
- 作者信息
- 提取的功能模块

### 数据统计分析
- **工作分类统计**: 功能开发、问题修复、样式优化等
- **功能模块统计**: 基于提交标题中的功能模块提取
- **作者贡献统计**: 多作者项目的贡献度分析

## 🛠️ 命令行参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `csv_file` | GitLab导出的CSV文件路径（必需） | `your_gitlab_export.csv` |
| `--output, -o` | 输出文件路径 | `./reports/december_report.md` |
| `--format, -f` | 输出格式：`md`、`word`、`json`、`all` | `--format word` |
| `--install-deps` | 安装必要的Python依赖包 | `--install-deps` |

## 📝 CSV数据格式

工具期望的CSV文件格式（与GitLab导出格式兼容）：

```csv
时间,标题,描述,作者,邮箱
"2025-12-31","feat(模块): 添加新功能","详细描述","作者名","user@example"
"2025-12-30","fix(模块): 修复错误","修复描述","开发者名","user@example"
```

## 💡 使用场景

### 1. 月度工作总结
```bash
python .trae/skills/monthly-report/monthly_report_generator.py <your_gitlab_export.csv> --format all
```

### 2. 快速Markdown报告
```bash
python .trae/skills/monthly-report/monthly_report_generator.py <your_gitlab_export.csv> --output monthly_summary.md
```

### 3. 团队协作汇报
生成Word格式报告，便于在团队会议中分享和讨论。

## 🔧 高级配置

### 自定义输出路径
```bash
# 指定完整的输出路径
python monthly_report_generator.py data.csv --output ./team_reports/2025-12/monthly_report.md
```

### 批量处理多个月份
```bash
# 处理多个CSV文件
for file in GitLab_Export_*-*.csv; do
    python .trae/skills/monthly-report/monthly_report_generator.py "$file" --format all
done
```

## 📈 报告示例

生成的Markdown报告结构：

```markdown
# 2025年12月 开发工作报告

## 📊 本月工作统计
- **总提交次数**: 50 次
- **活跃天数**: 20 天
- **主要工作分类**: 功能开发(30), 问题修复(15), 样式优化(5)

## 📅 每日工作记录

### 2025-12-31

**fix(模块): 修复功能问题**
- 分类: 问题修复
- 作者: 开发者A

### 2025-12-30

**feat(模块): 添加新功能**
- 分类: 功能开发
- 作者: 开发者B

## 🏷️ 工作分类统计
- **功能开发**: 30 次
- **问题修复**: 15 次
- **样式优化**: 5 次

## 🔧 主要功能模块
- **模块A**: 10 次
- **模块B**: 8 次
- **模块C**: 6 次
```

## 🔍 故障排除

### 依赖包安装问题
如果遇到依赖包安装问题，手动安装：
```bash
pip install python-docx markdown
```

### CSV文件格式问题
确保CSV文件使用UTF-8编码，且包含正确的列标题：
- `时间`: 日期，格式为YYYY-MM-DD
- `标题`: Git提交标题
- `描述`: 提交详细描述
- `作者`: 提交作者姓名
- `邮箱`: 作者邮箱地址

### 文件路径问题
使用绝对路径或在正确的工作目录下运行命令。

## 📄 许可证

此工具遵循MIT许可证，可自由使用和修改。