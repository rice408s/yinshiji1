from PIL import Image, ImageDraw
import os
from pathlib import Path

def create_icon(name, color, size=(80, 80)):
    # 创建一个透明背景的图像
    image = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    if name == 'home':
        # 绘制房子图标
        # 屋顶
        draw.polygon([(40, 10), (10, 35), (70, 35)], outline=color, width=2)
        # 房子主体
        draw.rectangle([15, 35, 65, 70], outline=color, width=2)
        # 门
        draw.rectangle([30, 45, 50, 70], outline=color, width=2)

    elif name == 'plus':
        # 绘制加号
        # 竖线
        draw.line([(40, 20), (40, 60)], fill=color, width=4)
        # 横线
        draw.line([(20, 40), (60, 40)], fill=color, width=4)

    elif name == 'user':
        # 绘制用户图标
        # 头部
        draw.ellipse([25, 10, 55, 40], outline=color, width=2)
        # 身体
        draw.arc([15, 35, 65, 75], 0, 180, fill=color, width=2)

    return image

def main():
    # 创建输出目录
    icons_dir = Path('src/assets/icons')
    icons_dir.mkdir(parents=True, exist_ok=True)

    # 颜色定义
    normal_color = '#999999'
    active_color = '#07c160'

    # 需要生成的图标
    icon_names = ['home', 'plus', 'user']

    for name in icon_names:
        # 生成正常状态图标
        normal_icon = create_icon(name, normal_color)
        normal_icon.save(icons_dir / f'{name}.png', 'PNG')
        print(f'生成图标: {name}.png')

        # 生成激活状态图标
        active_icon = create_icon(name, active_color)
        active_icon.save(icons_dir / f'{name}-active.png', 'PNG')
        print(f'生成图标: {name}-active.png')

if __name__ == '__main__':
    main()
