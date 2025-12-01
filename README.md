# AI Günlük Asistanım 🤖📱

> **Duygularınızı anlayan, size rehberlik eden yapay zeka destekli günlük asistan uygulaması**

[![React Native](https://img.shields.io/badge/React%20Native-0.82.1-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

## 📖 Proje Hakkında

**AI Günlük Asistanım**, kullanıcıların günlük duygularını ve düşüncelerini paylaşabileceği, yapay zeka destekli bir mobil uygulamadır. Uygulama, kullanıcının yazdığı metinleri analiz ederek duygu durumunu tespit eder, kişiselleştirilmiş öneriler sunar ve istatistikler ile kullanıcının ruh halini takip etmesine yardımcı olur.

Bu proje, **React Native + AI Stajyer Projesi** kapsamında geliştirilmiştir.

## ✨ Özellikler

### 🎯 Temel Özellikler
- **Duygu Analizi**: Pozitif, negatif ve nötr duygu tespiti
- **Çoklu Emotion Detection**: 8 farklı duygu türü (mutlu, üzgün, endişeli, sakin, motive, yorgun, heyecanlı, stresli)
- **Motivasyon Skoru**: 0-100 arası motivasyon puanı hesaplama
- **Kişiselleştirilmiş Öneriler**: Duygu durumuna göre özel öneriler
- **Offline Destek**: İnternet olmadan geçmiş kayıtlara erişim
- **Haftalık İstatistikler**: Duygu trendleri ve içgörüler

### 🏗️ Teknik Özellikler
- Clean Architecture pattern
- TypeScript ile tam tip güvenliği
- Redux Toolkit ile state management
- Custom hooks ile business logic ayrımı
- AsyncStorage ile lokal veri saklama
- Comprehensive error handling

## 🛠️ Teknoloji Stack'i

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| **Framework** | React Native | 0.82.1 |
| **Dil** | TypeScript | 5.8.3 |
| **State Management** | Redux Toolkit | 2.5.0 |
| **UI Kütüphanesi** | React Native Paper | 5.12.7 |
| **Navigation** | React Navigation | 7.x |
| **Storage** | AsyncStorage | 2.1.0 |
| **AI Integration** | Hugging Face API | - |
| **HTTP Client** | Axios | 1.7.9 |

## 📦 Kurulum

### Gereksinimler

- Node.js >= 20.x
- npm
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- Android Studio (Android için) veya Xcode (iOS için)

### Kurulum Adımları

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/huriyeeym/ai-daily-assistant.git
cd ai-daily-assistant
```

2. **Dependencies'leri yükleyin**
```bash
npm install
```

3. **Uygulamayı başlatın**

**Android:**
```bash
npm run android
```

**iOS:** (sadece macOS)
```bash
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

## 🤖 AI Entegrasyonu

### Hugging Face API

Uygulama, sentiment analysis için **Hugging Face Inference API** kullanmaktadır.

**Model**: `distilbert-base-uncased-finetuned-sst-2-english`

### API Token (Opsiyonel)

API token olmadan çalışır, ancak rate limiting olabilir. Daha iyi performans için:

1. [Hugging Face](https://huggingface.co/) hesabı oluşturun
2. [Access Tokens](https://huggingface.co/settings/tokens) sayfasından token alın
3. `.env.example` dosyasını `.env` olarak kopyalayın
4. Token'ınızı ekleyin

```bash
HUGGING_FACE_API_TOKEN=your_token_here
```

### AI Analiz Süreci

1. **Sentiment Analysis**: Hugging Face API ile pozitif/negatif analiz
2. **Emotion Detection**: Keyword-based Türkçe duygu tespiti
3. **Motivation Score**: Sentiment skoruna göre hesaplama
4. **Summary & Suggestions**: Duygu durumuna göre özelleştirilmiş mesajlar

## 📱 Proje Yapısı

```
src/
├── api/              # API client ve endpoints
├── components/       # Reusable components
├── config/           # Uygulama konfigürasyonu
├── constants/        # Sabitler
├── hooks/            # Custom React hooks
├── models/           # TypeScript interfaces
├── navigation/       # Navigation yapılandırması
├── screens/          # Screen componentleri
│   ├── HomeScreen/
│   ├── HistoryScreen/
│   └── StatisticsScreen/
├── services/         # Business logic servisler
├── store/            # Redux store
├── theme/            # Theme konfigürasyonu
└── utils/            # Utility fonksiyonları
```

Detaylı mimari dokümantasyonu: [ARCHITECTURE.md](ARCHITECTURE.md)

## 🤝 AI Araç Kullanımı

### Claude Code ile Geliştirme

Bu proje geliştirilirken **Claude Code** (Anthropic'in AI kod asistanı) kullanılmıştır.

#### Kullanım Alanları:
- Proje yapısı ve clean architecture
- TypeScript modelleri ve interfaces
- Redux Toolkit setup
- Service layer implementasyonu
- Custom hooks (useAnalysis, useEntries, useTheme)
- UI componentleri ve styling
- Dokümantasyon

#### İnsan Katkısı:
- Proje gereksinimleri ve özellik tanımlamaları
- UX/UI tasarım kararları
- Türkçe içerik ve mesajlar
- Kod review ve optimizasyonlar
- Test ve debugging

### Şeffaflık

Projenin yaklaşık **%70-80'i** AI yardımıyla yazılmıştır. Ancak tüm kod:
- İncelendi ve anlaşıldı
- Test edildi ve doğrulandı
- Best practices'e göre optimize edildi
- Projenin gereksinimlerine göre özelleştirildi

## 📝 Yapılacaklar

- [ ] Dark mode desteği implementasyonu
- [ ] Grafik görselleştirmeleri (ChartKit)
- [ ] Export/Import functionality
- [ ] Push notification desteği
- [ ] Unit ve integration testleri

## 👨‍💻 Geliştirici

GitHub: [@huriyeeym](https://github.com/huriyeeym)

## 🙏 Teşekkürler

- [Hugging Face](https://huggingface.co/) - AI Model API
- [React Native Paper](https://callstack.github.io/react-native-paper/) - UI Components
- [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
- [React Navigation](https://reactnavigation.org/) - Navigation

---

**Not**: Bu proje "React Native + AI Stajyer Projesi" kapsamında geliştirilmiştir ve modern mobil uygulama geliştirme pratiklerini göstermektedir.

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!
