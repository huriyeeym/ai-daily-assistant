# 🤖 Hugging Face API Kurulum Rehberi

Bu proje, PDF gereksinimlerine uygun olarak **Hugging Face Inference API** kullanmaktadır.

## 📋 API Kullanımı

### Varsayılan Kullanım (Token Olmadan)

API token olmadan da çalışır, ancak:
- ⚠️ Rate limiting olabilir (dakikada sınırlı istek)
- ⚠️ Model yüklenirken 503 hatası alabilirsiniz (otomatik retry var)

### Token ile Kullanım (Önerilen)

Daha iyi performans ve rate limit olmadan kullanım için:

1. **Hugging Face Hesabı Oluşturun**
   - https://huggingface.co/ adresine gidin
   - Ücretsiz hesap oluşturun

2. **Access Token Alın**
   - https://huggingface.co/settings/tokens adresine gidin
   - "New token" butonuna tıklayın
   - Token'a "read" yetkisi verin
   - Token'ı kopyalayın

3. **Token'ı Uygulamaya Ekleyin**

   **Seçenek 1: Kod İçinde (Geliştirme için)**
   
   `src/api/client.ts` dosyasında:
   ```typescript
   private loadApiToken() {
     this.apiToken = 'your_token_here'; // Token'ınızı buraya ekleyin
   }
   ```
   
   **Seçenek 2: Environment Variable (Önerilen)**
   
   `react-native-config` paketi kullanarak:
   ```bash
   npm install react-native-config
   ```
   
   `.env` dosyası oluşturun:
   ```
   HUGGING_FACE_API_TOKEN=your_token_here
   ```
   
   `src/api/client.ts` dosyasında:
   ```typescript
   import Config from 'react-native-config';
   
   private loadApiToken() {
     this.apiToken = Config.HUGGING_FACE_API_TOKEN || null;
   }
   ```

## 🔧 API Endpoint

- **URL:** `https://api-inference.huggingface.co/models`
- **Model:** `distilbert-base-uncased-finetuned-sst-2-english`
- **Endpoint:** `/distilbert-base-uncased-finetuned-sst-2-english`

## 📊 API Nasıl Çalışıyor?

1. **Primary:** Hugging Face API'ye istek gönderilir
2. **Enhancement:** API sonucu Türkçe keyword analizi ile desteklenir
3. **Fallback:** API başarısız olursa Türkçe keyword analizi kullanılır

## ⚠️ Bilinen Sorunlar ve Çözümler

### 401 Hatası (Unauthorized)
- **Sebep:** Token gerekli veya geçersiz
- **Çözüm:** Token ekleyin veya birkaç saniye bekleyip tekrar deneyin

### 503 Hatası (Model Loading)
- **Sebep:** Model ilk kez yükleniyor
- **Çözüm:** Otomatik retry mekanizması var (3 deneme, exponential backoff)

### 429 Hatası (Rate Limit)
- **Sebep:** Çok fazla istek gönderildi
- **Çözüm:** Token kullanın veya birkaç saniye bekleyin

### 410 Hatası (Gone)
- **Sebep:** Endpoint güncellenmiş
- **Çözüm:** Uygulama güncel endpoint kullanıyor

## 🧪 Test Etme

1. Token olmadan test edin (rate limit olabilir)
2. Token ile test edin (daha stabil)
3. İnternet bağlantısını kesip offline modu test edin

## 📝 Notlar

- API **ücretsiz** kullanılabilir (token ile daha iyi)
- Model İngilizce eğitilmiş, Türkçe için enhancement yapılıyor
- Offline modda Türkçe keyword analizi kullanılıyor

