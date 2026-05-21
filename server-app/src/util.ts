export const SHORT_URLS = { subdomain: "tiny", tld: "url" } as const

export const notFound = (frontEndUrl: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link Not Found</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #fff;
      color: #111;
    }
    .container {
      text-align: center;
    }
    h1 {
      font-size: 4rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }
    p {
      font-size: 1rem;
      color: #666;
      margin: 0 0 2rem;
    }
    a {
      display: inline-block;
      padding: 0.6rem 1.2rem;
      background: #111;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>This link has expired or doesn't exist.</p>
    <a href="${frontEndUrl}">Return home</a>
  </div>
</body>
</html>`;