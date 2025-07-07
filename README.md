# YouVersion Platform JavaScript SDK

> [!NOTE]
> This repository of software is provided exclusively for participants of the “Building the YouVersion Platform Hackathon” during the above dates (the “hackathon”).
> It is provided solely for internal experimentation and prototyping during and as a part of the hackathon. No other rights are granted to use, copy, modify, distribute, or sublicense this repository of software or any derivatives thereof.
> All content remains the exclusive property of YouVersion and is protected by applicable copyright and intellectual property laws. YouVersion reserves all of its rights.

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

### Add App ID

Get your App ID from your friendly neighborhood YouVersion Platform representative.
Later, of course, we will have a public website for this.

The App ID is not a secret and can be exposed in your code.

Add the App ID to your page either on the body element or in a script tag:

```html
<body data-youversion-platform-app-id='YOUR_APP_ID'>
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

