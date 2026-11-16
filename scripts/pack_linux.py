#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""
GP STUDIO99 – ĐÓNG GÓI CHUẨN LINUX CHO HOSTING INET (CPANEL)
Tạo tệp .zip sử dụng POSIX forward-slashes (/) và thiết lập quyền thư mục 0755, quyền tệp 0644
khắc phục hoàn toàn lỗi 'Permission denied' và 'checkdir error' trên cPanel.
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
    print(">>> [1/4] Kiểm tra thư mục .next...")
    
    if not os.path.exists('.next'):
        print(">>> Thư mục .next chưa tồn tại. Đang chạy build...")
        subprocess.check_call('npm run build', shell=True)
        
    staging_dir = os.path.join(root_dir, '.staging-linux-pack')
    output_zip = os.path.join(root_dir, 'thiep-online-inet-deploy.zip')
    
    # Dọn dẹp
    if os.path.exists(output_zip):
        os.remove(output_zip)
    if os.path.exists(staging_dir):
        shutil.rmtree(staging_dir)
        
    print(">>> [2/4] Sao chép các tệp cần thiết...")
    os.makedirs(staging_dir, exist_ok=True)
    
    # 1. Các tệp root
    files_to_copy = [
        'package.json',
        'package-lock.json',
        'next.config.js',
        'server.js',
        'app.js',
        '.env.example',
        'README_INET_DEPLOY.md'
    ]
    for f in files_to_copy:
        if os.path.exists(f):
            shutil.copy2(f, os.path.join(staging_dir, f))
            
    # 2. Các thư mục source
    folders_to_copy = ['public', 'database', 'src']
    for folder in folders_to_copy:
        if os.path.exists(folder):
            shutil.copytree(folder, os.path.join(staging_dir, folder))
            
    # 3. Thư mục .next (loại trừ cache)
    print(">>> [3/4] Tối ưu hóa thư mục .next (bỏ qua cache)...")
    dest_next = os.path.join(staging_dir, '.next')
    os.makedirs(dest_next, exist_ok=True)
    for item in os.listdir('.next'):
        if item == 'cache':
            continue
        s_item = os.path.join('.next', item)
        d_item = os.path.join(dest_next, item)
        if os.path.isdir(s_item):
            shutil.copytree(s_item, d_item)
        else:
            shutil.copy2(s_item, d_item)
            
    # 4. Nén zip với POSIX forward-slashes (/) và phân quyền 0755 / 0644
    print(">>> [4/4] Đang nén zip với phân quyền thư mục 0755 và tệp 0644...")
    created_dirs = set()
    now_tuple = time.localtime(time.time())[:6]

    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
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
                
                # Đảm bảo các thư mục cha đều đã được ghi nhận quyền 0755
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
                # Phân quyền tệp tin chuẩn Linux: 0644 (-rw-r--r--)
                f_info.external_attr = 0o644 << 16
                zipf.writestr(f_info, content)

    # Dọn dẹp staging
    shutil.rmtree(staging_dir)
    
    size_mb = round(os.path.getsize(output_zip) / (1024 * 1024), 2)
    print("=" * 60)
    print(f" HOÀN TẤT! Đã tạo thành công gói cài đặt Linux: thiep-online-inet-deploy.zip")
    print(f" Dung lượng: {size_mb} MB")
    print(f" Số lượng thư mục được phân quyền 0755: {len(created_dirs)}")
    print("=" * 60)

if __name__ == '__main__':
    main()
