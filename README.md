# 📺 FreeTV IPTV Player

A slick web-based IPTV player for the [Free-TV/IPTV](https://github.com/Free-TV/IPTV) open source playlist.

## ✅ SRS Media Server Setup

This repo now includes a lightweight SRS media server so a low-resource encoder can publish one feed and the server can handle all viewers.

### Flow

Encoder -> SRS on the server -> HTML player viewers

### Publish URL

Configure your encoder to publish to:

```bash
rtmp://172.27.28.2:1935/live/0
```

### Playback URL

The browser player uses the same server host and plays:

```bash
http://172.27.28.2:8088/live/0.m3u8
```

### Run everything

```bash
docker compose up -d
```

Ports exposed by the stack:

- `1935` for RTMP ingest into SRS
- `8088` for HLS playback from SRS
- `1985` for the SRS HTTP API
- `8080` for the IPTV web app

## 🚀 Quick Start

### Option 1 — Docker Compose (recommended)
```bash
docker compose up -d
```
Then open **http://localhost:8080**

---

### Option 2 — Docker CLI
```bash
docker build -t freetv-player .
docker run -d -p 8080:80 --name freetv-player freetv-player
```
Then open **http://localhost:8080**

---

### Option 3 — Change the port
Edit `docker-compose.yml`:
```yaml
ports:
  - "3000:80"   # host_port:container_port
```

---

## 🎛️ Features

- Loads the full Free-TV M3U8 playlist automatically
- Filter channels by **group** (tabs at top of sidebar)
- **Search** channels by name or country
- HLS playback via **hls.js** with auto-retry
- **Arrow keys** (↑/↓) to switch channels
- Stream info tab (URL, country, group, logo)
- Featured channel grid

## 🛑 Stop / Remove
```bash
docker compose down
# or
docker stop freetv-player && docker rm freetv-player
```

## ℹ️ Notes
- The app fetches the live playlist via `corsproxy.io` to bypass browser CORS restrictions.
- Some streams may be geo-blocked or temporarily offline.
- Works best in Chrome or Firefox.
