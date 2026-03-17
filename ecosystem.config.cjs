module.exports = {
  apps: [
    {
      name: "volta-server",
      script: "./server/index.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }
  ]
};
