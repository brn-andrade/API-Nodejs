module.exports = {
  apps: [{
    name: "meat_api",
    script: "./dist/main.js",
    instances: 0,
    exec_mode: "cluster",
    watch: true,
    merge_logs: true,
    env: {
      NODE_ENV: "DEVELOPMENT",
      SERVER_PORT: 3000,
      DB_URL: 'mongodb://localhost/meat-api-dev',
      SALT_ROUNDS: 10,
      JWT_SECRET: 'meat-api-secret',
      ENABLE_HTTPS: false,
      CERTICATE_FILE: './security/keys/cert.pem',
      CERTI_KEY_FILE: './security/keys/key.pem'
    },
    env_prod: {
      NODE_ENV: "PRODUCTION",
      SERVER_PORT: 80,
      DB_URL: 'mongodb://localhost/meat-api',
      SALT_ROUNDS: 50,
      JWT_SECRET: 'Q1a2z3W4s5x6E7d8c9',
      ENABLE_HTTPS: true,
      CERTICATE_FILE: './security/keys/cert.pem',
      CERTI_KEY_FILE: './security/keys/key.pem'
    }
  }]
}