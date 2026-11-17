// The address of the Express backend
export const API = 'http://localhost:5000';

// Small helper so every page handles errors the same way.
// It sends the request and returns the JSON. If the server says
// something went wrong, it throws an Error with the server's message.
export async function request(path, method, body) {
  const options = {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API + path, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}
