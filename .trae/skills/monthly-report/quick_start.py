#!/usr/bin/env python3
"""
月报生成工具快速使用示例
演示如何使用monthly_report_generator.py生成各种格式的工作报告
"""

import os
import sys
import subprocess
from pathlib import Path

def install_dependencies():
    """安装必要的依赖包"""
    print("🔧 正在安装必要的依赖包...")
    try:
        subprocess.check_call([
            sys.executable, '-m', 'pip', 'install', 
            'python-docx', 'markdown'
        ])
        print("✅ 依赖包安装完成！")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 依赖包安装失败: {e}")
        return False

def find_csv_files():
    """查找当前目录下的CSV文件"""
    csv_files = list(Path('.').glob('*.csv'))
    return csv_files

def generate_sample_report():
    """生成示例报告"""
    csv_files = find_csv_files()
    
    if not csv_files:
        print("❌ 未找到CSV文件")
        print("请确保GitLab导出的CSV文件在当前目录下")
        return
    
    print(f"📁 找到 {len(csv_files)} 个CSV文件:")
    for i, file in enumerate(csv_files, 1):
        print(f"  {i}. {file.name}")
    
    # 使用第一个CSV文件
    csv_file = csv_files[0]
    print(f"\n📊 正在为 '{csv_file.name}' 生成月报...")
    
    try:
        # 生成Markdown格式报告（默认输出）
        print("📝 生成Markdown报告...")
        cmd_md = [
            sys.executable, 
            '.trae/skills/monthly-report/monthly_report_generator.py',
            str(csv_file)
        ]
        subprocess.check_call(cmd_md)
        print("✅ Markdown报告生成成功")
        
        print("\n🎉 月报生成完成！")
        print("\n生成的文件:")
        for file in Path('.').glob(f"月度工作报告_*.md"):
            print(f"  📝 {file.name}")
        print("\n如需生成其他格式，请使用以下命令:")
        print(f"  python .trae/skills/monthly-report/monthly_report_generator.py {csv_file.name} --format word")
        print(f"  python .trae/skills/monthly-report/monthly_report_generator.py {csv_file.name} --format all")
            
    except subprocess.CalledProcessError as e:
        print(f"❌ 报告生成失败: {e}")
        print("\n请检查:")
        print("1. CSV文件格式是否正确")
        print("2. Python环境是否正确")
        print("3. 依赖包是否已安装")

def main():
    """主函数"""
    print("🚀 GitLab月报生成工具 - 快速使用示例")
    print("=" * 50)
    
    # 检查是否在正确目录
    if not Path('.trae/skills/monthly-report/monthly_report_generator.py').exists():
        print("❌ 请在项目根目录下运行此脚本")
        return
    
    # 检查依赖
    try:
        import docx
        print("✅ 依赖包已安装")
    except ImportError:
        print("⚠️  检测到依赖包未安装，正在安装...")
        if install_dependencies():
            print("✅ 依赖包安装完成")
        else:
            print("❌ 依赖包安装失败，但会继续生成Markdown报告")
    
    # 直接生成Markdown报告（默认格式）
    print("\n📝 正在生成Markdown格式报告...")
    generate_sample_report()

if __name__ == '__main__':
    main()