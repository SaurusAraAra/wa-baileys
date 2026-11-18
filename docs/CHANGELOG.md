# Changelog

## 5.4.0
Lompat langsung dari 5.3.3 ke 5.4.0 karena banyak fitur yang ditambah dan diperbaiki, serta engine yang lebih optimal dan stabil.

### Added
- Engine baru berbasis Baileys 7.0.0-rc14 dengan WAProto protobufjs 8.
- **VoIP**: `createVoIP` (panggilan suara/video 1-lawan-1 dan grup), `VoipClient`, `ActiveCall`, `CallState`, `makeVoipClient`.
- **Private Relay**: `sendPrivateRelay` (alias `selectPrivateRelay`) dan `sendPrivateStatus`.
- **Status**: `sendStatus`, `sendPrivateStatus`, `sendGroupStatus`.
- Pesan: `buttonLocation`, `photoPoll`, `rawMessage`, rich message, BloksWidget / A2UI, report flow, status stiker, modern messages, primitif scheduled-message, username USync.
- README baru yang menjelaskan fungsi dan seluruh fitur.

### Changed
- SPR dan Newsletter Status dipertahankan dan dipindah ke engine baru. `docs/SPR.md` dihapus, dokumentasinya ada di README.

### Removed
- greeting card, plugin system, presence/profile API, group history, SQLite auth, native crypto opsional, dan banner.

## 5.3.3
Perbaikan parser metadata newsletter/saluran (mengikuti perilaku `@whiskeysockets/baileys` 7.0.0-rc14).

### Fixed
- **`newsletterMetadata`** mengembalikan `null` untuk sebagian balasan server, sehingga fitur yang membacanya (`.cekidch`, `.playch`, `.chinfo`, `.setch`) error saat mengakses `.id`. Parser kini juga menerima balasan berupa string JSON dan balasan yang dibungkus `xwa2_newsletter`.

### Changed
- Versi naik ke 5.3.3.

## 5.3.2
Sinkronisasi dengan `@whiskeysockets/baileys` 7.0.0-rc14 (bagian yang relevan) + perbaikan newsletter/saluran.

### Fixed
- **`newsletterMetadata` selalu gagal** ("Gagal mengambil data saluran"): `QueryIds.METADATA` salah (`26099060629688646`), dikembalikan ke `6563316087068696` sesuai upstream. Ini juga memperbaiki turunan yang bergantung padanya (cek info/ID saluran lewat link, `.chinfo`, `.setch`, `.cekidch`, `.playch`).
- **`newsletterUpdate*`** (`newsletterUpdateName`, `newsletterUpdateDescription`, `newsletterUpdatePicture`, `newsletterRemovePicture`, dst): `QueryIds.UPDATE_METADATA` diperbarui ke `24250201037901610`.
- **`newsletterFollow` / `newsletterUnfollow`**: data path respons mengikuti upstream (`xwa2_newsletter_join_v2` / `xwa2_newsletter_leave_v2`). Path lama (`xwa2_newsletter_follow` / `xwa2_newsletter_unfollow`) tetap dibaca sebagai cadangan, jadi aman di server mana pun. Blok auto-follow ikut memakai jalur yang sama.
- **`profilePictureUrl`**: node `tctoken` sekarang ditaruh DI DALAM node `<picture>` (sebelumnya sejajar), sesuai upstream rc14, supaya server merespons untuk kontak yang punya token privasi.
- **`tctoken`**: node kini membawa atribut `t` (timestamp). Token tanpa timestamp dianggap tidak valid dan dibuang, seperti upstream.
- **Fallback versi WhatsApp Web** di `Utils/generics.js` dinaikkan ke `[2, 3000, 1043857760]` (sama dengan `Defaults`).

### Added
- **Mode Android (opt-in)**: `Browsers.android(...)` kini benar-benar dipakai saat handshake: `UserAgent.Platform.ANDROID`, tanpa `webInfo`, dan `DeviceProps.PlatformType.ANDROID_PHONE`. Perilaku default (macOS/Windows/Ubuntu) tidak berubah.
- **Export baru**: `buildProfilePictureQueryContent(type, tcTokenContent)` dari `Socket/chats.js`.

### Changed
- Versi naik ke 5.3.2.

### Catatan
- Sudah ada di fork sejak sebelumnya dan tidak perlu diport: protokol USync Bot Profile & LID, custom pairing code 8 karakter.

## 5.3.1
### Added
- **Share / Send Group History**: `sock.shareGroupHistory(groupJid, { toJids, messages, count?, outOfWindowPinnedMessages? })` (alias `sock.sendGroupHistory`). Diadaptasi dari zapo-js (MIT). Mengirim `messageHistoryBundle` + `messageHistoryNotice` ke member baru.
- **Custom history bot**: `messages` bebas diisi manual (tidak harus dari store). `key.id`, `key.remoteJid`, `fromMe`, `messageTimestamp` dan `message` otomatis dilengkapi, jadi cukup:
  ```js
  const messages = [
    { key: { remoteJid: m.chat, fromMe: false, participant: '628xxx@s.whatsapp.net' },
      message: { conversation: 'woi bayar utang lo' },
      messageTimestamp: Math.floor(Date.now() / 1000) - 3600 },
    { key: { remoteJid: m.chat, fromMe: false, participant: '628yyy@s.whatsapp.net' },
      message: { conversation: 'iya nanti sore ya' },
      messageTimestamp: Math.floor(Date.now() / 1000) - 1800 }
  ]
  await sock.shareGroupHistory(m.chat, { toJids: ['628zzz@s.whatsapp.net'], messages })
  ```
  Bentuk ringkas juga didukung: `{ from, text, ago }` (detik yang lalu) atau `message: 'teks'`. Helper: `sock.buildGroupHistory(groupJid, items)`.
- Pesan otomatis diurutkan dari yang terlama ke terbaru.

### Fixed
- Upload bundle history gagal karena media type `group-history` belum terdaftar: ditambahkan `/mms/group-history` (`MEDIA_PATH_MAP`) dan `Group History` (`MEDIA_HKDF_KEY_MAPPING`).
- `sock.sendGroupHistory is not a function`.

### Changed
- Banner `lib/index.js` sekarang hanya ASCII art dengan warna pelangi (tanpa teks info). Tetap bisa dimatikan dengan `SAURUS_NO_BANNER=1`.
- Versi naik ke 5.3.1.

## 5.0.3
### Fixed
- **Pair code**: `requestPairingCode` diperbaiki.
  - Nomor dibersihkan otomatis (`+62 812-3456-789` menjadi `628123456789`) dan divalidasi 7-15 digit.
  - Menunggu socket terbuka dulu sebelum mengirim permintaan (tidak lagi error "Connection Closed" kalau dipanggil terlalu cepat).
  - Setiap request membuat kode acak baru **dan** keypair ephemeral baru (sebelumnya keypair lama dipakai ulang).
  - Kode custom dinormalkan ke huruf besar dan divalidasi `A-Z0-9` 8 karakter.
  - Sesi yang sudah `registered` ditolak dengan pesan jelas.
  - Jika pengiriman gagal, state pairing (kode, keypair, `me`) dikembalikan seperti semula.

### Changed
- Versi di banner `lib/index.js` kini dibaca dari `package.json` (export `packageVersion`). Banner bisa dimatikan dengan env `SAURUS_NO_BANNER=1`.
- Info fitur di banner diperbarui.
- README baru: pengertian Baileys, koneksi (QR dan pairing code), pemakaian dari CommonJS, Rich Message, SPR, dan Newsletter Status.

## 5.0.2
### Added (dari zapo-js, MIT)
- **Greeting Card `/buss`**: `sock.sendGreetingCard(jid, { text, title, greeting, imageUrl, contactUrl, thumbnail?, sourceApp?, ref?, mentions?, adReply? }, sendOptions?)` dan `sock.buildGreetingCard(opts)`.
  Pesan `extendedTextMessage` + `contextInfo.externalAdReply`; `sourceId`, `ctwaClid`, `ctaPayload` diacak tiap kirim. Kartu hanya tampil di WhatsApp Business; user biasa hanya melihat teks.
  ```js
  await sock.sendGreetingCard(jid, {
    text: 'wow', title: 'Megumin Dominada BUSI', greeting: 'Hi Business',
    imageUrl: 'https://.../img.jpg', contactUrl: 'https://wa.me/NOMOR'
  }, { quoted: null })
  ```
- **Group History Bundle** (`sock.GroupHistory`): `encodeGroupHistoryBundle`, `decodeGroupHistoryBundle`, `streamGroupHistoryBundle`.
- **Meta AI Bot helpers** (`sock.MetaAIBot`): `BOT_KNOWN_JIDS`, `genBotMsgSecret`, `deriveBotChunkKey`, `decryptBotChunk`, `attachBotMetadata`, `attachBotThread`, `extractInvokedBotJid`, `buildBotInvokeProtoCopy`.
- **Plugin system**: `sock.use(plugin)`, `sock.removePlugin(id)`, `sock.hasPlugin(id)`, `sock.listPlugins()`, helper `definePlugin({ id, exposeAs?, setup(ctx), dispose? })`. Opsi socket `plugins: [...]` dan `disablePlugins: [...]`.
  Fitur bawaan berupa plugin: `spr`, `greeting-card`, `group-history`, `meta-ai-bot`, `presence`, `profile`.
- **Presence & Profile API**: `sock.presence` (`setOnline`, `setOffline`, `typing`, `recording`, `paused`, `subscribe`, `typeFor`, `withTyping`) dan `sock.profile` (`getPicture`, `setPicture`, `removePicture`, `getStatus`, `setStatus`, `setName`, `username.*`).
- **Akselerator kripto native opsional**: jika `@zapo-js/native` terpasang, X25519 dan XEdDSA memakai native (NAPI lalu WASM), jika tidak tetap JS. Env `SAURUS_NATIVE_BACKEND=auto|napi|wasm|js|none`.
- **SPR**: opsi `personal` (pesan khusus per orang), `sPRPrivate`, `sPRBroadcast` (`{name}` + mention + foto profil), `getSPRTargets`, `loadSPRAvatars`, batas target 100 dengan hitungan overflow, cache foto, budget/timeout, konkurensi (diadaptasi dari plugin zapo-js).

### Fixed
- Kode pairing tanpa custom kini acak tiap request (sebelumnya selalu sama).

### Changed
- `lib/Utils/dinonic-spr.js` ditulis ulang (sender key sekali pakai). API `sPR` / `selectiveRelay` tetap kompatibel.
- Reporting token memakai util resmi, tctoken memakai pengecekan expired.

## 5.0.1
### Added
- **A2UI / Bloks widget**: `a2uiText`, `a2uiButton`, `a2uiCard`, `a2uiTabs`, `a2uiModal`, dll, plus `sendA2UI`, `sendBloksWidget`.
- **Builder** (`sock.DinonicBuilder`): Button, ButtonV2, Carousel, AIRich, Toolkit.
- **AIRich lengkap**, **HTML App** (`sendHtmlApp`, `sendHtmlDocument`), **Meta AI sections**, **Bot Signature**, **Native Flow**.
- **Modern Messages**: komentar, event invite, pertanyaan/jawaban, poll add option, scheduled call, undangan newsletter, status mention/reaction/audience.
- **Payment Messages** (payment reminder, split payment), **Scheduled Message**, **Status Stickers** (musik, link, lokasi, pesan, channel).
- Handler `Socket/dinonic-handler.js`: Interactive/Carousel, Buttons, Flow, Group Story di `sendMessage`, plus `sock.sendStatusWhatsApp` dan `sock.getName`.
- Opsi socket: `rejectCalls`, `callRejectMessage`, `autoReadStatus`, `autoReadMessages`.
- `baileys-event-stream` dan file `.d.ts` untuk modul baru.

### Changed
- **Newsletter Status** diganti dengan implementasi penuh (alias `prepareNewsletterStatusContent` dan `makeNewsletterStatusAttribution` tetap ada).
- Pesan `interactiveMessage`, `buttonsMessage`, `flowMessage`, `carouselMessage`/`cards` sekarang lewat handler baru.

## 5.0.0
### Added
- **Newsletter Status**: `sendNewsletterStatus`, `sendNewsletterStatusReaction`, `revokeNewsletterStatus`, `getNewsletterStatuses`, `getNewsletterStatusUpdates`, plus `sock.newsletter.{sendStatus, reactToStatus, revokeStatus, fetchStatuses, fetchStatusUpdates}`.
- File tipe `newsletter-status.d.ts` dan `dinonic-spr.d.ts`.
- Dokumentasi di folder `docs/`.
- Export `sPR` / `selectiveRelay` dari entry utama.

### Fixed
- `dinonic-spr.js` mengimpor `encodeSignedDeviceIdentity` dari `generics.js` (tidak ada), sehingga seluruh paket gagal load. Sekarang dari `validate-connection.js`.
- SPR: fallback `conn.user` saat `authState.creds.me` kosong.
