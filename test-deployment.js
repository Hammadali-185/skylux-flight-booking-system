#!/usr/bin/env node

/**
 * SkyLux Airlines - Deployment Test Script
 * Tests the deployed application endpoints
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  backend: 'https://skylux-backend.onrender.com',
  frontend: 'https://skylux-frontend.onrender.com',
  timeout: 10000
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      timeout: config.timeout,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.end();
  });
}

async function testBackend() {
  log('\n🔧 Testing Backend API...', 'blue');
  
  try {
    // Test health endpoint
    log('Testing /api/health...', 'yellow');
    const healthResponse = await makeRequest(`${config.backend}/api/health`);
    
    if (healthResponse.statusCode === 200) {
      log('✅ Backend health check passed', 'green');
    } else {
      log(`❌ Backend health check failed: ${healthResponse.statusCode}`, 'red');
    }

    // Test flights endpoint
    log('Testing /api/flights/search...', 'yellow');
    const flightsResponse = await makeRequest(`${config.backend}/api/flights/search`);
    
    if (flightsResponse.statusCode === 200) {
      log('✅ Flights API endpoint working', 'green');
    } else {
      log(`❌ Flights API failed: ${flightsResponse.statusCode}`, 'red');
    }

    // Test airports endpoint
    log('Testing /api/airports/search...', 'yellow');
    const airportsResponse = await makeRequest(`${config.backend}/api/airports/search`);
    
    if (airportsResponse.statusCode === 200) {
      log('✅ Airports API endpoint working', 'green');
    } else {
      log(`❌ Airports API failed: ${airportsResponse.statusCode}`, 'red');
    }

  } catch (error) {
    log(`❌ Backend test failed: ${error.message}`, 'red');
  }
}

async function testFrontend() {
  log('\n🌐 Testing Frontend...', 'blue');
  
  try {
    const response = await makeRequest(config.frontend);
    
    if (response.statusCode === 200) {
      log('✅ Frontend is accessible', 'green');
      
      // Check if it's serving the React app
      if (response.data.includes('SkyLux') || response.data.includes('React')) {
        log('✅ Frontend is serving React application', 'green');
      } else {
        log('⚠️  Frontend accessible but may not be serving React app', 'yellow');
      }
    } else {
      log(`❌ Frontend failed: ${response.statusCode}`, 'red');
    }

  } catch (error) {
    log(`❌ Frontend test failed: ${error.message}`, 'red');
  }
}

async function testCORS() {
  log('\n🔗 Testing CORS Configuration...', 'blue');
  
  try {
    const response = await makeRequest(`${config.backend}/api/health`, {
      headers: {
        'Origin': config.frontend,
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    const corsHeader = response.headers['access-control-allow-origin'];
    
    if (corsHeader && corsHeader.includes('skylux-frontend.onrender.com')) {
      log('✅ CORS properly configured', 'green');
    } else {
      log('⚠️  CORS configuration may need adjustment', 'yellow');
    }

  } catch (error) {
    log(`❌ CORS test failed: ${error.message}`, 'red');
  }
}

async function runTests() {
  log('🛫 SkyLux Airlines - Deployment Test Suite', 'bold');
  log('=' .repeat(50), 'blue');
  
  const startTime = Date.now();
  
  await testBackend();
  await testFrontend();
  await testCORS();
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  log('\n' + '=' .repeat(50), 'blue');
  log(`🏁 Tests completed in ${duration.toFixed(2)} seconds`, 'bold');
  log('\n📋 Next Steps:', 'yellow');
  log('1. Visit the frontend URL to test the full application', 'reset');
  log('2. Test flight search functionality', 'reset');
  log('3. Verify all pages load correctly', 'reset');
  log('4. Check browser console for any errors', 'reset');
  
  log('\n🔗 URLs:', 'blue');
  log(`Frontend: ${config.frontend}`, 'green');
  log(`Backend:  ${config.backend}`, 'green');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testBackend, testFrontend, testCORS };
