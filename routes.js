const fs = require('fs')
const requestHandler = (req, res) => {
    const url = req.url
    const method = req.method

    if (req.url === '/') {
        fs.readFile('formValues.txt', { encoding: 'utf-8' }, (err, data) => {
            res.setHeader('Content-Type', 'text/html');

            let message = data ? `<h3>${data}</h3>` : "<h3>No message yet</h3>";

            res.end(`
                ${message}
                <form action="/message" method="POST">
                    <label>Name:</label>
                    <input type="text" name="username"></input>
                    <button type="submit">Add</button>
                </form>
            `);
        });
    }
    else {
        if (req.url == '/message' && method === 'POST') {
            res.setHeader('Content-Type', 'text/html')

            let dataChunks = []
            req.on('data', (chunks) => {
                dataChunks.push(chunks)
            })

            req.on('end', () => {
                let combineBuffer = Buffer.concat(dataChunks)

                let value = combineBuffer.toString().split("=")

                fs.writeFile('formValues.txt', value[1], (err) => {
                    res.statusCode = 302
                    res.setHeader('Location', '/')
                    res.end()
                })
            })
        }

    }
}

const anotherFunction = () => {
    console.log("Inside Anothrer function")
}
module.exports = { requestHandler, anotherFunction }