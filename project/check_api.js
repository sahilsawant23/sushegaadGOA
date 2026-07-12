
const http = require('http');

http.get('http://localhost:5000/api/tours', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received.
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Type of response:', Array.isArray(json) ? 'Array' : typeof json);
            if (Array.isArray(json)) {
                console.log('Length:', json.length);
                console.log('First item keys:', Object.keys(json[0]));
                console.log('First item images type:', typeof json[0].images);
                console.log('First item images value:', json[0].images);
            } else {
                console.log('Keys:', Object.keys(json));
            }
        } catch (e) {
            console.log('Not JSON:', data.substring(0, 100));
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
