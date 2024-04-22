// import axios from 'axios';
// /**
//  * Wrapper for fetch
//  * @param url
//  * @param body
//  * @returns
//  */
// export async function request(url: string, body?: any) {
//     try {
//         const rsp = body ? await axios.post(url, body, {
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         }) : await axios.get(url);

//         return await rsp.data;
//     } catch (error) {
//         throw new Error(`http ${url} with ${JSON.stringify(body)} failed : ${error}`);
//     }

// }

import * as http from 'http';
import * as https from 'https';

export async function request(
  url: string,
  body?: any,
  timeout: number = 30000
) {
  const result = await new Promise((resolve, reject) => {
    // Parse the URL to extract hostname, port, and path
    const u = new URL(url);

    // Prepare options for the HTTP request
    const options = {
      hostname: u.hostname,
      port: u.port || (u.protocol.startsWith('https') ? '443' : '80'),
      path: u.pathname,
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body ? Buffer.byteLength(JSON.stringify(body)) : 0,
      },
    };

    // Create the request object
    const protocol = u.protocol.startsWith('https') ? https : http;

    const req = protocol.request(options, res => {
      const { statusCode } = res;
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        if (statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(
            new Error(
              `http ${url} with ${JSON.stringify(
                body
              )} failed status: ${statusCode}, body: ${data}`
            )
          );
        }
      });
    });

    // Handle errors
    req.on('error', error => {
      reject(
        new Error(`http ${url} with ${JSON.stringify(body)} failed: ${error}`)
      );
    });
    req.setTimeout(timeout, () => {
      reject(new Error(`http ${url} with ${JSON.stringify(body)} timeout`));
    });

    // Write the request body data if present
    if (body) {
      req.write(JSON.stringify(body));
    }

    // End the request
    req.end();
  });
  return result as any;
}
