const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    const url = 'http://localhost:3000/api/books';

    // Create a dummy image file
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'fake image content');

    const form = new FormData();
    form.append('title', 'Test Book with File Upload');
    form.append('bookCode', '12345');
    form.append('description', 'Testing multipart upload');
    form.append('frontImage', fs.createReadStream(testImagePath));
    // backImage is optional, let's skip it to test partial upload

    try {
        console.log('Sending multipart request...');
        const response = await fetch(url, {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }

        const data = await response.json();
        console.log('Success! Book created:', data.id);
        console.log('Front Image URL:', data.frontImage);

        if (!data.frontImage || !data.frontImage.includes('/uploads/')) {
            throw new Error('Front image URL is malformed or missing');
        }

        // Cleanup
        if (data.id) {
            console.log(`Deleting test book ${data.id}...`);
            const delResponse = await fetch(`${url}/${data.id}`, { method: 'DELETE' });
            if (delResponse.ok) console.log('Cleanup successful.');
            else console.log('Cleanup failed.');
        }

        // Clean up local test file
        fs.unlinkSync(testImagePath);

    } catch (error) {
        console.error('Test failed:', error);
        // Clean up local test file if exists
        if (fs.existsSync(testImagePath)) fs.unlinkSync(testImagePath);
    }
}

testUpload();
