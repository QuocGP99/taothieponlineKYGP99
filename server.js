// ========================================================
// GP STUDIO99 – NEXT.JS PRODUCTION SERVER (FOR INET CPANEL)
// ========================================================
// Tập tin khởi động Node.js App trên cPanel iNET (Passenger)
// Thiết lập Application startup file trong cPanel là: server.js

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Lưu ý: Trên cPanel CloudLinux / Phusion Passenger,
// process.env.PORT có thể là cổng số (ví dụ: 3000) hoặc đường dẫn Unix socket (chuỗi).
const port = process.env.PORT || 3000;

app.prepare()
  .then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`[GP STUDIO99] Server sẵn sàng chạy trên: ${port} (Chế độ: ${dev ? 'Development' : 'Production'})`);
    });
  })
  .catch((err) => {
    console.error('[GP STUDIO99] Lỗi khởi động máy chủ Next.js:', err);
    process.exit(1);
  });
