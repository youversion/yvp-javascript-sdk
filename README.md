# YouVersion Platform JavaScript SDK

A lightweight JavaScript SDK for integrating YouVersion Platform features into web applications.

## Features

- **Bible Text**: Display Bible verses with version support
- **Verse of the Day**: Show the daily verse
- **Login**: YouVersion OAuth login functionality

## Installation

### Via CDN

```html
<script type="module" src="https://api-dev.youversion.com/sdk.js"></script>
```

<!-- ### Via NPM (coming soon)

```bash
npm install @youversion/yvp-javascript-sdk
``` -->

## Usage

### Add App key

Get your App key from your friendly neighborhood YouVersion Platform representative.
Later, of course, we will have a public website for this.

The App key is not a secret and can be exposed in your code.

Add the App key to your page either on the body element or in a script tag:

```html
<body data-youversionplatformkey='YOUR_APP_KEY'>
```

Or:

```html
<script>
  window.youversionplatformkey = 'YOUR_APP_KEY';
</script>
```

### Display a Bible verse

```html
<bible-text usfm="JHN.3.16" version="111"></bible-text>
```

Or for a range:

```html
<bible-text usfm="JHN.3.16-JHN.3.17" version="111"></bible-text>
```

### Display the Verse of the Day

```html
<votd-text version="111"></votd-text>
```

### Add a Login Button

```html
<youversion-login-button></youversion-login-button>
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the SDK:
   ```bash
   npm run build
   ```

3. Deploy to GCP (requires gcloud CLI and permissions):
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

