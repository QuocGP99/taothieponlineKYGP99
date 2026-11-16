<?php
// ========================================================
// GP STUDIO99 – CÔNG CỤ DỌN DẸP THƯ MỤC .NEXT TRÊN CPANEL
// ========================================================
header('Content-Type: text/html; charset=utf-8');

function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return true;
    }
    if (!is_dir($dir)) {
        @chmod($dir, 0777);
        return @unlink($dir);
    }
    @chmod($dir, 0777);
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }
        $path = $dir . DIRECTORY_SEPARATOR . $item;
        if (!deleteDirectory($path)) {
            return false;
        }
    }
    return @rmdir($dir);
}

echo "<div style='font-family:sans-serif; max-width:600px; margin:40px auto; padding:24px; border-radius:12px; background:#f9fafb; border:1px solid #e5e7eb; box-shadow:0 4px 6px rgba(0,0,0,0.05);'>";
echo "<h2 style='color:#111827; margin-top:0;'>🧹 GP Studio99 – Dọn dẹp thư mục .next</h2>";

$target = __DIR__ . '/.next';

if (file_exists($target)) {
    if (deleteDirectory($target)) {
        echo "<div style='color:#059669; background:#ecfdf5; padding:16px; border-radius:8px; border:1px solid #a7f3d0; margin-bottom:16px;'>";
        echo "<b>✓ ĐÃ XÓA SẠCH THƯ MỤC .NEXT CŨ THÀNH CÔNG!</b><br>";
        echo "Tất cả các tệp xung đột quyền đã được gỡ bỏ hoàn toàn.";
        echo "</div>";
        echo "<p style='color:#374151;'>👉 <b>Bước tiếp theo:</b> Quay lại cPanel File Manager, nhấp chuột phải vào <code>thiep-online-inet-deploy.zip</code> và bấm <b>Extract</b> (Giải nén).</p>";
    } else {
        echo "<div style='color:#dc2626; background:#fef2f2; padding:16px; border-radius:8px; border:1px solid #fecaca;'>";
        echo "<b>Lưu ý:</b> Một số tệp trong .next vẫn bị khóa quyền bởi tiến trình Node.js đang chạy. Hãy vào mục <b>Setup Node.js App</b> bấm nút <b>Stop (Dừng)</b> ứng dụng, sau đó tải lại trang này.";
        echo "</div>";
    }
} else {
    echo "<div style='color:#2563eb; background:#eff6ff; padding:16px; border-radius:8px; border:1px solid #bfdbfe;'>";
    echo "<b>✓ Thư mục .next hiện tại đã sạch sẽ (không bị kẹt).</b><br>";
    echo "Bạn có thể tiến hành giải nén file zip mới ngay bây giờ!";
    echo "</div>";
}

echo "<p style='color:#9ca3af; font-size:13px; margin-top:24px;'>Sau khi giải nén xong, bạn có thể xóa tệp <code>clean.php</code> này khỏi hosting.</p>";
echo "</div>";
?>
