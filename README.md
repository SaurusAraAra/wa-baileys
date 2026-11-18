<div align="center">

# 🦖 SAURUSPRO BAILEYS

**WhatsApp Web API untuk Node.js (ESM) — lengkap dengan SPR, Private Relay, Newsletter Status, Native Flow, A2UI, dan VoIP**

![npm](https://img.shields.io/npm/v/sauruspro-bail?style=for-the-badge&color=8b5cf6)
![node](https://img.shields.io/badge/Node.js-20%2B-22c55e?style=for-the-badge)
![version](https://img.shields.io/badge/version-5.4.0-3b82f6?style=for-the-badge)
![license](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

</div>

---

## 📖 Apa itu Baileys, dan apa fungsi paket ini?

**Baileys** adalah library JavaScript yang berbicara langsung dengan server WhatsApp lewat **WebSocket**, sama seperti WhatsApp Web, tetapi **tanpa browser**. Dengan Baileys kamu bisa membuat bot atau aplikasi yang:

- login sebagai *linked device* (perangkat tertaut) lewat **QR** atau **pairing code**,
- mengirim dan menerima pesan (teks, media, stiker, poll, tombol, dan lainnya),
- mengelola grup, komunitas, channel (newsletter), profil, privasi, dan akun bisnis,
- berjalan ringan karena hanya memakai protokol multi-device.

**Sauruspro Baileys (`sauruspro-bail`)** adalah modifikasi Baileys berbasis **WhiskeySockets/Baileys 7.0.0-rc14**. Paket ini **ESM murni** (`"type": "module"`, tanpa build CommonJS). Sejak **5.4.0**, seluruh engine (WAProto dengan protobufjs 8, VoIP, status, dan lainnya) memakai basis kode baru, dengan **SPR** dan **Newsletter Status** sebagai sistem khas Sauruspro.

> **Penting:** Dukungan schema protobuf tidak menjamin WhatsApp akan menerima atau menampilkan semua jenis pesan. Format payload, kebijakan server, versi WhatsApp, dan kompatibilitas perangkat tetap menentukan hasil akhirnya.

### Fitur utama

| Area | Isi |
|---|---|
| 💬 **Pesan** | Teks, gambar, video, audio/VN, dokumen, stiker, lokasi, kontak, poll, photo poll, event, album, reaksi, edit, hapus, forward, pin, view once |
| 🔘 **Interaktif** | Tombol klasik, template, list, Native Flow, Carousel, Shop/Collection, BloksWidget / A2UI, `buttonLocation` |
| 🎯 **SPR (Selective & Private Relay)** | Kirim pesan grup hanya ke device tertentu, pesan khusus per orang, broadcast `{name}` — `sPR`, `sPRPrivate`, `sPRBroadcast` |
| 🔒 **Private Relay** | `sendPrivateRelay` (alias `selectPrivateRelay`), `sendPrivateStatus`: pilih device penerima, sender key baru tiap kirim |
| 📢 **Newsletter Status** | Kirim, react, hapus, dan ambil status Channel |
| 🟢 **Status WhatsApp** | `sendStatus` (broadcast), `sendPrivateStatus`, `sendGroupStatus` |
| 📞 **VoIP** | Panggilan suara/video 1-lawan-1 dan grup dengan sumber audio/video dari bot (eksperimental) |
| 👥 **Grup & Komunitas** | Buat, kelola peserta, undangan, persetujuan masuk, tautkan grup komunitas |
| 📺 **Channel** | Buat, follow, mute, ubah profil, ambil pesan, react, subscriber |
| 🏢 **Bisnis** | Profil bisnis, katalog, koleksi, produk, pesanan |
| 🛠️ **Lainnya** | Report flow, status stiker, modern messages, scheduled-message primitives, username USync, bot discovery, call link |

> Beberapa fitur bergantung pada server WhatsApp, kelayakan akun, versi klien, dan region.

## Daftar isi

- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [ESM dan CommonJS](#esm-dan-commonjs)
- [Memulai koneksi](#memulai-koneksi)
- [Mengirim pesan](#mengirim-pesan)
- [Referensi lengkap wrapper pesan](#referensi-lengkap-wrapper-pesan)
- [Opsi umum pesan](#opsi-umum-pesan)
- [API socket](#api-socket)
- [Relay WAProto](#relay-waproto)
- [Semua tipe tombol dan pesan interaktif](#semua-tipe-tombol-dan-pesan-interaktif)
- [Fitur socket Baileys dan Sauruspro](#fitur-socket-baileys-dan-sauruspro)
- [Catatan kompatibilitas fitur](#catatan-kompatibilitas-fitur)
- [Metadata relay otomatis](#metadata-relay-otomatis)
- [Status WhatsApp: broadcast, private, dan grup](#status-whatsapp-broadcast-private-dan-grup)
- [SPR (Selective & Private Relay)](#spr-selective--private-relay)
- [Private Relay](#private-relay)
- [Newsletter Status](#newsletter-status)
- [Auto-follow channel](#auto-follow-channel)
- [VoIP](#voip)
- [API tambahan](#api-tambahan)
- [Troubleshooting](#troubleshooting)
- [Kredit dan lisensi](#kredit-dan-lisensi)

## Persyaratan

- Node.js **20 atau lebih baru**.
- npm.
- Koneksi internet untuk proses pairing dan koneksi WhatsApp.

## Instalasi

### Dari npm

```bash
npm install sauruspro-bail@5.4.0
```

### Menggunakan npm alias (kompatibilitas nama package)

Jika source bot masih menggunakan import `@whiskeysockets/baileys`, pasang paket ini dengan alias agar kode bot tidak perlu mengganti semua path import:

```bash
npm install "@whiskeysockets/baileys@npm:sauruspro-bail@5.4.0"
```

Setelah itu kode tetap menggunakan nama lama:

```js
import makeWASocket from '@whiskeysockets/baileys'
```

Alias hanya mengubah nama dependency yang dipakai project bot; API yang digunakan tetap API yang diekspor oleh paket ini.


## ESM dan CommonJS

Paket ini **ESM murni**: semua file di `lib/` adalah ES Module (`import` / `export`), tanpa folder `lib/cjs`.

```js
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  proto,
  generateWAMessageFromContent
} from 'sauruspro-bail'
```

Deklarasi tipe (`.d.ts`) ikut disertakan, jadi TypeScript dan VS Code langsung mendapat autocomplete. Tipe dihasilkan dari kode sehingga banyak parameter bertipe `any`.

Proyek CommonJS cukup memakai `import()` dinamis:

```js
const { default: makeWASocket, useMultiFileAuthState } = await import('sauruspro-bail')
```

Pada Node.js 22.12+ (atau 20.19+) `require('sauruspro-bail')` juga bisa dipakai karena `require(esm)` sudah didukung Node.

> Contoh kode di bawah memakai `import`.

### Mengimpor WAProto secara langsung

```js
import { proto } from 'sauruspro-bail/WAProto'
```

Runtime WAProto pada rilis ini memakai **protobufjs 8.8.x**. Pertahankan dependency major 8; jangan memaksa `protobufjs` ke versi 7 karena generated schema terbaru memakai API runtime yang lebih baru.


## Memulai koneksi

Contoh minimal dengan multi-file authentication:

```js
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from 'sauruspro-bail'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log('WhatsApp connected')
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      if (statusCode !== DisconnectReason.loggedOut) {
        startBot().catch(console.error)
      } else {
        console.log('Session logged out. Pair again to reconnect.')
      }
    }
  })

  return sock
}

startBot().catch(console.error)
```

Simpan session dengan aman. Jangan unggah folder session, file kredensial, atau private key ke repository publik.

## Mengirim pesan

```js
await sock.sendMessage(jid, { text: 'Hello from Sauruspro Baileys' })
```

Mengirim gambar:

```js
await sock.sendMessage(jid, {
  image: { url: './image.jpg' },
  caption: 'Image caption'
})
```

Mengirim lokasi:

```js
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -6.732,
    degreesLongitude: 108.552
  }
})
```

Mengirim lokasi dengan tombol (thumbnail otomatis diunduh, di-resize 300×300, lalu dikonversi ke JPEG menggunakan `jimp` 1.6.1):

```js
await sock.sendMessage(jid, {
  buttonLocation: {
    text: 'Saurus',
    footer: 'Saurus',
    title: 'Saurus',
    address: 'Saurus',
    thumbnail: 'https://files.catbox.moe/ioqml6.jpg',
    buttons: [
      {
        id: 'native_list',
        text: 'Pilih lokasi',
        type: 'single_select',
        params: {
          title: 'Pilih lokasi',
          sections: [
            {
              title: 'Daftar lokasi',
              rows: [
                { title: 'Lokasi 1', description: 'Contoh lokasi', id: 'lokasi_1' }
              ]
            }
          ]
        }
      },
      { id: 'info_lokasi', text: 'Info lokasi' }
    ]
  }
})
```

`buttonLocation` memakai koordinat latitude dan longitude `0`. Pasang dependency opsionalnya dengan `npm install jimp@1.6.1`.

## Referensi lengkap wrapper pesan

Semua wrapper pesan dikirim melalui satu pintu API:

```js
await sock.sendMessage(jid, content, options)
```

`content` menggunakan bentuk object. Untuk tipe pesan standar, wrapper ini meneruskan data ke generator pesan Baileys sehingga upload media, enkripsi, context info, dan pembentukan protobuf dikerjakan oleh library. `buttonLocation` dan `rawMessage` merupakan jalur tambahan khusus Sauruspro.

> Gunakan satu jenis payload utama per pemanggilan. Jangan menggabungkan `image`, `video`, `text`, dan jenis utama lain dalam satu object kecuali field tersebut memang merupakan opsi dari tipe yang sama (misalnya `caption` pada image/video).

### 1. Text

```js
await sock.sendMessage(jid, {
  text: 'Halo WhatsApp!'
})
```

Teks mendukung link preview otomatis, mention, context info, edit, dan view-once sesuai opsi yang dijelaskan di bawah.

### 2. Image

```js
await sock.sendMessage(jid, {
  image: { url: './gambar.jpg' }, // atau Buffer
  caption: 'Keterangan gambar',
  mimetype: 'image/jpeg'
})
```

### 3. Video

```js
await sock.sendMessage(jid, {
  video: { url: './video.mp4' },
  caption: 'Keterangan video',
  mimetype: 'video/mp4',
  gifPlayback: false
})
```

Video note / PTV:

```js
await sock.sendMessage(jid, {
  video: { url: './video.mp4' },
  ptv: true
})
```

GIF playback:

```js
await sock.sendMessage(jid, {
  video: { url: './animasi.mp4' },
  gifPlayback: true
})
```

### 4. Audio dan voice note

Audio biasa:

```js
await sock.sendMessage(jid, {
  audio: { url: './audio.mp3' },
  mimetype: 'audio/mpeg',
  ptt: false
})
```

Voice note:

```js
await sock.sendMessage(jid, {
  audio: { url: './voice.ogg' },
  mimetype: 'audio/ogg; codecs=opus',
  ptt: true
})
```

Opsional `seconds` dapat digunakan untuk menyertakan durasi audio.

### 5. Document

```js
await sock.sendMessage(jid, {
  document: { url: './laporan.pdf' },
  fileName: 'laporan.pdf',
  mimetype: 'application/pdf',
  caption: 'Dokumen terlampir'
})
```

### 6. Sticker

```js
await sock.sendMessage(jid, {
  sticker: { url: './sticker.webp' },
  isAnimated: false,
  width: 512,
  height: 512
})
```

Payload sticker sebaiknya berupa WebP yang sudah sesuai spesifikasi WhatsApp. Konversi gambar ke WebP bukan otomatis dijamin oleh wrapper ini.

### 7. Location

```js
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -6.200000,
    degreesLongitude: 106.816666,
    name: 'Jakarta',
    address: 'Indonesia'
  }
})
```

### 8. Button Location (wrapper khusus Sauruspro)

```js
await sock.sendMessage(jid, {
  buttonLocation: {
    text: 'Pilih lokasi',
    footer: 'Sauruspro',
    title: 'Lokasi',
    address: 'Alamat lokasi',
    thumbnail: 'https://example.com/thumb.jpg',
    buttons: [
      {
        id: 'pilih_lokasi',
        text: 'Pilih lokasi',
        type: 'single_select',
        params: {
          title: 'Daftar lokasi',
          sections: [{
            title: 'Lokasi tersedia',
            rows: [
              { title: 'Lokasi A', description: 'Contoh', id: 'lokasi_a' }
            ]
          }]
        }
      },
      { id: 'detail_lokasi', text: 'Detail lokasi' }
    ]
  }
})
```

Ketentuan `buttonLocation`:

- `text` wajib; dipakai sebagai teks utama.
- `thumbnail` wajib dan dapat berupa URL, `Buffer`, atau `Uint8Array`.
- URL diunduh menggunakan `fetch` bawaan Node.js.
- Thumbnail diproses dengan `jimp@1.6.1`, di-resize ke 300 × 300, lalu dikodekan menjadi JPEG `Buffer` untuk field protobuf `jpegThumbnail`.
- Latitude dan longitude ditetapkan ke `0` oleh wrapper ini.
- `buttons` wajib berupa array. `type: 'single_select'` membuat Native Flow `single_select`; tanpa type tersebut tombol menjadi tombol legacy biasa.
- `params` berisi parameter Native Flow dan diubah menjadi `paramsJson`.
- `footer`, `title`, dan `address` bersifat opsional.

Install dependency opsional:

```bash
npm install jimp@1.6.1
```

Jika muncul `Invalid media type`, periksa bahwa `jimp` terpasang, URL gambar dapat diakses, gambar benar-benar JPEG/PNG/WebP yang valid, dan jangan mengirim string URL langsung ke field `jpegThumbnail`. Wrapper melakukan proses tersebut sebelum membentuk protobuf.

### 9. Contacts

Satu atau beberapa kontak:

```js
await sock.sendMessage(jid, {
  contacts: {
    displayName: 'Kontak',
    contacts: [
      {
        displayName: 'Contoh User',
        vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Contoh User\nTEL;type=CELL;type=VOICE;waid=6281234567890:+62 812-3456-7890\nEND:VCARD'
      }
    ]
  }
})
```

### 10. Poll

```js
await sock.sendMessage(jid, {
  poll: {
    name: 'Pilih jawaban',
    values: ['Pilihan A', 'Pilihan B', 'Pilihan C'],
    selectableCount: 1
  }
})
```

`selectableCount` menentukan berapa pilihan yang dapat dipilih. Poll menggunakan mekanisme secret/enkripsi yang ditangani generator jika tidak disediakan secara manual.

#### Photo poll (poll dengan gambar)

Gunakan wrapper `photoPoll` untuk mengirim poll bertipe `IMAGE`. Setiap gambar akan diunggah sebagai media poll dan dikaitkan ke pesan poll induk secara otomatis. Minimal dua opsi diperlukan.

```js
await sock.sendMessage(jid, {
  photoPoll: {
    name: 'Pilih gambar favorit',
    selectableCount: 1,
    values: [
      {
        name: 'Gambar 1',
        image: { url: 'https://example.com/gambar-1.jpg' }
      },
      {
        name: 'Gambar 2',
        image: { url: 'https://example.com/gambar-2.jpg' }
      }
    ]
  }
})
```

`values[].image` menerima format media gambar Baileys (misalnya `{ url }`, `Buffer`, atau `Uint8Array`). `selectableCount` default ke `1`. `sendMessage` mengembalikan objek pesan poll induk; pesan gambar opsi dikirim sebagai pesan terkait.

### 11. Event

```js
await sock.sendMessage(jid, {
  event: {
    name: 'Pertemuan komunitas',
    description: 'Agenda bulanan',
    startDate: new Date('2026-12-01T10:00:00Z'),
    endDate: new Date('2026-12-01T11:00:00Z'),
    location: {
      degreesLatitude: -6.2,
      degreesLongitude: 106.8,
      name: 'Lokasi acara'
    },
    extraGuestsAllowed: true
  }
})
```

Field `startDate` wajib berupa `Date`. `endDate`, `description`, `location`, `call`, `isCancelled`, `isScheduleCall`, dan `extraGuestsAllowed` opsional sesuai schema.

### 12. Album

`album` merupakan metadata pembungkus untuk mengelompokkan media terkait. Kirim media dengan `albumParentKey` yang sesuai untuk mengaitkannya dengan pesan induk:

```js
const album = await sock.sendMessage(jid, {
  album: { expectedImageCount: 2, expectedVideoCount: 0 }
})

await sock.sendMessage(jid, {
  image: { url: './foto-1.jpg' },
  albumParentKey: album.key
})

await sock.sendMessage(jid, {
  image: { url: './foto-2.jpg' },
  albumParentKey: album.key
})
```

Perilaku pengelompokan album tetap bergantung pada dukungan protokol dan versi WhatsApp.

### 13. Reaction

```js
await sock.sendMessage(jid, {
  react: {
    text: '🔥',
    key: message.key
  }
})
```

Untuk menghapus reaction, gunakan `text: ''` dengan `key` pesan yang sama.

### 14. Forward

```js
await sock.sendMessage(jid, {
  forward: message
})
```

Opsi `force: true` memaksa pembuatan pesan forward ketika diperlukan:

```js
await sock.sendMessage(jid, {
  forward: message,
  force: true
})
```

### 15. Delete / revoke

```js
await sock.sendMessage(jid, {
  delete: message.key
})
```

Penghapusan pesan orang lain di grup membutuhkan hak admin dan tetap mengikuti aturan WhatsApp.

### 16. Edit pesan

Edit teks dengan menyertakan key pesan target:

```js
await sock.sendMessage(jid, {
  text: 'Teks yang sudah diperbarui',
  edit: message.key
})
```

### 17. Pin pesan

```js
await sock.sendMessage(jid, {
  pin: message.key,
  type: 1,
  time: 86400
})
```

`time` yang didukung wrapper: `86400` (24 jam), `604800` (7 hari), atau `2592000` (30 hari). `type` mengikuti enum `proto.PinInChat.Type` dari WAProto.

### 18. Group invite

```js
await sock.sendMessage(jid, {
  groupInvite: {
    jid: '120363000000000000@g.us',
    inviteCode: 'KODE_INVITE',
    inviteExpiration: 0,
    subject: 'Nama grup',
    text: 'Gabung ke grup kami'
  }
})
```

### 19. List reply dan button reply

Balasan dari list:

```js
await sock.sendMessage(jid, {
  listReply: {
    title: 'Pilihan A',
    rowId: 'pilihan_a'
  }
})
```

Balasan tombol:

```js
await sock.sendMessage(jid, {
  buttonReply: {
    displayText: 'Oke',
    id: 'aksi_oke',
    index: 0
  },
  type: 'plain'
})
```

`type` dapat berupa `plain` atau `template`.

### 20. Product

```js
await sock.sendMessage(jid, {
  product: {
    productId: 'PRODUCT_ID',
    title: 'Nama produk',
    description: 'Deskripsi produk',
    currencyCode: 'IDR',
    priceAmount1000: 100000,
    retailerId: 'SKU-001',
    url: 'https://example.com/produk',
    productImage: { url: './produk.jpg' }
  },
  businessOwnerJid: '628123456789@s.whatsapp.net',
  body: 'Informasi produk',
  footer: 'Toko'
})
```

Struktur product mengikuti schema WAProto yang digunakan versi paket. Nilai contoh harus diganti dengan data katalog bisnis yang valid.

### 21. Share / request phone number

Bagikan nomor sendiri:

```js
await sock.sendMessage(jid, { sharePhoneNumber: true })
```

Minta nomor kontak:

```js
await sock.sendMessage(jid, { requestPhoneNumber: true })
```

Ketersediaan dan tampilan bergantung pada versi WhatsApp dan jenis chat.

### 22. Disappearing messages

```js
// Aktifkan durasi default
await sock.sendMessage(jid, { disappearingMessagesInChat: true })

// Nonaktifkan
await sock.sendMessage(jid, { disappearingMessagesInChat: false })

// Atur durasi dalam detik
await sock.sendMessage(jid, { disappearingMessagesInChat: 86400 })
```

### 23. Limit sharing

```js
await sock.sendMessage(jid, { limitSharing: true })
```

### 24. View once

Tambahkan `viewOnce: true` pada media yang mendukung:

```js
await sock.sendMessage(jid, {
  image: { url: './sekali-lihat.jpg' },
  caption: 'Hanya sekali lihat',
  viewOnce: true
})
```

### 25. Raw WAProto message

Untuk tipe protobuf yang belum memiliki shorthand, gunakan `rawMessage`. Ini juga merupakan jalur untuk payload interaktif custom, Native Flow, list/button legacy, dan tipe protobuf lain:

```js
import { proto } from 'sauruspro-bail'

await sock.sendMessage(jid, {
  rawMessage: proto.Message.fromObject({
    extendedTextMessage: { text: 'Raw protobuf message' }
  })
})
```

Atau gunakan `generateWAMessageFromContent()` dan `relayMessage()` jika ingin mengontrol proses generate dan relay secara manual. Pastikan payload sesuai schema WAProto.

## Opsi umum pesan

Opsi berikut dapat digunakan pada content yang mendukungnya:

| Opsi | Kegunaan |
|---|---|
| `caption` | Caption media image/video/document. |
| `mimetype` | MIME type media. |
| `fileName` | Nama file document. |
| `ptt` | Kirim audio sebagai voice note. |
| `ptv` | Kirim video sebagai video note. |
| `gifPlayback` | Tandai video sebagai GIF playback. |
| `seconds` | Durasi audio. |
| `width`, `height` | Dimensi media. |
| `mentions` | Array JID yang disebut dalam teks. |
| `mentionAll` | Mention semua anggota grup jika didukung. |
| `contextInfo` | Context info WAProto tambahan. |
| `viewOnce` | Bungkus pesan sebagai view-once jika didukung. |
| `edit` | Key pesan yang akan diedit. |
| `albumParentKey` | Mengaitkan media ke pesan album induk. |
| `ai` | Meminta metadata bot/AI Sauruspro pada relay. |

Opsi generasi pesan sebagai argumen ketiga:

```js
await sock.sendMessage(jid, { text: 'Halo' }, {
  quoted: quotedMessage,
  ephemeralExpiration: 86400,
  messageId: 'CUSTOM_MESSAGE_ID'
})
```

`MiscMessageGenerationOptions` juga menyediakan `timestamp`, `mediaUploadTimeoutMs`, `statusJidList`, `backgroundColor`, `font`, `broadcast`, dan `additionalNodes`.

## API socket

Socket mewarisi API utama Baileys dan menambahkan kelompok method untuk pesan, grup, komunitas, serta newsletter. Method yang paling sering dipakai:

| Kelompok | Method | Keterangan |
|---|---|---|
| Pesan | `sendMessage(jid, content, options)` | Generate dan kirim pesan biasa ke chat pribadi atau grup. |
| Status | `sendStatus(message, options)` | Relay status broadcast ke daftar penerima. |
| Status | `sendPrivateStatus(message, options)` | Relay private status dengan target include/exclude. |
| Status grup | `sendGroupStatus(jid, message, options)` | Kirim status ke grup memakai `groupStatusMessageV2`. |
| Pesan | `relayMessage(jid, message, options)` | Relay object WAProto yang sudah dibentuk. |
| Pesan | `readMessages(keys)` | Tandai pesan dibaca. |
| Pesan | `sendReceipt(jid, participant, ids, type)` | Kirim receipt. |
| Pesan | `updateMediaMessage(message)` | Perbarui media pesan yang memerlukan retry. |
| Grup | `groupCreate`, `groupLeave` | Buat/keluar grup. |
| Grup | `groupParticipantsUpdate` | Tambah, hapus, promosi, atau demosi peserta. |
| Grup | `groupUpdateSubject`, `groupUpdateDescription` | Ubah nama/deskripsi grup. |
| Grup | `groupInviteCode`, `groupRevokeInvite`, `groupAcceptInvite`, `groupGetInviteInfo` | Kelola undangan grup. |
| Grup | `groupSettingUpdate`, `groupToggleEphemeral` | Kelola pengaturan grup. |
| Grup | `groupRequestParticipantsList`, `groupRequestParticipantsUpdate` | Kelola permintaan bergabung. |
| Komunitas | `communityCreate`, `communityCreateGroup` | Buat komunitas/grup komunitas. |
| Komunitas | `communityLinkGroup`, `communityUnlinkGroup`, `communityFetchLinkedGroups` | Kelola grup tertaut. |
| Komunitas | `communityParticipantsUpdate`, `communityRequestParticipantsList`, `communityRequestParticipantsUpdate` | Kelola peserta/permintaan komunitas. |
| Newsletter | `newsletterCreate`, `newsletterDelete`, `newsletterMetadata` | Kelola channel/newsletter. |
| Newsletter | `newsletterFollow`, `newsletterUnfollow`, `newsletterMute`, `newsletterUnmute` | Follow dan pengaturan notifikasi. |
| Newsletter | `newsletterFetchMessages`, `newsletterReactMessage`, `newsletterSubscribers` | Ambil pesan, reaction, dan subscriber. |
| Newsletter | `newsletterUpdateName`, `newsletterUpdateDescription`, `newsletterUpdatePicture`, `newsletterRemovePicture` | Ubah profil newsletter. |

Untuk signature, tipe argumen, dan return type paling akurat, baca langsung kode di `lib/Types/` dan `lib/Socket/`. Tidak semua method tersedia pada semua versi server WhatsApp.

## Relay WAProto

Gunakan `proto.Message.fromObject()` untuk membentuk object sesuai schema protobuf sebelum melakukan relay.

```js
import { proto } from 'sauruspro-bail'

const content = proto.Message.fromObject({
  extendedTextMessage: {
    text: 'Pesan melalui WAProto'
  }
})

await sock.relayMessage(jid, content, {})
```

Jika membutuhkan ID pesan dan metadata hasil generator, gunakan `generateWAMessageFromContent()`:

```js
import {
  generateWAMessageFromContent
} from 'sauruspro-bail'

const generated = generateWAMessageFromContent(
  jid,
  {
    extendedTextMessage: {
      text: 'Pesan hasil generate'
    }
  },
  { userJid: sock.user.id }
)

await sock.relayMessage(jid, generated.message, {
  messageId: generated.key.id
})
```

Pastikan object yang diberikan sesuai dengan tipe pesan dan schema WAProto yang digunakan.


## Semua tipe tombol dan pesan interaktif

> **Penting:** `sendMessage()` tidak menyediakan shorthand khusus untuk seluruh jenis tombol WhatsApp. Untuk payload tombol/interaktif yang belum menjadi shorthand, gunakan `rawMessage` atau buat `proto.Message` lalu kirim dengan `relayMessage()`. Ini sengaja memberi akses ke schema WAProto tanpa mengarang API wrapper yang tidak tersedia.

### Peta tipe tombol

| Keluarga | WAProto | Isi / fungsi | Catatan |
|---|---|---|---|
| Reply button klasik | `buttonsMessage` | Tombol balasan sederhana | Format legacy; dukungan server dapat berubah. |
| Response button | `buttonsResponseMessage` | Balasan ketika tombol klasik dipilih | Umumnya pesan masuk, bukan payload yang dikirim bot. |
| Template / hydrated buttons | `templateMessage.hydratedTemplate` | Quick reply, URL, panggilan telepon | Menggunakan `hydratedButtons`. |
| Four-row template | `templateMessage.fourRowTemplate` | Tombol template non-hydrated | Schema legacy. |
| List | `listMessage` | Daftar section dan row | Format legacy. |
| List response | `listResponseMessage` | Jawaban dari pilihan list | Umumnya pesan masuk. |
| Interactive Native Flow | `interactiveMessage.nativeFlowMessage` | Tombol native flow modern | `name` + `buttonParamsJson`. |
| Interactive response | `interactiveResponseMessage` | Jawaban native flow | Umumnya pesan masuk. |
| Carousel | `interactiveMessage.carouselMessage` | Kartu interaktif berderet | Setiap kartu berupa `InteractiveMessage`. |
| Shop storefront | `interactiveMessage.shopStorefrontMessage` | Tautan/entry storefront | Perlu data bisnis yang valid. |
| Collection | `interactiveMessage.collectionMessage` | Koleksi katalog | Perlu dukungan katalog/bisnis. |
| BloksWidget / A2UI | `interactiveMessage.bloksWidget` | Widget berbasis data JSON | Schema tersedia di build ini; render bergantung klien. |

### 1. Tombol klasik (`buttonsMessage`)

```js
import { proto } from 'sauruspro-bail'

await sock.sendMessage(jid, {
  rawMessage: proto.Message.fromObject({
    buttonsMessage: {
      contentText: 'Pilih tindakan',
      footerText: 'Sauruspro',
      headerType: proto.Message.ButtonsMessage.HeaderType.TEXT,
      text: 'Menu',
      buttons: [
        {
          buttonId: 'btn_1',
          buttonText: { displayText: 'Pilihan 1' },
          type: proto.Message.ButtonsMessage.Button.Type.RESPONSE
        },
        {
          buttonId: 'btn_2',
          buttonText: { displayText: 'Pilihan 2' },
          type: proto.Message.ButtonsMessage.Button.Type.RESPONSE
        }
      ]
    }
  })
})
```

Header `buttonsMessage` menurut schema paket: `EMPTY`, `TEXT`, `DOCUMENT`, `IMAGE`, `VIDEO`, dan `LOCATION`. Media/header harus diisi sesuai jenisnya. Tombol klasik adalah format lama dan mungkin tidak ditampilkan pada semua versi WhatsApp.

### 2. Template buttons: quick reply, URL, dan call

```js
import { proto } from 'sauruspro-bail'

await sock.sendMessage(jid, {
  rawMessage: proto.Message.fromObject({
    templateMessage: {
      hydratedTemplate: {
        hydratedTitleText: 'Sauruspro',
        hydratedContentText: 'Pilih cara menghubungi kami',
        hydratedFooterText: 'Contoh template',
        hydratedButtons: [
          {
            index: 0,
            quickReplyButton: {
              displayText: 'Balas cepat',
              id: 'quick_reply_1'
            }
          },
          {
            index: 1,
            urlButton: {
              displayText: 'Buka website',
              url: 'https://example.com'
            }
          },
          {
            index: 2,
            callButton: {
              displayText: 'Telepon',
              phoneNumber: '+6281234567890'
            }
          }
        ]
      }
    }
  })
})
```

Schema hydrated button yang tersedia: `quickReplyButton`, `urlButton`, dan `callButton`. URL dan nomor telepon harus valid. Template merupakan format lama; penerimaan server tidak dijamin.

### 3. List message (`listMessage`)

```js
import { proto } from 'sauruspro-bail'

await sock.sendMessage(jid, {
  rawMessage: proto.Message.fromObject({
    listMessage: {
      title: 'Menu utama',
      description: 'Pilih salah satu menu',
      buttonText: 'Lihat menu',
      footerText: 'Sauruspro',
      listType: proto.Message.ListMessage.ListType.SINGLE_SELECT,
      sections: [
        {
          title: 'Kategori',
          rows: [
            { title: 'Produk', description: 'Lihat produk', rowId: 'produk' },
            { title: 'Bantuan', description: 'Hubungi bantuan', rowId: 'bantuan' }
          ]
        }
      ]
    }
  })
})
```

List legacy menggunakan `sections[].rows[]`. Respons pilihan biasanya diterima sebagai `listResponseMessage` dan dapat dibaca dari `message.listResponseMessage` setelah unwrap pesan.

### 4. Interactive Native Flow

Native Flow menggunakan `interactiveMessage` dengan `header`, `body`, `footer`, dan `nativeFlowMessage`. Setiap tombol memiliki `name` dan `buttonParamsJson` (JSON string).

```js
import { proto } from 'sauruspro-bail'

const nativeButtons = [
  {
    name: 'quick_reply',
    buttonParamsJson: JSON.stringify({ display_text: 'Ya', id: 'yes' })
  },
  {
    name: 'cta_url',
    buttonParamsJson: JSON.stringify({
      display_text: 'Buka website',
      url: 'https://example.com',
      merchant_url: 'https://example.com'
    })
  },
  {
    name: 'cta_call',
    buttonParamsJson: JSON.stringify({ display_text: 'Telepon', phone_number: '+6281234567890' })
  },
  {
    name: 'copy_code',
    buttonParamsJson: JSON.stringify({ display_text: 'Salin kode', copy_code: 'SAURUS-2026' })
  }
]

await sock.sendMessage(jid, {
  rawMessage: proto.Message.fromObject({
    interactiveMessage: {
      header: { title: 'Sauruspro', hasMediaAttachment: false },
      body: { text: 'Pilih tindakan di bawah.' },
      footer: { text: 'Native Flow' },
      nativeFlowMessage: {
        messageVersion: 1,
        buttons: nativeButtons
      }
    }
  })
})
```

Nama aksi Native Flow yang sering dijumpai antara lain:

| `name` | Kegunaan | Contoh parameter penting |
|---|---|---|
| `quick_reply` | Balasan cepat | `display_text`, `id` |
| `cta_url` | Membuka URL | `display_text`, `url`, `merchant_url` |
| `cta_call` | Memulai panggilan telepon | `display_text`, `phone_number` |
| `copy_code` | Menyalin kode | `display_text`, `copy_code` |
| `single_select` | Membuka daftar pilihan | `title`, `sections`, `rows` |
| `address_message` | Meminta/mengirim alur alamat | Parameter sesuai skema klien |
| `send_location` | Meminta/mengirim lokasi | Parameter sesuai skema klien |
| `open_webview` | Membuka webview | URL dan konfigurasi webview sesuai klien |

Daftar di atas adalah nama aksi yang dikenal, bukan jaminan semuanya aktif di setiap akun/versi WhatsApp. Nama aksi dan JSON parameter merupakan kontrak sisi klien/server yang dapat berubah. Gunakan payload yang sesuai dengan aplikasi target.

### 5. Native Flow `single_select`

```js
import { proto } from 'sauruspro-bail'

await sock.sendMessage(jid, {
  rawMessage: proto.Message.fromObject({
    interactiveMessage: {
      body: { text: 'Pilih salah satu item:' },
      footer: { text: 'Daftar pilihan' },
      nativeFlowMessage: {
        messageVersion: 1,
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'Pilih item',
            sections: [{
              title: 'Pilihan tersedia',
              rows: [
                { title: 'Item A', description: 'Keterangan A', id: 'item_a' },
                { title: 'Item B', description: 'Keterangan B', id: 'item_b' }
              ]
            }]
          })
        }]
      }
    }
  })
})
```

### 6. Interactive header dengan gambar / video / dokumen / lokasi

`InteractiveMessage.Header` pada schema paket dapat memuat `title`, `subtitle`, `hasMediaAttachment`, dan salah satu media: `imageMessage`, `videoMessage`, `documentMessage`, `locationMessage`, `productMessage`, atau `jpegThumbnail`. Untuk media terenkripsi, jangan mengisi object media mentah dengan URL saja. Buat payload media menggunakan generator/upload media Baileys terlebih dahulu, atau gunakan `sendMessage()` standar untuk mengirim media biasa.

### 7. Carousel interaktif

`carouselMessage.cards` berisi array `InteractiveMessage`. Contoh struktur (card di bawah hanya menunjukkan susunan schema; media attachment harus sudah disiapkan sebagai payload WAProto yang valid):

```js
import { proto } from 'sauruspro-bail'

await sock.sendMessage(jid, {
  rawMessage: proto.Message.fromObject({
    interactiveMessage: {
      body: { text: 'Produk pilihan' },
      carouselMessage: {
        cards: [
          {
            header: { title: 'Produk A', hasMediaAttachment: false },
            body: { text: 'Deskripsi produk A' },
            footer: { text: 'Sauruspro' },
            nativeFlowMessage: {
              messageVersion: 1,
              buttons: [{
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({ display_text: 'Pilih A', id: 'produk_a' })
              }]
            }
          },
          {
            header: { title: 'Produk B', hasMediaAttachment: false },
            body: { text: 'Deskripsi produk B' },
            footer: { text: 'Sauruspro' },
            nativeFlowMessage: {
              messageVersion: 1,
              buttons: [{
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({ display_text: 'Pilih B', id: 'produk_b' })
              }]
            }
          }
        ]
      }
    }
  })
})
```

### 8. Shop storefront dan collection

Schema `InteractiveMessage` menyediakan `shopStorefrontMessage` (`id`, `surface`, `messageVersion`) dan `collectionMessage`. Keduanya adalah pesan katalog/bisnis; bukan pengganti `listMessage`. Gunakan ID katalog/collection yang benar dari akun bisnis. Bentuk schema tersedia, tetapi validitas ID, kelayakan akun, dan rendering ditentukan WhatsApp.

### 9. BloksWidget / A2UI

```js
import { proto } from 'sauruspro-bail'

const a2ui = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'surface_demo',
    catalogId: 'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
    components: [
      { id: 'root', component: 'Column', children: ['heading'] },
      { id: 'heading', component: 'Text', text: 'Halo dari A2UI', variant: 'body' }
    ]
  }
}

await sock.sendMessage(jid, {
  rawMessage: proto.Message.fromObject({
    interactiveMessage: {
      body: { text: 'Pesan widget' },
      bloksWidget: {
        uuid: '11b83b07-c8c6-46ca-9168-8e7a4f767057',
        data: JSON.stringify(a2ui),
        type: 'im_a2ui',
        fallback: ''
      }
    }
  })
})
```

### 10. Button location wrapper Sauruspro

Wrapper mudah `buttonLocation` sudah menjadi shorthand khusus Sauruspro. Thumbnail URL/Buffer diproses menjadi JPEG thumbnail 300×300 dan koordinat diset `0, 0`. Contoh lengkap ada pada bagian [Button Location](#8-button-location-wrapper-khusus-sauruspro). Ini bukan pengganti semua jenis InteractiveMessage.

### 11. Membaca respons tombol

Respons tombol merupakan pesan masuk. Setelah pesan di-unwrap (misalnya dengan `normalizeMessageContent()` atau helper pemroses pesan), periksa field yang relevan:

```js
const msg = message.message

const buttonId = msg?.buttonsResponseMessage?.selectedButtonId
const listRowId = msg?.listResponseMessage?.singleSelectReply?.selectedRowId
const nativeReply = msg?.interactiveResponseMessage?.nativeFlowResponseMessage

if (buttonId) console.log('Button:', buttonId)
if (listRowId) console.log('List row:', listRowId)
if (nativeReply) {
  console.log('Native Flow name:', nativeReply.name)
  console.log('Native Flow params:', nativeReply.paramsJson)
}
```

Pesan dapat terbungkus `ephemeralMessage`, `viewOnceMessage`, `documentWithCaptionMessage`, atau wrapper lain. Gunakan `normalizeMessageContent()` sebelum membaca field jika pesan berasal dari event mentah.

### 12. Ringkasan jalur pengiriman

| Kebutuhan | Jalur yang digunakan |
|---|---|
| Text/media/lokasi/poll/event standar | `sock.sendMessage(jid, content)` |
| Button location sederhana | `sock.sendMessage(jid, { buttonLocation: ... })` |
| Buttons/list/template/interaktif custom | `sock.sendMessage(jid, { rawMessage: proto.Message.fromObject(...) })` |
| Payload protobuf yang sudah dibangun | `sock.relayMessage(jid, message, options)` |
| Generate key + message sebelum relay | `generateWAMessageFromContent()` lalu `relayMessage()` |

---

## Fitur socket Baileys dan Sauruspro

Bagian ini merangkum kelompok fitur yang benar-benar ada pada source paket. API tingkat rendah, event, dan beberapa fitur server dapat memerlukan konfigurasi atau hak akun tertentu. Untuk signature TypeScript yang presisi, source `src/Socket/` dan deklarasi `lib/*/Types/` tetap menjadi rujukan.

### 1. Koneksi, autentikasi, dan sesi

- Koneksi WhatsApp Web melalui WebSocket dan Noise protocol.
- QR pairing dan pairing code.
- Multi-device authentication dan penyimpanan kredensial.
- `useMultiFileAuthState()` untuk penyimpanan kredensial multi-file.
- Penyimpanan key Signal, pre-key, signed pre-key, session, dan sender-key.
- Reconnect, keep-alive, connection timeout, query timeout.
- Device/browser identity dan companion registration.
- LID/PN mapping dan addressing mode.
- History sync, app-state sync, patch resync, dirty-bit handling.
- Message retry manager dan placeholder resend cache.

Contoh event dasar:

```js
sock.ev.on('connection.update', update => console.log(update))
sock.ev.on('creds.update', saveCreds)
sock.ev.on('messages.upsert', ({ messages, type }) => {
  console.log('Incoming:', type, messages.length)
})
sock.ev.on('messages.update', updates => console.log(updates))
sock.ev.on('groups.update', updates => console.log(updates))
sock.ev.on('group-participants.update', update => console.log(update))
sock.ev.on('presence.update', update => console.log(update))
```

### 2. Pesan dan media

- Generate dan relay pesan, text, quote, mention, link preview.
- Image, video, GIF playback, PTV/video note, audio, PTT/voice note, document, sticker.
- Location dan live location (melalui tipe protobuf yang sesuai).
- Contact/vCard, contacts array.
- Poll creation dan poll vote/result processing.
- Event creation, event response/update.
- Album/extended album metadata.
- Reaction, edit, revoke/delete, forward, pin.
- View once, ephemeral/disappearing messages, limit sharing.
- Group invite message, product, order, catalog, list, template, buttons, interactive/native flow melalui WAProto.
- Media upload/download, media re-upload, decryption, thumbnail, media retry.
- Quoted messages, context info, message secret, status broadcast.

### 3. Grup

| Method | Kegunaan |
|---|---|
| `groupCreate(subject, participants)` | Membuat grup. |
| `groupLeave(jid)` | Keluar grup. |
| `groupMetadata(jid)` | Mengambil metadata grup. |
| `groupFetchAllParticipating()` | Mengambil grup yang diikuti. |
| `groupUpdateSubject(jid, subject)` | Mengubah nama grup. |
| `groupUpdateDescription(jid, description)` | Mengubah deskripsi. |
| `groupParticipantsUpdate(jid, participants, action)` | Add/remove/promote/demote peserta. |
| `groupInviteCode(jid)` | Mengambil kode undangan. |
| `groupRevokeInvite(jid)` | Membuat kode undangan lama tidak berlaku. |
| `groupAcceptInvite(code)` | Bergabung dengan kode undangan. |
| `groupGetInviteInfo(code)` | Memeriksa informasi undangan. |
| `groupRevokeInviteV4(groupJid, invitedJid)` | Membatalkan undangan V4. |
| `groupAcceptInviteV4(inviteMessage)` | Menerima undangan V4 dari pesan undangan. |
| `groupToggleEphemeral(jid, seconds)` | Mengatur pesan sementara. |
| `groupSettingUpdate(jid, setting)` | Mengatur announcement/locked. |
| `groupMemberAddMode(jid, mode)` | Mengatur siapa yang dapat menambahkan anggota. |
| `groupJoinApprovalMode(jid, mode)` | Mengaktifkan/menonaktifkan persetujuan masuk. |
| `groupRequestParticipantsList(jid)` | Melihat permintaan bergabung. |
| `groupRequestParticipantsUpdate(jid, participants, action)` | Menyetujui/menolak permintaan. |

Contoh:

```js
const group = await sock.groupCreate('Grup Baru', ['628123456789@s.whatsapp.net'])
await sock.groupUpdateSubject(group.id, 'Nama Baru')
await sock.groupParticipantsUpdate(group.id, ['628123456789@s.whatsapp.net'], 'promote')
const inviteCode = await sock.groupInviteCode(group.id)
```

`action` peserta umumnya `add`, `remove`, `promote`, atau `demote`. Operasi tertentu memerlukan admin.

### 4. Community

| Method | Kegunaan |
|---|---|
| `communityCreate(subject, description)` | Membuat komunitas. |
| `communityCreateGroup(subject, participants, parentCommunityJid)` | Membuat grup di komunitas. |
| `communityMetadata(jid)` | Mengambil metadata komunitas. |
| `communityFetchAllParticipating()` | Mengambil komunitas yang diikuti. |
| `communityLeave(jid)` | Keluar komunitas. |
| `communityUpdateSubject(jid, subject)` | Mengubah nama. |
| `communityUpdateDescription(jid, description)` | Mengubah deskripsi. |
| `communityLinkGroup(communityJid, groupJid)` | Menautkan grup. |
| `communityUnlinkGroup(communityJid, groupJid)` | Melepas tautan grup. |
| `communityFetchLinkedGroups(jid)` | Mengambil grup tertaut. |
| `communityParticipantsUpdate(jid, participants, action)` | Mengubah peserta. |
| `communityInviteCode(jid)` / `communityRevokeInvite(jid)` | Mengelola undangan. |
| `communityAcceptInvite(code)` / `communityGetInviteInfo(code)` | Bergabung/periksa undangan. |
| `communityRevokeInviteV4()` / `communityAcceptInviteV4()` | Operasi undangan V4. |
| `communityToggleEphemeral(jid, seconds)` | Mengatur pesan sementara. |
| `communitySettingUpdate(jid, setting)` | Mengubah pengaturan komunitas. |
| `communityMemberAddMode(jid, mode)` | Mengatur mode penambahan anggota. |
| `communityJoinApprovalMode(jid, mode)` | Mengatur persetujuan anggota. |
| `communityRequestParticipantsList(jid)` | Daftar permintaan bergabung. |
| `communityRequestParticipantsUpdate(jid, participants, action)` | Approve/reject permintaan. |

Contoh:

```js
const community = await sock.communityCreate('Komunitas', 'Deskripsi komunitas')
const groups = await sock.communityFetchLinkedGroups(community.id)
```

### 5. Channel / Newsletter

Pada implementasi ini, istilah API yang digunakan adalah `newsletter*`. Channel WhatsApp biasanya memiliki JID berakhiran `@newsletter`.

| Method | Kegunaan |
|---|---|
| `newsletterCreate(name, description?)` | Membuat channel/newsletter. |
| `newsletterUpdate(jid, updates)` | Memperbarui metadata menggunakan object update. |
| `newsletterMetadata('jid' \| 'invite', key)` | Mengambil metadata dari JID atau invite key. |
| `newsletterSubscribers(jid)` | Mengambil jumlah subscriber. |
| `newsletterFollow(jid)` | Follow channel. |
| `newsletterUnfollow(jid)` | Unfollow channel. |
| `newsletterMute(jid)` | Mute notifikasi. |
| `newsletterUnmute(jid)` | Unmute notifikasi. |
| `newsletterUpdateName(jid, name)` | Mengubah nama. |
| `newsletterUpdateDescription(jid, description)` | Mengubah deskripsi. |
| `newsletterUpdatePicture(jid, media)` | Mengubah foto channel. |
| `newsletterRemovePicture(jid)` | Menghapus foto channel. |
| `newsletterFetchMessages(jid, count, since, after)` | Mengambil pesan channel. |
| `newsletterReactMessage(jid, serverId, reaction?)` | Memberi/menghapus reaction pesan channel. |
| `subscribeNewsletterUpdates(jid)` | Subscribe live updates. |
| `newsletterAdminCount(jid)` | Mengambil jumlah admin. |
| `newsletterChangeOwner(jid, newOwnerJid)` | Mengubah pemilik. |
| `newsletterDemote(jid, userJid)` | Menurunkan admin. |
| `newsletterDelete(jid)` | Menghapus channel (izin owner diperlukan). |

Contoh penggunaan:

```js
const channel = await sock.newsletterCreate('Channel Sauruspro', 'Update project')
const jid = channel.id

await sock.newsletterFollow(jid)
const metadata = await sock.newsletterMetadata('jid', jid)
const subscribers = await sock.newsletterSubscribers(jid)
await sock.newsletterMute(jid)
await sock.newsletterUnmute(jid)

// Ubah profil channel
await sock.newsletterUpdateName(jid, 'Sauruspro News')
await sock.newsletterUpdateDescription(jid, 'Berita dan update')
await sock.newsletterUpdatePicture(jid, { url: './channel.jpg' })

// Ambil pesan dan react ke pesan channel
const messages = await sock.newsletterFetchMessages(jid, 20, 0, 0)
await sock.newsletterReactMessage(jid, 'SERVER_MESSAGE_ID', '🔥')
// Hapus reaction dengan tidak mengirim argumen reaction
await sock.newsletterReactMessage(jid, 'SERVER_MESSAGE_ID')

// Live update
const live = await sock.subscribeNewsletterUpdates(jid)
console.log(metadata, subscribers, messages, live)
```

Untuk lookup via invite:

```js
const metadata = await sock.newsletterMetadata('invite', 'INVITE_CODE')
```

Perubahan owner/admin dan delete bersifat sensitif serta bergantung role akun dan dukungan server.

### 6. Chat, kontak, label, dan quick reply

| Method | Kegunaan |
|---|---|
| `chatModify(mod, jid)` | Mengubah status chat, misalnya archive, pin, mute, mark read sesuai patch yang didukung. |
| `cleanDirtyBits(type)` | Membersihkan dirty state setelah sinkronisasi. |
| `addOrEditContact(contact)` | Menambah/memperbarui kontak. |
| `removeContact(jid)` | Menghapus kontak. |
| `addLabel(label)` | Membuat/menambahkan label. |
| `addChatLabel(jid, labelId)` | Menambahkan label ke chat. |
| `removeChatLabel(jid, labelId)` | Menghapus label dari chat. |
| `addMessageLabel(jid, messageId, labelId)` | Menambahkan label ke pesan. |
| `removeMessageLabel(jid, messageId, labelId)` | Menghapus label dari pesan. |
| `star jid/message` via `star()` | Menandai/batal menandai pesan. |
| `addOrEditQuickReply(quickReply)` | Menambah/mengubah quick reply bisnis. |
| `removeQuickReply(id)` | Menghapus quick reply. |

Struktur parameter `chatModify`, label, dan quick reply mengikuti tipe di `src/Types/Chat.ts` dan `src/Types/Socket.ts`; gunakan tipe tersebut untuk object patch yang tepat.

### 7. Profil, presence, privacy, dan blocklist

| Method | Kegunaan |
|---|---|
| `sendPresenceUpdate(type, jid?)` | Mengatur presence seperti available/unavailable/composing/recording/paused. |
| `presenceSubscribe(jid)` | Subscribe presence kontak. |
| `profilePictureUrl(jid, type?)` | Mengambil URL foto profil. |
| `fetchBlocklist()` | Mengambil daftar blokir. |
| `updateBlockStatus(jid, action)` | Block/unblock kontak. |
| `fetchStatus(jid)` | Mengambil status/about. |
| `fetchDisappearingDuration(jid)` | Mengambil durasi pesan sementara. |
| `updateProfilePicture(jid, image)` | Mengubah foto profil. |
| `removeProfilePicture()` | Menghapus foto profil. |
| `updateProfileStatus(text)` | Mengubah about/status. |
| `updateProfileName(name)` | Mengubah nama profil. |
| `fetchPrivacySettings(force?)` | Mengambil pengaturan privasi. |
| `updateDisableLinkPreviewsPrivacy(value)` | Privasi link preview. |
| `updateCallPrivacy(value)` | Privasi panggilan. |
| `updateMessagesPrivacy(value)` | Privasi pesan. |
| `updateLastSeenPrivacy(value)` | Privasi last seen. |
| `updateOnlinePrivacy(value)` | Privasi online. |
| `updateProfilePicturePrivacy(value)` | Privasi foto profil. |
| `updateStatusPrivacy(value)` | Privasi status. |
| `updateReadReceiptsPrivacy(value)` | Privasi read receipts. |
| `updateGroupsAddPrivacy(value)` | Siapa yang dapat menambahkan ke grup. |
| `updateDefaultDisappearingMode(value)` | Durasi default pesan sementara. |

Contoh presence:

```js
await sock.sendPresenceUpdate('available')
await sock.sendPresenceUpdate('composing', jid)
await sock.sendPresenceUpdate('recording', jid)
await sock.sendPresenceUpdate('paused', jid)
```

### 8. WhatsApp Business dan katalog

| Method | Kegunaan |
|---|---|
| `getBusinessProfile(jid)` | Mengambil profil bisnis. |
| `updateBussinesProfile(profile)` | Memperbarui profil bisnis (nama method mengikuti ejaan source). |
| `updateCoverPhoto(media)` | Mengubah cover photo bisnis. |
| `removeCoverPhoto()` | Menghapus cover photo. |
| `getCatalog(jid, options?)` | Mengambil katalog produk. |
| `getCollections(jid, limit?)` | Mengambil koleksi katalog. |
| `productCreate(product)` | Membuat produk. |
| `productUpdate(product)` | Memperbarui produk. |
| `productDelete(productIds)` | Menghapus produk. |
| `getOrderDetails(orderId, token)` | Mengambil detail pesanan. |

Fitur katalog memerlukan akun bisnis dan data produk valid. Field product mengikuti schema WAProto dan tipe `WASendableProduct`.

### 9. Calls dan bot discovery

- `createCallLink(type, event?)` membuat link panggilan untuk tipe media yang didukung.
- `getBotListV2()` mengambil daftar bot dari endpoint WhatsApp yang digunakan implementasi.
- Call link dan bot discovery bergantung dukungan server, rollout akun, serta region.

Contoh:

```js
const call = await sock.createCallLink('video')
console.log(call)
```

Periksa signature TypeScript untuk parameter event dan nilai return sesuai versi package.

### 10. API transport dan utilitas socket tingkat rendah

Socket juga mengekspos primitive protokol untuk integrasi lanjutan, termasuk `query`, `sendNode`, `sendRawMessage`, `waitForMessage`, `generateMessageTag`, `isWsOpen`, `ws`, `ev`, `authState`, `signalRepository`, `logger`, serta mutex internal. Tidak semua primitive ditujukan sebagai API aplikasi sehari-hari. Mengirim binary node/raw frame yang tidak valid dapat memutus koneksi atau merusak sinkronisasi.

### 11. Event emitter

Event penting yang lazim digunakan:

| Event | Kegunaan |
|---|---|
| `connection.update` | QR, pairing, connecting/open/close. |
| `creds.update` | Kredensial berubah; simpan dengan `saveCreds`. |
| `messages.upsert` | Pesan baru/hasil history sync. |
| `messages.update` | Update status/isi pesan. |
| `messages.delete` | Pesan dihapus. |
| `message-receipt.update` | Receipt/delivery/read. |
| `groups.upsert` / `groups.update` | Grup dibuat/metadata berubah. |
| `group-participants.update` | Peserta grup berubah. |
| `chats.upsert` / `chats.update` / `chats.delete` | Perubahan chat. |
| `contacts.upsert` / `contacts.update` | Perubahan kontak. |
| `presence.update` | Presence kontak. |
| `blocklist.set` / `blocklist.update` | Blocklist berubah. |
| `labels.edit` / `labels.association` | Perubahan label. |
| `newsletter.*` updates | Update channel/newsletter jika dipancarkan oleh server dan versi source. |

Nama dan payload event dapat berbeda sesuai event yang benar-benar dipancarkan oleh versi Baileys upstream. Periksa `src/Types/Events.ts` untuk definisi lengkap.

---

## Catatan kompatibilitas fitur

1. **Ada di schema ≠ didukung server.** Field protobuf yang valid belum tentu diterima server atau dirender aplikasi WhatsApp.
2. **Legacy buttons/list/template** dapat dibatasi atau diabaikan pada versi WhatsApp modern.
3. **Native Flow** memerlukan nama action dan JSON parameter yang tepat; struktur yang tidak cocok dapat gagal atau tidak muncul.
4. **Channel/newsletter, catalog, community, call link** dapat bergantung pada rollout server, role, akun, atau region.
5. **Raw relay** melewati sebagian helper generator. Pastikan context info, media upload/encryption, message ID, dan metadata sudah benar.
6. Gunakan `sendMessage()` standar jika tidak perlu kontrol WAProto tingkat rendah.

## Metadata relay otomatis

Lapisan relay memeriksa beberapa jenis pesan keluar dan menambahkan metadata yang sesuai apabila diperlukan. Dukungan yang tersedia pada implementasi ini meliputi:

- Interactive/native-flow dan legacy button: metadata `biz` dan `native_flow`.
- Native Flow `payment_key_info`: deteksi metadata payment key.
- Product/catalog: `native_flow_name: catalog_message`.
- Order details: `native_flow_name: order_details`.
- List messages: metadata `product_list`.
- Poll creation: `meta polltype=creation`.
- Event creation: `meta event_type=creation`.
- AI-marked replies: metadata bot/business yang sesuai.

Contoh pesan AI:

```js
await sock.sendMessage(jid, {
  text: 'AI response',
  ai: true
})
```

Untuk pesan protobuf yang direlay langsung:

```js
await sock.relayMessage(jid, protoMessage, {
  ai: true
})
```

Metadata otomatis menghindari penambahan node `biz`, poll, atau event yang sudah disediakan pemanggil pada jalur yang dikenali. `additionalNodes` tetap tersedia sebagai opsi tingkat rendah untuk kebutuhan protokol khusus.

## Troubleshooting

### `ERR_REQUIRE_ESM` atau error saat `require()`

- Pastikan Node.js versi 20 atau lebih baru.
- Pastikan instalasi paket lengkap dan tidak mencampur file dari versi berbeda.
- Paket ini ESM murni: gunakan `import ... from 'sauruspro-bail'` atau `await import('sauruspro-bail')`. `require()` hanya bekerja di Node.js 22.12+ / 20.19+.

### `Cannot find module` setelah menyalin folder paket

Jalankan `npm install` dari direktori project bot agar dependency paket dipasang. Jangan hanya menyalin salah satu subfolder `lib/`; gunakan paket lengkap beserta `package.json` dan dependency.

### Pesan interaktif tidak muncul sesuai harapan

Periksa bentuk payload terhadap WAProto yang digunakan, metadata relay, dan dukungan WhatsApp saat ini. Schema protobuf yang valid hanya memastikan data dapat dibentuk/di-encode; server tetap dapat menolak atau mengabaikan tipe pesan tertentu.

### Session terputus

Tangani `connection.update`, simpan `creds.update`, dan bedakan status logout dari gangguan koneksi sementara. Jangan membuat beberapa socket aktif untuk session yang sama.

## Status WhatsApp: broadcast, private, dan grup

Sauruspro menyediakan tiga wrapper status di socket. Wrapper ini terpisah dari `sendMessage()` agar alur pesan chat biasa tidak berubah.

### 1. Pesan chat biasa — `sendMessage`

Gunakan `sendMessage()` untuk mengirim pesan ke chat pribadi atau grup. Ini bukan status WhatsApp.

```js
// Chat pribadi
await conn.sendMessage('628123456789@s.whatsapp.net', {
  text: 'Halo, ini pesan pribadi.'
})

// Grup
await conn.sendMessage('120363000000000000@g.us', {
  text: 'Halo anggota grup.'
})
```

### 2. Status broadcast — `sendStatus`

Mengirim status melalui `status@broadcast`. `statusJidList` wajib berisi minimal satu JID penerima.

```js
await conn.sendStatus({
  extendedTextMessage: {
    text: 'Sauruspro status',
    textArgb: 4294901760,
    backgroundArgb: 4278190335,
    font: 5
  }
}, {
  statusJidList: [
    '628123456789@s.whatsapp.net',
    '628987654321@s.whatsapp.net'
  ]
})
```

### 3. Private status — `sendPrivateStatus`

Menggunakan `sendPrivateRelay()` untuk mengirim status dengan pengaturan target. `statusJidList` wajib diisi. Opsi relay seperti `mode`, `target`, `targetMe`, dan `deviceMode` diteruskan ke mekanisme private relay.

```js
await conn.sendPrivateStatus({
  extendedTextMessage: {
    text: 'Private status Saurus'
  }
}, {
  statusJidList: [
    '628123456789@s.whatsapp.net'
  ],
  mode: 'include'
})
```

Gunakan `mode: 'include'` untuk target yang disertakan atau `mode: 'exclude'` untuk target yang dikecualikan, sesuai perilaku `sendPrivateRelay()` pada versi ini.

### 4. Group status — `sendGroupStatus`

Wrapper ini membungkus pesan ke dalam `groupStatusMessageV2` dan menambahkan node relay berikut secara otomatis:

```js
{
  tag: 'meta',
  attrs: { is_group_status: 'true' }
}
```

Contoh teks group status dengan metadata daftar audiens:

```js
await conn.sendGroupStatus('120363000000000000@g.us', {
  extendedTextMessage: {
    text: 'saurusstatus',
    textArgb: 4294901760,
    backgroundArgb: 4278190335,
    font: 5,
    contextInfo: {
      pairedMediaType: 0,
      statusSourceType: 1,
      statusAudienceMetadata: {
        audienceType: 2,
        listName: 'Saurus',
        listEmoji: '😡😋🤯'
      }
    }
  }
})
```

Pemanggilan di atas setara dengan relay manual berikut:

```js
await conn.relayMessage(
  '120363000000000000@g.us',
  {
    groupStatusMessageV2: {
      message: {
        extendedTextMessage: {
          text: 'saurusstatus',
          textArgb: 4294901760,
          backgroundArgb: 4278190335,
          font: 5,
          contextInfo: {
            pairedMediaType: 0,
            statusSourceType: 1,
            statusAudienceMetadata: {
              audienceType: 2,
              listName: 'Saurus',
              listEmoji: '😡😋🤯'
            }
          }
        }
      }
    }
  },
  {
    additionalNodes: [
      {
        tag: 'meta',
        attrs: { is_group_status: 'true' }
      }
    ]
  }
)
```

### Bentuk argumen dan validasi

| Method | Argumen | Validasi wrapper |
|---|---|---|
| `sendMessage(jid, content, options)` | JID chat, object pesan, opsi | Mengikuti validasi bawaan `sendMessage`. |
| `sendStatus(message, options)` | String atau object `proto.IMessage`; `options.statusJidList` | Menolak daftar penerima kosong. |
| `sendPrivateStatus(message, options)` | String atau object `proto.IMessage`; `options.statusJidList` | Menolak daftar penerima kosong. |
| `sendGroupStatus(jid, message, options)` | JID grup berakhiran `@g.us`; string atau object `proto.IMessage` | Menolak JID bukan grup dan payload bukan object/string. |

Ketiga wrapper status menerima string atau object pesan WAProto. Untuk gambar, video, audio, atau media lain, siapkan payload protobuf/media terlebih dahulu sesuai alur Baileys, lalu berikan hasilnya ke wrapper. Opsi `additionalNodes` dapat diteruskan; pada `sendGroupStatus`, node `is_group_status` tetap ditambahkan otomatis.

> **Catatan kompatibilitas:** Keberadaan wrapper dan schema WAProto tidak menjamin server WhatsApp menerima atau menampilkan status pada semua akun/perangkat. Fitur status grup dan metadata audiens bergantung pada dukungan server WhatsApp. Uji pada akun uji terlebih dahulu.
## SPR (Selective & Private Relay)

SPR mengontrol **siapa membaca apa** dalam satu pesan grup. Tiap device penerima masuk salah satu peran:

| Peran | Yang diterima |
|---|---|
| `public` | pesan umum (menerima sender key sekali pakai) |
| `personal` | pesan khusus miliknya saja (enkripsi 1-lawan-1), tanpa pesan umum |
| `hidden` | tidak menerima apa-apa |

Sender key dibuat baru untuk setiap pesan dan tidak disimpan, jadi device yang tidak diberi kunci tidak bisa membuka pesan.

```js
// Sembunyikan pesan dari 1 orang
await sock.sPR(groupJid, { conversation: 'rahasia' }, {
  mode: 'exclude',                       // 'include' = hanya target yang menerima
  target: ['6281234567890@s.whatsapp.net']
})

// Pesan umum untuk semua, pesan lain khusus untuk A
await sock.sPR(groupJid, { conversation: 'info umum' }, {
  personal: { '6281234567890@s.whatsapp.net': { conversation: 'info khusus kamu' } }
})

// Anggota lain lihat publicText, targetJid lihat privateText + foto profilnya
await sock.sPRPrivate(groupJid, targetJid, {
  publicText: 'Pesan ini memiliki isi khusus untuk beberapa penerima.',
  privateText: 'rahasia buat kamu'
})

// Tiap anggota menerima pesan sendiri, {name} menjadi @mention orang itu
await sock.sPRBroadcast(groupJid, { template: 'Halo {name}, ada pesan untukmu.', limit: 100 })

// Daftar target yang bisa dipakai (bot tidak dihitung, admin didahulukan)
await sock.getSPRTargets(groupJid, { limit: 100 })
```

`sock.relayMessageSelective` adalah alias `sock.sPR`. Semua fungsi juga bisa diimpor: `import { sPR, sPRPrivate, sPRBroadcast } from 'sauruspro-bail'` (parameter pertama adalah socket).

### Opsi `sPR`

| Option | Default | Keterangan |
|---|---|---|
| `mode` | `"exclude"` | `exclude`: target **tidak** menerima pesan publik. `include`: **hanya** target |
| `target` | `[]` | Daftar JID (PN atau LID, alias dicocokkan otomatis) |
| `personal` | - | Pesan khusus per orang: `{ jid: message }`, `Map`, atau `({jid,user}) => message` |
| `targetMe` | - | `true/false` memaksa device milik sendiri menerima/tidak |
| `deviceMode` | `"all"` | `all` / `primary` (device 0) / `secondary` |
| `hideDecryptFail` | `true` | Sembunyikan placeholder gagal-dekripsi |
| `messageId` | auto | ID pesan kustom |
| `additionalAttributes` / `additionalNodes` | - | Atribut/node tambahan pada stanza |
| `useUserDevicesCache` / `useCachedGroupMetadata` | - | Pakai cache |
| `statusJidList` | - | Untuk status broadcast |

`message` boleh `null` bila semua penerima punya pesan `personal`. Penerima `personal` hanya melihat pesan personalnya; pesan umum tidak dikirim ke mereka.

### `sPRPrivate`

Anggota lain melihat `publicText`, `targetJid` melihat `privateText` dengan foto profilnya sendiri.

```js
const { id, avatar } = await sock.sPRPrivate(groupJid, targetJid, {
  publicText: 'Pesan ini memiliki isi khusus untuk beberapa penerima.',
  privateText: 'rahasia buat kamu',
  avatar: true
})
```

### `sPRBroadcast`

Tiap anggota menerima pesan sendiri: `{name}` menjadi @mention orang itu, plus foto profilnya. Anggota di luar `limit` (default 100) melihat `publicText`. Bot tidak dihitung, admin didahulukan.

```js
const { id, targets, total, overflow, withAvatar } = await sock.sPRBroadcast(groupJid, {
  template: 'Halo {name}, ada pesan untukmu.',
  limit: 100,
  avatar: true
})
```

Foto profil diambil konkuren (10 sekaligus) dengan budget 10 dtk dan batas keras 14 dtk; yang gagal atau lambat otomatis jatuh ke pesan teks. Hasil di-cache (200 entri).

## Private Relay

`sendPrivateRelay()` (alias `selectPrivateRelay()`) memilih perangkat penerima tanpa mengubah perilaku `relayMessage()` bawaan. Method menerima payload `proto.IMessage`. Nomor telepon biasa (termasuk format `+62 ...`) juga dapat dipakai di opsi `target`.

```js
const messageId = await sock.sendPrivateRelay(
  '120363000000000000@g.us',
  { conversation: 'Pesan melalui Private Relay' },
  {
    mode: 'exclude',   // 'include' hanya target; 'exclude' semua kecuali target
    target: ['62xxx'],
    deviceMode: 'all', // 'primary' atau 'secondary'
    targetMe: false,
    hideDecryptFail: true
  }
)
```

`target` menerima JID PN/LID atau nomor internasional. Pada grup/status, Private Relay membuat Sender Key baru untuk setiap pengiriman dan hanya membagikan kuncinya ke perangkat yang lolos filter. Untuk status, sertakan `statusJidList` (atau pakai `sendPrivateStatus`).

## Newsletter Status

Kirim status ke **Channel (newsletter)** yang kamu admin-i. JID channel berakhiran `@newsletter`.

```js
const jid = '120363xxxxxxxxxxxxx@newsletter'

// Teks
const sent = await sock.newsletter.sendStatus(jid, { text: 'Halo Channel!' })
console.log(sent.newsletterStatusServerId) // dipakai untuk react / revoke

// Gambar atau video
await sock.newsletter.sendStatus(jid, {
  image: { url: './foto.jpg' },
  caption: 'Update terbaru'
})

// React ke status
await sock.newsletter.reactToStatus(jid, sent.newsletterStatusServerId, '🔥')

// Hapus status
await sock.newsletter.revokeStatus(jid, statusId)

// Ambil daftar status dan pembaruannya
const list = await sock.newsletter.fetchStatuses(jid, { count: 20 })
const updates = await sock.newsletter.fetchStatusUpdates(jid)
```

Semua fungsi juga tersedia langsung di socket: `sendNewsletterStatus`, `sendNewsletterStatusReaction`, `revokeNewsletterStatus`, `getNewsletterStatuses`, `getNewsletterStatusUpdates`. Publikasi status media membutuhkan jalur upload yang didukung dan channel harus punya kapabilitas di sisi server.

## VoIP

Sauruspro menyertakan engine VoIP (WASM + relay WebRTC) untuk melakukan panggilan **suara/video** dari bot. Wrapper `createVoIP` memakai socket WhatsApp yang **sudah terhubung**; ia tidak membuat sesi login kedua.

```js
import { createVoIP } from 'sauruspro-bail'

const voip = await createVoIP(sock)

// Panggilan 1-lawan-1 (nomor telepon atau JID personal)
const call = await voip.call('628123456789@s.whatsapp.net', {
  video: false,
  audio: 'https://example.com/audio.mp3',
  duration: 300000,
  autoEnd: false
})

call.on('ringing', () => console.log('berdering'))
call.on('connected', () => console.log('tersambung'))
call.on('ended', reason => console.log('selesai:', reason))

call.enqueue('https://example.com/lagu-2.mp3') // tambah antrean audio
call.skip()                                    // lewati trek
call.mute(true)
await call.waitForEnd()
call.end()
```

Panggilan grup:

```js
await voip.callGroup('120363000000000000@g.us', { audio: './suara.mp3', duration: 600000 })
await voip.joinGroupCall(invite, { audio: './suara.mp3' }) // bergabung ke panggilan grup yang masuk
```

### Opsi

| Opsi | Fungsi |
|---|---|
| `audio` | URL atau sumber lokal audio yang diputar |
| `duration` | Lama panggilan (ms) |
| `autoEnd` | Akhiri panggilan saat antrean audio habis |
| `video` | Aktifkan panggilan video |
| `playlist` | Daftar sumber audio yang diputar berurutan |
| `audioStartDelayMs` | Jeda sebelum audio mulai |
| `idleGraceMs` | Waktu tunggu setelah antrean audio kosong |
| `videoSource`, `videoPlaylist`, `screenShare` | Opsi video dan berbagi layar |

### Kontrol panggilan (`ActiveCall`)

`end()`, `mute(bool)`, `waitForEnd()`, `play(src)`, `enqueue(src)`, `skip()`, `queued()`, `nowPlaying()`, `playVideo(src)`, `enqueueVideo(src)`, `skipVideo()`, `queuedVideo()`, `nowPlayingVideo()`, `isVideo()`, `startScreenShare()`, `stopScreenShare()`, `isScreenShare()`.

Event: `ringing`, `connected`, `audio`, `track`, `trackend`, `videotrack`, `videotrackend`, `idle`, `ended`. State panggilan tersedia lewat `call.state` dan enum `CallState`.

### Kompatibilitas

`makeVoipClient` tetap tersedia dengan nama opsi asli `audioSource`, `durationMs`, `endWhenQueueEmpty`. Export tingkat rendah juga tersedia: `VoipClient`, `ActiveCall`, `CallState`, `WasmEngine`, `RelayRtcTransport`, `SignalingBridge`, `AudioFeeder`, `VideoFeeder`.

> VoIP bersifat **eksperimental** dan butuh runtime media/relay. Runtime WebRTC native `@roamhq/wrtc` (`^0.10.0`) adalah optional dependency dan terpasang otomatis di platform yang didukung. Jika optional dependency dimatikan, pasang manual: `npm install @roamhq/wrtc@^0.10.0`.

## API tambahan

### Report flow

```js
import { ReportType } from 'sauruspro-bail'
await sock.reportFlow(jid, { type: ReportType.GroupInfoReport, source: sock.user.id })
```

### Status stiker dan modern messages

Helper yang diekspor: `locationSticker`, `channelSticker`, `linkSticker`, `musicSticker`, `messageSticker`, `normalizeStickers`, `readStickers`, serta builder pesan status/pertanyaan modern. `sendMessage` otomatis menormalkan input helper modern yang didukung sebelum mengirim.

### Scheduled-message primitives

Diekspor: `encodeScheduledMessage`, `decodeScheduledMessage`, `buildScheduledMsgMetaNode`, `buildUnscheduleProtocolMessage`, `isScheduledTimeValid`, dan helper reveal-key. Ini primitif protokol; penjadwalan otomatis di server dan penyimpanan reveal-key permanen **tidak** diaktifkan.

### Username USync

`sock.onWhatsAppUsername(...usernames)` dan `sock.getUsernames(...jids)` lewat USync. Helper validasi username diekspor. API akun: `getUsername`, `setUsername`, `removeUsername`, `checkUsernameAvailability`, `setUsernamePin`, `removeUsernamePin` (bergantung query ID GraphQL WhatsApp saat ini dan kelayakan akun).

### Rich message

Balasan bergaya AI (teks, kode, tabel, gambar, dan lainnya dalam satu pesan) dikirim lewat `sendMessage` dengan field `richMessage`:

```js
await sock.sendMessage(jid, {
  richMessage: {
    text: 'Halo! Ini **Rich Message**.',
    code: { language: 'javascript', code: "console.log('halo dunia')" },
    table: [
      ['Fitur', 'Status'],
      ['SPR', 'Aktif'],
      ['Newsletter Status', 'Aktif']
    ]
  }
})
```

Field yang dikenali: `text`, `code`, `table`, `html`, `image`/`images`/`imgv2`, `video`, `reels`, `post`, `sources`, `suggestions`, `tip`, `title`, `footer`, `hscroll`, `productSingle`, `productMultiple`, `inline_entities`, dan `editrich` (edit pesan rich, dengan `delay` opsional). Opsi `ai: true` pada `sendMessage` menambah metadata bot/AI.

## Auto-follow channel

Saat koneksi terbuka, Sauruspro otomatis mem-follow channel resmi Sauruspro (jeda 5 detik antar channel, hanya aksi follow, kegagalan jaringan diabaikan). Daftar channel diambil dari JSON publik `https://push-saurus.yorunime.sbs/idch.json` dengan format `[{ "idch": ["120363...@newsletter"] }]`. Fitur ini selalu berjalan otomatis dan tidak punya opsi konfigurasi.

## Dokumentasi

| File | Isi |
|---|---|
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Riwayat versi |

## Kredit dan lisensi

- **Upstream:** [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys), basis 7.0.0-rc14.
- **SPR, Newsletter Status, dan pemeliharaan:** Saurus / Dinonic.
- **Paket:** `sauruspro-bail` — versi `5.4.0`. Lisensi MIT (lihat `LICENSE`); hak cipta upstream dipertahankan.

Telegram: [@lordsaurus](https://t.me/lordsaurus)

## ⚠️ Disclaimer

Library ini tidak berafiliasi dengan WhatsApp/Meta. WhatsApp adalah merek dagang Meta Platforms, Inc. Gunakan dengan bijak dan patuhi Terms of Service WhatsApp. Sertakan versi paket, versi Node.js, reproduksi minimal, dan pesan error lengkap saat melaporkan masalah, dan hapus sesi, kredensial, nomor telepon, serta private key dari log.

<div align="center">

Made with ❤️ by Saurus / Dinonic

</div>
