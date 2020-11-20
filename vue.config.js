module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/isle-of-the-dead/'
  : '/',
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/isle-of-the-dead/'
    : '/'
}