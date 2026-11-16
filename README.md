# QuestHub

QuestHub, Windows 10 ve Windows 11 (64-bit) için geliştirilen Türkçe masaüstü oyun takip uygulamasıdır.

## Özellikler

- Türkçe, koyu temalı masaüstü arayüzü
- Üst bölümde oyun/görev arama alanı
- Steam, Epic Games ve Riot Games ile ilişkilendirilen seçili oyunların çalışan süreçlerini algılama
- Rockstar Games'in PC sürümleri için oyun kataloğu
- Rockstar oyunları için Windows kayıt defteri ve yaygın Rockstar Games kurulum klasörlerinde otomatik kurulum taraması
- Rockstar oyunlarında kurulu ve çalışıyor durumlarını ayrı gösterme
- Discord Quest görevleri için manuel kontrol listesi
- Electron güvenlik ayarları: context isolation açık, Node entegrasyonu kapalı, sandbox açık

## Rockstar PC oyun kataloğu

- Grand Theft Auto III
- Grand Theft Auto: Vice City
- Grand Theft Auto: San Andreas
- Grand Theft Auto IV
- Grand Theft Auto V
- Grand Theft Auto: The Trilogy – The Definitive Edition
- Red Dead Redemption
- Red Dead Redemption 2
- L.A. Noire
- Max Payne
- Max Payne 2: The Fall of Max Payne
- Max Payne 3
- Bully: Scholarship Edition
- Manhunt
- Manhunt 2
- Midnight Club II

PC sürümü bulunmayan konsol oyunları kataloğa eklenmemiştir. Süreç adları ve klasör adları sürüm/mağazaya göre değişebildiğinden bazı oyunların çalışma veya kurulum durumu algılanamayabilir.

## Önemli sınırlar

QuestHub Discord'a sahte oyun etkinliği veya sahte Quest ilerlemesi göndermez; görevleri otomatik tamamlamaz ve ödül talep etmez. Görevlerin gerçek koşullarını Discord uygulamasından kontrol edin.

Rockstar kurulum taraması Windows kayıt defterindeki Rockstar Games kayıtlarını ve yaygın Rockstar Games kurulum dizinlerini kontrol eder. Bu yöntem tüm özel Steam/Epic kitaplıklarını veya taşınmış oyun klasörlerini garantiyle bulmaz. Diğer mağazalardaki oyunlar için bu sürüm ağırlıklı olarak çalışan süreç algılaması yapar. Mağaza hesaplarına bağlanmaz ve oyun başlatmaz.

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
