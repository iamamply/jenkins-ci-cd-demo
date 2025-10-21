const assert = require('assert');
// ดึง Unit (requestHandler) ที่เราจะทดสอบจากไฟล์ server.js
const { requestHandler } = require('./app'); 

// ⭐️ Mock Class: จำลองการทำงานของ Response Object ⭐️
class MockResponse {
    constructor() {
        this.statusCode = null;
        this.headers = {};
        this.body = '';
    }
    setHeader(key, value) {
        this.headers[key] = value;
    }
    // ดักจับข้อมูลที่พยายามส่งออกไป
    end(chunk) {
        this.body += chunk; 
    }
}

console.log("--- Running Simple HTTP Handler Unit Test ---");

function test_http_response_content() {
    // Arrange: เตรียม Mock Objects และค่าที่คาดหวัง
    const req = {}; // Request object ว่างเปล่า (เพราะไม่ใช้ข้อมูลจาก req)
    const res = new MockResponse(); // สร้าง Response Mock
    const expectedBody = 'Hello K8s from CI/CD Pipeline v58!!!!++++!\n';

    // Act: เรียกใช้ Unit โดยส่ง Mock Objects เข้าไป
    requestHandler(req, res);

    // Assert: ยืนยันผลลัพธ์ที่ถูกบันทึกไว้ใน Mock Object
    assert.strictEqual(res.statusCode, 200, 'Test Failed: Status code should be 200.');
    assert.strictEqual(res.headers['Content-Type'], 'text/plain', 'Test Failed: Content-Type header is incorrect.');
    assert.strictEqual(res.body, expectedBody, 'Test Failed: Response body message mismatch.');
    
    console.log("Handler Content Test: PASSED ✅");
}

try {
    test_http_response_content();
    console.log("\nALL UNIT TESTS PASSED SUCCESSFULLY! 🎉");
} catch (error) {
    console.error("\nUNIT TESTS FAILED! ❌");
    console.error(error.message);
    process.exit(1); // ทำให้ CI Pipeline ล้มเหลว
}
