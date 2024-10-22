import Client from '@/libs/Client';

const baseUrl = import.meta.env.VITE_BASE_URL;

if (!baseUrl) {
  console.error('VITE_BASE_URL is not defined in .env file');
}

const client = new Client(baseUrl);

export default client;
