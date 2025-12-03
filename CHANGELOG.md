# Changelog

Tüm önemli değişiklikler bu dosyada belgelenecektir.

## [1.1.0] - 2025-12-02

### ✨ Yeni Özellikler
- Toast bildirim sistemi eklendi (başarı, hata, uyarı, bilgi)
- Error Boundary component eklendi
- İstatistikler ekranına grafikler eklendi:
  - Pie Chart: Duygu dağılımı
  - Line Chart: Motivasyon trendi
  - Bar Chart: Son 7 gün aktivite
- API token desteği eklendi (Hugging Face)
- Gelişmiş input validation

### 🔧 İyileştirmeler
- AI servis hata yönetimi iyileştirildi:
  - Exponential backoff retry mekanizması
  - Detaylı hata mesajları
  - Network error detection
  - Rate limiting handling
- Performans optimizasyonları:
  - useMemo ve useCallback kullanımı
  - Component memoization
- UI/UX iyileştirmeleri:
  - Loading states
  - Error messages
  - Input validation feedback
  - Animations

### 🐛 Hata Düzeltmeleri
- API timeout sorunları düzeltildi
- Model loading retry mekanizması eklendi
- Offline durumda daha iyi kullanıcı deneyimi

## [1.0.0] - 2025-12-01

### ✨ İlk Sürüm
- Günlük girdi ekranı
- Duygu analizi (Hugging Face API)
- Geçmiş kayıtları görüntüleme
- İstatistikler ekranı
- Offline çalışma desteği
- AsyncStorage ile lokal veri saklama

