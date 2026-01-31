# Paver Project

Simple Node.js quotes server + static pages.

## Overview

This repository contains a small Node.js application that serves static HTML and a quotes dataset. It's intended as a minimal demo app.

## Prerequisites

- Node.js (LTS recommended)
- npm (bundled with Node.js)

## Install

Open a terminal in the project root and run:

```bash
npm install
```

## Run

Start the server:

```bash
npm start
# or
node server.js
```

By default the server uses the `start` script in `package.json` which invokes `node server.js`.

## Project files

- `server.js` — Node/Express server serving the app and APIs.
- `package.json` — project metadata and `start` script.
- `index.html` — main frontend page.
- `admin.html` — admin or alternate page.
- `data/quotes.json` — sample data used by the server.
- `index.html.bak` — backup of `index.html`.

## Notes

- No content was modified; this README is added for documentation only.
- If you want me to add a contributing guide, API docs, or tests, tell me which you'd like next.
