import cairosvg
import os
from pathlib import Path

# SVG图标定义
icons = {
    'home': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
        <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
    </svg>''',

    'plus': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="48" height="48" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor">
        <path d="M12 5l0 14"></path>
        <path d="M5 12l14 0"></path>
    </svg>''',

    'user': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="48" height="48" stroke-width="1.75">
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
    </svg>'''
}

def convert_svg_to_png(svg_content, output_path, color):
    # 替换颜色
    svg_content = svg_content.replace('currentColor', color)

    try:
        # 转换为PNG
        cairosvg.svg2png(
            bytestring=svg_content.encode('utf-8'),
            write_to=output_path,
            output_width=80,
            output_height=80
        )
        print(f"生成图标: {output_path}")
    except Exception as e:
        print(f"转换失败: {e}")

def main():
    # 创建输出目录结构
    project_root = Path(__file__).parent
    icons_dir = project_root / 'src' / 'assets' / 'icons'
    icons_dir.mkdir(parents=True, exist_ok=True)

    # 颜色定义
    normal_color = '#999999'
    active_color = '#07c160'

    # 转换所有图标
    for name, svg in icons.items():
        # 生成正常状态图标
        normal_path = icons_dir / f'{name}.png'
        convert_svg_to_png(svg, str(normal_path), normal_color)

        # 生成选中状态图标
        active_path = icons_dir / f'{name}-active.png'
        convert_svg_to_png(svg, str(active_path), active_color)

if __name__ == '__main__':
    main()
