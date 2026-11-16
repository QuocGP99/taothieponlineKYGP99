<?php
// ========================================================
// GP STUDIO99 – KILL PROCESS BẰNG NATIVE LINUX /PROC VÀ POSIX
// ========================================================
// KHÔNG dùng exec() hay shell_exec() nên KHÔNG bị chặn khi đầy process!
header('Content-Type: text/html; charset=utf-8');

echo "<div style='font-family:system-ui, sans-serif; max-width:680px; margin:40px auto; padding:24px; border-radius:12px; background:#111827; color:#f3f4f6; box-shadow:0 10px 25px rgba(0,0,0,0.3);'>";
echo "<h2 style='color:#ef4444; margin-top:0;'>🛑 Giải phóng tiến trình khẩn cấp (Zero-Fork)</h2>";

$killed = 0;
$procs = [];

// Quét trực tiếp thư mục /proc của Linux
if (is_dir('/proc')) {
    $dirs = scandir('/proc');
    foreach ($dirs as $d) {
        if (ctype_digit($d)) {
            $pid = (int)$d;
            if ($pid === getmypid()) {
                continue; // Bỏ qua tiến trình PHP hiện tại
            }
            $cmdFile = "/proc/$pid/cmdline";
            if (is_readable($cmdFile)) {
                $cmd = @file_get_contents($cmdFile);
                if ($cmd !== false && (stripos($cmd, 'node') !== false || stripos($cmd, 'npm') !== false)) {
                    $cleanCmd = str_replace("\0", " ", trim($cmd));
                    $procs[] = "PID: $pid - $cleanCmd";
                    
                    // Gửi tín hiệu SIGKILL trực tiếp qua kernel (không cần fork process)
                    if (function_exists('posix_kill')) {
                        if (@posix_kill($pid, 9)) {
                            $killed++;
                        }
                    }
                }
            }
        }
    }
}

// Tạo file tín hiệu restart cho Phusion Passenger
@mkdir(__DIR__ . '/tmp', 0755, true);
@touch(__DIR__ . '/tmp/restart.txt');

echo "<div style='background:#1f2937; padding:16px; border-radius:8px; border:1px solid #374151; font-family:monospace; font-size:13px; line-height:1.6; margin:16px 0;'>";
echo "<b style='color:#fbbf24;'>Các tiến trình Node/NPM phát hiện được:</b><br>";
if (count($procs) > 0) {
    echo implode("<br>", array_map('htmlspecialchars', $procs));
} else {
    echo "<span style='color:#9ca3af;'>Không tìm thấy tiến trình node/npm nào (hoặc đã được dọn sạch).</span>";
}
echo "</div>";

if ($killed > 0) {
    echo "<div style='background:#064e3b; color:#a7f3d0; padding:16px; border-radius:8px; border:1px solid #059669;'>";
    echo "<b>✓ ĐÃ TIÊU DIỆT $killed TIẾN TRÌNH TREO THÀNH CÔNG!</b><br>";
    echo "Hệ thống đã gửi tín hiệu SIGKILL trực tiếp qua nhân Linux.";
    echo "</div>";
} else {
    echo "<div style='background:#374151; color:#e5e7eb; padding:16px; border-radius:8px;'>";
    echo "<b>Đã kích hoạt tạo <code>tmp/restart.txt</code></b> để Passenger tự động shutdown các worker bị kẹt.";
    echo "</div>";
}

echo "<p style='margin-top:20px; color:#d1d5db;'>👉 Bây giờ bạn hãy đợi <b>1 - 2 phút</b> để CloudLinux giải phóng hạn ngạch, sau đó tải lại cPanel.</p>";
echo "</div>";
?>
