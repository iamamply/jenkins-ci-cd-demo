// test_integration.js

const request = require('supertest'); // 1. Supertest สำหรับจำลอง Request
const assert = require('assert');     // 2. Assert สำหรับตรวจสอบผลลัพธ์
const server = require('./app');    // 3. ดึง Server Object ที่ Export มา

// ⭐️ 1. ใช้ Mocha/Describe เพื่อจัดกลุ่ม Test ⭐️
describe('Integration Test: Basic HTTP Server Endpoint', function() {
    // กำหนด Timeout ให้ยาวขึ้นเผื่อ Supertest ต้อง Start/Stop
    this.timeout(5000); 

    it('should respond with status 200 and the correct body on GET /', async function() {
        // Arrange & Act: ใช้ Supertest จำลอง Request ไปยัง Server
        const response = await request(server)
            .get('/'); // เรียก Endpoint Root (/)

        // ⭐️ Assert: ตรวจสอบผลลัพธ์ ⭐️

        // 1. ตรวจสอบ Status Code
        assert.strictEqual(response.statusCode, 200, 'Status code should be 200 OK');
        
        // 2. ตรวจสอบ Content-Type Header
        assert.strictEqual(response.headers['content-type'], 'text/plain', 'Content-Type header is incorrect');

        // 3. ตรวจสอบ Body (ข้อความที่ส่งกลับมา)
        const expectedBody = 'Hello K8s from CI/CD Pipeline v58!!!!++++!\n';
        assert.strictEqual(response.text, expectedBody, 'Response body text does not match expected message');
    });

    // 💡 อย่าลืมปิด Server หลังจากรัน Test เสร็จ เพื่อไม่ให้มีการจองพอร์ตค้างไว้
    after(function(done) {
        server.close(done);
    });
});
