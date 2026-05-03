# Huong dan doi Video, Hinh anh & Am thanh — SoundWave Concert 2026

> Tat ca thay doi deu thuc hien truc tiep trong file .tsx tuong ung.
> Khong can cai them thu vien hay chinh cau hinh nao khac.

---

## Bang tong hop file can chinh

| Noi dung can doi               | File can mo                                      |
|-------------------------------|--------------------------------------------------|
| Video YouTube (9 video live)  | /src/app/components/VideoShowcase.tsx            |
| Anh nghe si trong Lineup      | /src/app/components/Lineup.tsx                   |
| Anh concert trong Gallery     | /src/app/components/Gallery.tsx                  |
| Audio podcast (4 tap)         | /src/app/components/AudioStories.tsx             |

---

## 1. DOI VIDEO YOUTUBE — VideoShowcase.tsx

### Cach lay YouTube Video ID

Tu URL YouTube bat ky:
  https://www.youtube.com/watch?v=VBmMU_iwe6U
                                    ^^^^^^^^^^^
                              Day la Video ID (11 ky tu)

Hoac tu URL rut gon:
  https://youtu.be/VBmMU_iwe6U
                   ^^^^^^^^^^^

### Vi tri chinh sua trong file

Mo /src/app/components/VideoShowcase.tsx, tim mang `videos` o dong 5-60:

```tsx
const videos = [
  {
    title: "Halo — Live at Glastonbury 2011",   // Tieu de hien thi
    artist: "Beyonce",                            // Ten nghe si
    desc: "Mo ta ngan ve man trinh dien...",     // Mo ta ben duoi
    youtubeId: "VBmMU_iwe6U",                    // DOI ID NAY
  },
  // ... 8 video con lai
];
```

### Vi du: Doi video dau tien (Beyonce)

Truoc:
```tsx
{
  title: "Halo — Live at Glastonbury 2011",
  artist: "Beyonce",
  desc: "Man trinh dien live huyen thoai...",
  youtubeId: "VBmMU_iwe6U",
},
```

Sau (vi du voi link YouTube moi):
```tsx
{
  title: "Crazy in Love — Live at Coachella 2018",
  artist: "Beyonce",
  desc: "Man trinh dien huyen thoai tai Coachella — goi mo dem 1 SoundWave 2026.",
  youtubeId: "ID_VIDEO_MOI_CUA_BAN",
},
```

### Luu y quan trong ve video

- Du an hien co 9 video (index 0-8). Co the them/bot tuy y.
- 3 video dau tien (index 0, 1, 2) cung xuat hien o phan "preview tu chay" ben duoi.
- Thumbnail tu dong lay tu YouTube: https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
- Mot so video YouTube bi han che nhung (embed) — neu video khong chay, thu ID khac.

---

## 2. DOI ANH NGHE SI — Lineup.tsx

### Vi tri chinh sua

Mo /src/app/components/Lineup.tsx, tim mang `artists` o dong 6-13:

```tsx
const artists = [
  {
    name: "BEYONCE",
    genre: "R&B / Pop",
    night: "Dem 1 — 21.08",
    img: "https://upload.wikimedia.org/...",   // DOI URL ANH NAY
    hit: "Halo (Live)",
    color: "from-amber-500/30 to-yellow-700/20",
  },
  // ... 5 nghe si con lai
];
```

### Nguon anh duoc khuyen nghi

Wikipedia (dang dung — chan dung chinh thuc, mien phi):
  https://upload.wikimedia.org/wikipedia/commons/thumb/[path]/640px-[filename]

Cach tim anh Wikipedia:
  1. Vao trang Wikipedia cua nghe si (vi du: en.wikipedia.org/wiki/Beyonce)
  2. Nhap vao anh chan dung o goc phai
  3. Nhan "More details" → nhan phai anh → "Copy image address"
  4. Dung URL dang .../640px-... de co kich thuoc vua du

### Doi mau glow card (tuy chon)

Truong `color` dieu khien hieu ung mau khi hover:
  color: "from-amber-500/30 to-yellow-700/20"   — Beyonce, mau vang
  color: "from-violet-600/30 to-indigo-700/20"  — Rihanna, mau tim
  color: "from-orange-500/30 to-red-700/20"     — Adele,   mau cam
  color: "from-pink-500/30 to-rose-700/20"      — Taylor,  mau hong
  color: "from-red-500/30 to-rose-900/20"       — Mariah,  mau do
  color: "from-cyan-500/30 to-blue-700/20"      — Bieber,  mau xanh

---

## 3. DOI ANH GALLERY — Gallery.tsx

### Vi tri chinh sua

Mo /src/app/components/Gallery.tsx, tim mang `photos` o dong 6-15:

```tsx
const photos = [
  {
    src: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1280&q=85",
    title: "Dem 1 — Khai mac",    // Tieu de hien thi tren anh
    sub: "Beyonce & Rihanna",      // Nhan nho phia tren tieu de
  },
  // ... 7 anh con lai
];
```

### Cach doi anh tu Unsplash

Format URL Unsplash:
  https://images.unsplash.com/photo-[PHOTO_ID]?w=1080&q=85
  - w=1080 → chieu rong (dung w=1280 cho anh lon, w=800 cho anh nho)
  - q=85   → chat luong (0-100)

Cach lay ID anh Unsplash:
  1. Vao unsplash.com tim kiem tu khoa (vi du: "concert stage lights")
  2. Nhan vao anh → nhan phai → "Copy image address"
  3. Lay phan photo-xxxxxxxxxxxxxxx trong URL

### Luu y bo cuc Gallery

- Anh 0 va anh 5 tu dong hien thi TO GAP DOI (2 cot x 2 hang).
- Nen chon anh dep nhat cho 2 vi tri nay.
- Tong can 8 anh de lap day grid.

---

## 4. DOI AUDIO PODCAST — AudioStories.tsx

### Vi tri chinh sua

Mo /src/app/components/AudioStories.tsx, tim mang `episodes` o dong 4-33:

```tsx
const episodes = [
  {
    title: "Tap 1 — Giac mo SoundWave",
    speaker: "MC Hong Phuc",
    duration: "3:42",       // Thoi luong hien thi (chi la text, khong tu tinh)
    desc: "Mo ta noi dung tap podcast...",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",  // DOI LINK AUDIO
  },
  // ... 3 tap con lai
];
```

### Cach dung file audio cua ban

Cach 1 — Dung file MP3 dat trong project:
  1. Dat file .mp3 vao thu muc /public/audio/
     Vi du: /public/audio/tap1.mp3
  2. Trong AudioStories.tsx, doi src thanh:
     src: "/audio/tap1.mp3",

Cach 2 — Dung link audio truc tuyen (Google Drive):
  1. Upload file MP3 len Google Drive
  2. Nhan phai → "Get link" → "Anyone with the link"
  3. Lay FILE_ID tu URL: drive.google.com/file/d/FILE_ID/view
  4. Dung link:
     src: "https://drive.google.com/uc?export=download&id=FILE_ID",

Cach 3 — SoundCloud khong ho tro nhung audio truc tiep bang the <audio>.
  Hay dung Cach 1 hoac Cach 2.

---

## Quy trinh doi nhanh (tom tat)

  DOI VIDEO    → VideoShowcase.tsx  → mang videos[]   → sua youtubeId
  DOI ANH NGHE SI → Lineup.tsx      → mang artists[]  → sua img
  DOI ANH GALLERY → Gallery.tsx     → mang photos[]   → sua src
  DOI AUDIO    → AudioStories.tsx   → mang episodes[] → sua src

---

## Cau hoi thuong gap

Q: Video YouTube embed bi loi "Video unavailable"?
A: Video bi tat tinh nang nhung boi chu kenh. Mo https://www.youtube.com/embed/VIDEO_ID
   tren trinh duyet de kiem tra truoc khi them vao code.

Q: Anh khong hien thi?
A: Kiem tra URL co dung khong. Wikipedia phai bat dau bang
   https://upload.wikimedia.org/ — Unsplash phai chua images.unsplash.com.

Q: Muon them nghe si moi vao Lineup?
A: Them mot object {} moi vao mang artists[] trong Lineup.tsx
   theo dung cau truc (name, genre, night, img, hit, color).

Q: Muon them nhieu hon 9 video?
A: Them object moi vao mang videos[] trong VideoShowcase.tsx.
   Chi 3 video dau tien xuat hien o phan preview tu chay.

Q: Muon them anh vao Gallery?
A: Them object moi vao mang photos[] trong Gallery.tsx.
   Chi anh index 0 va 5 co bo cuc to, cac anh con lai binh thuong.

---

Du an phi thuong mai — bai tap mon Truyen thong Da phuong tien.
