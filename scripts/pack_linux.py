#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""
GP STUDIO99 – ĐÓNG GÓI NEXT.JS STANDALONE TỰ CHẠY CHO INET CPANEL
Giải pháp hoàn hảo: Đã tích hợp sẵn toàn bộ node_modules và server.js tự động.
Người dùng KHÔNG CẦN CHẠY 'npm install' và KHÔNG CẦN CHẠY 'build' trên hosting,
tránh 100% lỗi 'no free processes' do giới hạn tiến trình của iNET.
"""

import os
import sys
import shutil
import zipfile
import subprocess
import time

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    os.chdir(root_dir)
    print(">>> [1/4] Chạy bản build Standalone tối ưu...")
    
    # Đảm bảo bản build standalone mới nhất
    subprocess.check_call('npm run build', shell=True)
    
    standalone_dir = os.path.join(root_dir, '.next', 'standalone')
    if not os.path.exists(standalone_dir):
        print("Lỗi: Không tìm thấy thư mục .next/standalone!")
        sys.exit(1)
        
    staging_dir = os.path.join(root_dir, '.staging-standalone-pack')
    output_zip = os.path.join(root_dir, 'thiep-online-inet-deploy.zip')
    
    if os.path.exists(output_zip):
        os.remove(output_zip)
    if os.path.exists(staging_dir):
        shutil.rmtree(staging_dir)
        
    print(">>> [2/4] Sao chép toàn bộ gói Standalone tự chạy...")
    shutil.copytree(standalone_dir, staging_dir)
    
    # Chép public và .next/static theo chuẩn Next.js Standalone
    public_src = os.path.join(root_dir, 'public')
    if os.path.exists(public_src):
        shutil.copytree(public_src, os.path.join(staging_dir, 'public'))
        
    static_src = os.path.join(root_dir, '.next', 'static')
    static_dest = os.path.join(staging_dir, '.next', 'static')
    if os.path.exists(static_src) and not os.path.exists(static_dest):
        shutil.copytree(static_src, static_dest)
        
    # Chép thêm các file điều hướng cPanel
    extra_files = ['app.js', 'bin', 'database', '.env.example', 'README_INET_DEPLOY.md']
    for item in extra_files:
        src = os.path.join(root_dir, item)
        dst = os.path.join(staging_dir, item)
        if os.path.exists(src):
            if os.path.isdir(src):
                shutil.copytree(src, dst)
            else:
                shutil.copy2(src, dst)
                
    # Sao chép .env nếu có
    if os.path.exists('.env'):
        shutil.copy2('.env', os.path.join(staging_dir, '.env'))
        
    print(">>> [3/4] Đang nén tệp zip Standalone chuẩn Linux POSIX (quyền 0755/0644)...")
    created_dirs = set()
    now_tuple = time.localtime(time.time())[:6]

    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        for current_root, dirs, files in os.walk(staging_dir):
            rel_root = os.path.relpath(current_root, staging_dir).replace('\\', '/')
            if rel_root != '.':
                dir_path = rel_root + '/'
                if dir_path not in created_dirs:
                    d_info = zipfile.ZipInfo(dir_path, now_tuple)
                    d_info.external_attr = (0o755 << 16) | 0x10  # drwxr-xr-x
                    zipf.writestr(d_info, '')
                    created_dirs.add(dir_path)

            for d in dirs:
                abs_d = os.path.join(current_root, d)
                rel_d = os.path.relpath(abs_d, staging_dir).replace('\\', '/') + '/'
                if rel_d not in created_dirs:
                    d_info = zipfile.ZipInfo(rel_d, now_tuple)
                    d_info.external_attr = (0o755 << 16) | 0x10  # drwxr-xr-x
                    zipf.writestr(d_info, '')
                    created_dirs.add(rel_d)

            for file in files:
                abs_file = os.path.join(current_root, file)
                rel_file = os.path.relpath(abs_file, staging_dir).replace('\\', '/')
                
                parent_dir = os.path.dirname(rel_file)
                if parent_dir:
                    parts = parent_dir.split('/')
                    accum = ''
                    for p in parts:
                        accum += p + '/'
                        if accum not in created_dirs:
                            d_info = zipfile.ZipInfo(accum, now_tuple)
                            d_info.external_attr = (0o755 << 16) | 0x10
                            zipf.writestr(d_info, '')
                            created_dirs.add(accum)

                with open(abs_file, 'rb') as f_data:
                    content = f_data.read()
                    
                f_info = zipfile.ZipInfo(rel_file, now_tuple)
                f_info.external_attr = 0o644 << 16
                zipf.writestr(f_info, content)

    # Dọn dẹp staging
    shutil.rmtree(staging_dir)
    
    size_mb = round(os.path.getsize(output_zip) / (1024 * 1024), 2)
    print("=" * 60)
    print(f" HOÀN TẤT! Đã đóng gói Standalone: thiep-online-inet-deploy.zip")
    print(f" Dung lượng gói đầy đủ (bao gồm cả node_modules tối thiểu): {size_mb} MB")
    print(" -> KHÔNG CẦN CHẠY 'npm install' trên iNET!")
    print(" -> KHÔNG CẦN CHẠY 'build' trên iNET!")
    print(" -> CHỈ CẦN GIẢI NÉN VÀ BẤM RESTART!")
    print("=" * 60)

if __name__ == '__main__':
    main()
