class Client {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.DEFAULT_HEADERS = {
      'Content-Type': 'application/json',
    };
  }

  async _request(url, options) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          ...this.DEFAULT_HEADERS,
          ...options.headers,
        },
      });
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async get(url) {
    return this._request(url, { method: 'GET' });
  }

  async post(url, data) {
    return this._request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async put(url, data) {
    return this._request(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async delete(url) {
    return this._request(url, { method: 'DELETE' });
  }
}

export default Client;
