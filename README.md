# QuestHub

QuestHub, Windows 10 ve Windows 11 (64-bit) için geliştirilen Türkçe masaüstü oyun takip uygulamasıdır.

## Özellikler

- Türkçe, koyu temalı masaüstü arayüzü
- Üst bölümde oyun/görev arama alanı
- Steam, Epic Games ve Riot Games ile ilişkilendirilen seçili oyunların çalışan süreçlerini algılama
- Discord Quest görevleri için manuel kontrol listesi
- Electron güvenlik ayarları: context isolation açık, Node entegrasyonu kapalı, sandbox açık

## Önemli sınırlar

QuestHub Discord'a sahte oyun etkinliği veya sahte Quest ilerlemesi göndermez; görevleri otomatik tamamlamaz ve ödül talep etmez. Görevlerin gerçek koşullarını Discord uygulamasından kontrol edin.

Bu ilk ön sürüm mağaza hesaplarına bağlanmaz, kurulu oyun kütüphanelerini tam olarak taramaz ve Discord Rich Presence entegrasyonu içermez. Oyun algılama, bilinen süreç adları üzerinden yapılır; bu nedenle tüm oyunlar garanti edilmez.

## Geliştirme

- Node.js 20 veya üzeri
- Windows 10/11 64-bit

```powershell
npm install
npm start
```

## Windows kurulum dosyası oluşturma

```powershell
npm run dist
```

Kurulum dosyası `dist/` klasörüne oluşturulur. Electron Builder, Windows NSIS kurulum paketi üretir. İlk çalıştırma ve paketleme işlemleri Windows üzerinde test edilmelidir.

## Güvenlik

Bağımlılıkları güncel tutun ve `npm audit` çıktısını inceleyin. Bu proje henüz bağımsız güvenlik denetiminden veya antivirüs sertifikasyonundan geçmemiştir; hiçbir yazılım için sıfır risk ya da yüzde yüz zararsızlık garantisi verilemez.

## Lisans

MIT
