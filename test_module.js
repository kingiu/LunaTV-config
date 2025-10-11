try {
    // Try to load the module
    const testModule = require('./update_config_from_report.js');
    console.log('✅ Module loaded successfully!');
    console.log('Module exports:', Object.keys(testModule));
} catch (error) {
    console.error('❌ Error loading module:', error);
    console.error('Error code:', error.code);
    console.error('Require stack:', error.requireStack);
}