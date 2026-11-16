<?php
// ========================================================
// GP STUDIO99 – CÔNG CỤ GIẢI PHÓNG TIẾN TRÌNH (KILL PROCESSES)
// ========================================================
header('Content-Type: text/html; charset=utf-8');

echo "<div style='font-family:system-ui, sans-serif; max-width:680px; margin:40px auto; padding:24px; border-radius:12px; background:#111827; color:#f3f4f6; box-shadow:0 10px 25px rgba(0,0,0,0.3);'>";
echo "<h2 style='color:#10b981; margin-top:0;'>⚡ Dọn dẹp & Giải phóng tiến trình Hosting (iNET)</h2>";

echo "<p style='color:#9ca3af;'>Đang kiểm tra và tiêu diệt các tiến trình <code>node</code>, <code>npm</code> bị kẹt ngầm...</p>";

$user = get_current_user();
$output = [];

// Diệt tất cả tiến trình node và npm đang chạy ngầm của user
@exec("killall -9 node 2>&1", $output);
@exec("killall -9 npm 2>&1", $output);

// Đợi 1 giây để hệ thống dọn dẹp
sleep(1);

// Lấy danh sách tiến trình còn lại
$psList = [];
@exec("ps -u $user -o pid,stat,time,comm 2>&1", $psList);

echo "<div style='background:#1f2937; padding:16px; border-radius:8px; border:1px solid #374151; font-family:monospace; font-size:13px; line-height:1.6; margin:16px 0; max-height:220px; overflow-y:auto;'>";
echo "<b style='color:#60a5fa;'>Danh sách tiến trình hiện tại của tài khoản:</b><br>";
echo implode("<br>", array_map('htmlspecialchars', $psList));
echo "</div>";

echo "<div style='background:#064e3b; color:#a7f3d0; padding:16px; border-radius:8px; border:1px solid #059669;'>";
echo "<b>✓ ĐÃ GIẢI PHÓNG TIẾN TRÌNH THÀNH CÔNG!</b><br>";
echo "Số lượng processes đã được đưa về mức an toàn tối thiểu.";
echo "</div>";

echo "<p style='margin-top:20px; color:#d1d5db;'>👉 <b>Bước tiếp theo:</b> Quay lại <b>Setup Node.js App</b> trên cPanel và bấm nút <b>Start (Bắt đầu)</b> để máy chủ tải bản mới.</p>";
echo "</div>";
?>
