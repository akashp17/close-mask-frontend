let apiKey;

switch (process.env.NODE_ENV) {
  case 'production':
    apiKey = '2eddf079-11b1-4129-92fd-3d790ee7d8f4';
    // apiKey = 'abc1234';
    break;
  default:
    apiKey = 'abc1234';
}

export default {
  apiKey,
};
