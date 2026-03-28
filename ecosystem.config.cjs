module.exports = {
  apps: [
    {
      name: "volta-store",
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
