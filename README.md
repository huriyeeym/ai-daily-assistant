# AI Günlük Asistanım

> React Native + AI Stajyer Projesi

Yapay zeka destekli günlük asistan uygulaması. Kullanıcıların günlük duygularını ve düşüncelerini paylaşabileceği, AI ile analiz edilen ve kişiselleştirilmiş öneriler sunan mobil uygulama.

## Demo

[📹 Demo Video'yu İzle](https://drive.google.com/file/d/14DP1gXp86-HeSO_BrvJuiyIKdeUhurT4/view?usp=sharing)

> Demo video, "Analiz Et" ve "Geçmiş" ekranlarını gösterir.

## Özellikler

- **Duygu Analizi**: Pozitif, negatif ve nötr duygu tespiti (Hugging Face API)
- **Emotion Detection**: 8 farklı duygu türü tespiti
- **Motivasyon Skoru**: 0-100 arası motivasyon puanı
- **Kişiselleştirilmiş Öneriler**: Duygu durumuna göre özel öneriler
- **Haftalık Özet**: Pie chart ile duygu dağılımı ve haftalık mood analizi
- **Filtreleme**: Duygu ve tarih bazlı filtreleme (Today, Last 7 Days, This Month)
- **Offline Destek**: AsyncStorage ile lokal veri saklama

## Teknoloji Stack

- **Framework**: React Native 0.82.1
- **Dil**: TypeScript 5.8.3
- **State Management**: Redux Toolkit
- **UI**: React Native Paper
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **AI**: Hugging Face Inference API
- **HTTP Client**: Axios

## Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/huriyeeym/ai-daily-assistant.git
cd ai-daily-assistant

# Dependencies'leri yükleyin
npm install

# Android için çalıştırın
npm run android
```

## AI Entegrasyonu

Uygulama **Hugging Face Inference API** kullanarak sentiment analysis yapar.

- **Model**: `distilbert-base-uncased-finetuned-sst-2-english`
- **Otomatik Dil Algılama**: Türkçe ve İngilizce desteği
- **Hybrid Approach**: API sonuçları keyword-based analiz ile desteklenir
- **API Token**: Opsiyonel (rate limiting olmaması için önerilir)

## Test Ortamı

Bu proje aşağıdaki ortamda geliştirilmiş ve test edilmiştir:

- **İşletim Sistemi**: Windows 11 (64-bit)
- **Node.js**: v22.14.0
- **npm**: 10.9.2
- **React Native**: 0.82.1
- **Android Studio**: 2025.2.1.8
- **TypeScript**: 5.8.3
- **Geliştirme Aracı**: VS Code
- **Platform**: Android (Android Studio emulator ile test edilmiştir)

## Proje Yapısı

```
src/
├── api/              # API client
├── components/       # Reusable components
├── hooks/            # Custom React hooks
├── models/           # TypeScript interfaces
├── navigation/       # Navigation
├── screens/          # Screen components
│   ├── HomeScreen/   # Daily entry with AI analysis
│   └── HistoryScreen/ # Past entries with weekly summary
├── services/         # Business logic
├── store/            # Redux store
└── utils/            # Utility functions
```


## Proje Gereksinimleri

Bu proje, **React Native + AI Stajyer Projesi** gereksinimlerini karşılamaktadır:

- ✅ Günlük girdi ekranı (AI analizi)
- ✅ Geçmiş ekranı (haftalık özet ile)
- ✅ Offline çalışma (AsyncStorage)
- ✅ Hugging Face API entegrasyonu
- ✅ Modern UI/UX tasarımı
- ✅ TypeScript ve Clean Architecture


---

**Geliştirici**: [@huriyeeym](https://github.com/huriyeeym)
