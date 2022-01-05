module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/seven-day-forecast/:state',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}
