// server.js (โค้ดที่ปรับปรุงแล้ว)
const http = require('http');
const port = 8080;

// ⭐️ Unit ที่เราจะทดสอบ: requestHandler ⭐️
const requestHandler = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello K8s from CI/CD Pipeline v58!!!!++++!\n'); // ข้อความที่ใช้
};

const server = http.createServer(requestHandler);

// เงื่อนไขสำหรับรันจริง (เมื่อถูกเรียกใช้โดยตรง)
if (require.main === module) {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

// ⭐️ Export requestHandler เพื่อให้ไฟล์ Test สามารถเรียกใช้ได้โดยตรง
module.exports = { requestHandler };
