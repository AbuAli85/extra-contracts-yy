<<<<<<< HEAD
const https = require('https');
const http = require('http');

// Get webhook URL from environment
const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error('❌ MAKE_WEBHOOK_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Testing Make.com Webhook');
console.log('==========================');
console.log(`Webhook URL: ${WEBHOOK_URL}`);
console.log('');

// Test payload
const testPayload = {
  contract_id: `test-${Date.now()}`,
  first_party_name: "Test Company A",
  second_party_name: "Test Company B", 
  promoter_name: "Test Promoter",
  start_date: "2025-01-01",
  end_date: "2026-01-01",
  job_title: "Software Engineer",
  email: "test@example.com"
};

console.log('📤 Sending test payload...');
console.log('Payload:', JSON.stringify(testPayload, null, 2));
console.log('');

// Make HTTP request
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Test the webhook
async function testWebhook() {
  try {
    console.log('⏳ Testing webhook connection...');
    
    const response = await makeRequest(WEBHOOK_URL, JSON.stringify(testPayload));
    
    console.log('📥 Response received:');
    console.log(`Status Code: ${response.statusCode}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    console.log(`Response: ${response.data}`);
    console.log('');
    
    if (response.statusCode === 200) {
      console.log('✅ Webhook test successful!');
      
      if (response.data.trim().toLowerCase() === 'accepted') {
        console.log('✅ Make.com accepted the request');
        console.log('📋 Next: Check your Make.com scenario execution logs');
      } else {
        try {
          const parsedResponse = JSON.parse(response.data);
          console.log('📋 Parsed response:', JSON.stringify(parsedResponse, null, 2));
          
          if (parsedResponse.pdf_url) {
            console.log('🎉 PDF URL found:', parsedResponse.pdf_url);
          }
        } catch (parseError) {
          console.log('⚠️  Response is not JSON, but webhook was successful');
        }
      }
    } else {
      console.log('❌ Webhook test failed');
      console.log(`Error: ${response.data}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
  }
}

=======
const https = require('https');
const http = require('http');

// Get webhook URL from environment
const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error('❌ MAKE_WEBHOOK_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Testing Make.com Webhook');
console.log('==========================');
console.log(`Webhook URL: ${WEBHOOK_URL}`);
console.log('');

// Test payload
const testPayload = {
  contract_id: `test-${Date.now()}`,
  first_party_name: "Test Company A",
  second_party_name: "Test Company B", 
  promoter_name: "Test Promoter",
  start_date: "2025-01-01",
  end_date: "2026-01-01",
  job_title: "Software Engineer",
  email: "test@example.com"
};

console.log('📤 Sending test payload...');
console.log('Payload:', JSON.stringify(testPayload, null, 2));
console.log('');

// Make HTTP request
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Test the webhook
async function testWebhook() {
  try {
    console.log('⏳ Testing webhook connection...');
    
    const response = await makeRequest(WEBHOOK_URL, JSON.stringify(testPayload));
    
    console.log('📥 Response received:');
    console.log(`Status Code: ${response.statusCode}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    console.log(`Response: ${response.data}`);
    console.log('');
    
    if (response.statusCode === 200) {
      console.log('✅ Webhook test successful!');
      
      if (response.data.trim().toLowerCase() === 'accepted') {
        console.log('✅ Make.com accepted the request');
        console.log('📋 Next: Check your Make.com scenario execution logs');
      } else {
        try {
          const parsedResponse = JSON.parse(response.data);
          console.log('📋 Parsed response:', JSON.stringify(parsedResponse, null, 2));
          
          if (parsedResponse.pdf_url) {
            console.log('🎉 PDF URL found:', parsedResponse.pdf_url);
          }
        } catch (parseError) {
          console.log('⚠️  Response is not JSON, but webhook was successful');
        }
      }
    } else {
      console.log('❌ Webhook test failed');
      console.log(`Error: ${response.data}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
  }
}

>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
testWebhook();
