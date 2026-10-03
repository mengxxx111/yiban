# -*- coding: utf-8 -*-
"""
一半小程序 · 图池素材压缩入库脚本
- 将旧亚裔 PNG(1.4~1.9MB) 与新图 JPG(342~390KB) 统一压缩为 ≤300KB 的 JPG
- 重命名为 portrait-{g}{age档}-{style}.jpg，输出到 yiban-miniprogram/assets/
- 未来扩池：往 MAP 里加条目即可复用
"""
import os
from PIL import Image

BASE = r"C:\Users\King\Desktop\豆包工作任务\小家项目\一半"
OUT = os.path.join(BASE, "yiban-miniprogram", "assets")
os.makedirs(OUT, exist_ok=True)

# (源相对路径, 目标文件名) —— 与 data/pool-index.json 的 src 一一对应
MAP = [
    ("final_female-25s-cool.png",    "portrait-f25-cool.jpg"),
    ("final_female-25s-sunny.png",   "portrait-f25-sunny.jpg"),
    ("final_female-35s-cool.png",    "portrait-f35-cool.jpg"),
    ("final_female-35s-sunny.png",   "portrait-f35-sunny.jpg"),
    ("final_male-25s-cool.png",      "portrait-m25-cool.jpg"),
    ("final_male-25s-sunny.png",     "portrait-m25-sunny.jpg"),
    ("final_male-35s-cool.png",      "portrait-m35-cool.jpg"),
    ("final_male-35s-sunny.png",     "portrait-m35-sunny.jpg"),
    (os.path.join("图池素材库", "female-20s-warm-001.jpg"),   "portrait-f20-warm.jpg"),
    (os.path.join("图池素材库", "female-20s-sunny-001.jpg"),  "portrait-f20-sunny.jpg"),
    (os.path.join("图池素材库", "female-30s-distant-001.jpg"),"portrait-f30-distant.jpg"),
    (os.path.join("图池素材库", "female-40s-cool-001.jpg"),   "portrait-f40-cool.jpg"),
    (os.path.join("图池素材库", "male-20s-warm-001.jpg"),     "portrait-m20-warm.jpg"),
    (os.path.join("图池素材库", "male-30s-sunny-001.jpg"),    "portrait-m30-sunny.jpg"),
    (os.path.join("图池素材库", "male-30s-warm-001.jpg"),     "portrait-m30-warm.jpg"),
    (os.path.join("图池素材库", "male-40s-warm-001.jpg"),     "portrait-m40-warm.jpg"),
]

MAX_KB = 120
SHORT_EDGE = 768  # 展示尺寸上限（3:4 时即 768x1024；手机物理宽 375-430px，完全清晰）
# 说明：主包 ≤2MB 硬限制，16 张素材总预算 ≤1.9MB，每张 ≤120KB 保证达标


def compress(src_path, dst_path):
    img = Image.open(src_path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    short = min(w, h)
    if short > SHORT_EDGE:
        scale = SHORT_EDGE / short
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    for q in (86, 82, 78, 74, 70, 66, 62, 58, 54, 50, 46):
        img.save(dst_path, "JPEG", quality=q, optimize=True, progressive=True)
        if os.path.getsize(dst_path) <= MAX_KB * 1024:
            return q
    return None


def main():
    results = []
    failed = []
    for rel_src, name in MAP:
        src_path = os.path.join(BASE, rel_src)
        dst_path = os.path.join(OUT, name)
        if not os.path.exists(src_path):
            failed.append((name, "源文件缺失: " + rel_src))
            continue
        q = compress(src_path, dst_path)
        size_kb = round(os.path.getsize(dst_path) / 1024, 1)
        if q is None or size_kb > MAX_KB:
            failed.append((name, "仍超过 %dKB (%sKB)" % (MAX_KB, size_kb)))
        else:
            results.append((name, size_kb, q))

    print("== 成功 ==")
    for name, size, q in sorted(results):
        print("%-28s %8.1f KB  (quality=%s)" % (name, size, q))
    print("共 %d 张，全部 ≤ %dKB：%s" % (len(results), MAX_KB, "是" if not failed else "否"))
    if failed:
        print("== 失败 ==")
        for name, err in failed:
            print("%s: %s" % (name, err))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
