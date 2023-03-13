module.exports = {
  blobsBaseUrl: "https://cyl.blob.core.windows.net",
  allowedOrigins: [
    "https://cyl-front-git-main-tuturno.vercel.app",
    "https://cyl-front-git-dev-tuturno.vercel.app",
  ],
  frontendBaseUrl:
    process.env.CUSTOM_ENV === "production"
      ? "https://cyl-front-git-main-tuturno.vercel.app"
      : process.env.CUSTOM_ENV === "preview"
      ? "https://cyl-front-git-dev-tuturno.vercel.app"
      : "http://localhost:3000",
  backendDomain:
    process.env.CUSTOM_ENV !== "development"
      ? "https://cyl-back.azurewebsites.net"
      : "http://localhost:4000",
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  areWeInProduction: process.env.CUSTOM_ENV === "production",
  tokenExpiration: 1 * 60 * 60 * 24 * 30 * 12, // Está expresado en segundos
  //                  1min  1h   1d  1mes  12meses
}
