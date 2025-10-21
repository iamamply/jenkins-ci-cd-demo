// test_integration.js
const request = require('supertest');
const assert = require('assert');
// ⭐️ ดึง requestHandler แทน server object ⭐️
const requestHandler = require('./app'); 

describe('Integration Test: Basic HTTP Server Endpoint', function() {
    this.timeout(5000); 

    it('should respond with status 200 and the correct body on GET /', async function() {
        const expectedBody = 'Hello K8s from CI/CD Pipeline v58!!!!++++!\n';

        // ⭐️ ACT: ส่ง requestHandler เข้าไปใน request() โดยตรง ⭐️
        const response = await request(requestHandler) 
            .get('/'); 

        // ASSERT: ตรวจสอบผลลัพธ์
        assert.strictEqual(response.statusCode, 200, 'Status code should be 200 OK');
        assert.strictEqual(response.headers['content-type'], 'text/plain', 'Content-Type header is incorrect');
        assert.strictEqual(response.text, expectedBody, 'Response body text does not match expected message');
    });

    // ⭐️ ลบ after hook ออก เพราะเราไม่ได้ใช้ server.listen() ⭐️
    // after(function(done) {
    //     server.close(done); 
    // });
});
