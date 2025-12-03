# Dil Seçeneği Test Rehberi

## 🎯 Test Senaryoları

### 1. Dil Seçici Testi
- ✅ Uygulamayı açın
- ✅ HomeScreen'de üstte dil seçici görünmeli (🇹🇷 Türkçe / 🇬🇧 English)
- ✅ Türkçe seçildiğinde tüm metinler Türkçe olmalı
- ✅ İngilizce seçildiğinde tüm metinler İngilizce olmalı

### 2. Türkçe Analiz Testi
**Dil:** 🇹🇷 Türkçe seçili
**Test Metni:**
```
Bugün çok mutlu bir gün geçirdim. Harika bir haber aldım ve kendimi çok iyi hissediyorum.
```

**Beklenen Sonuçlar:**
- ✅ API: `ba2hann/bert-base-turkish-sentiment-analysis` kullanılmalı
- ✅ Sentiment: Pozitif olmalı
- ✅ Özet ve öneriler Türkçe olmalı
- ✅ Duygular Türkçe anahtar kelimelerle tespit edilmeli

### 3. İngilizce Analiz Testi
**Dil:** 🇬🇧 English seçili
**Test Metni:**
```
Today was a wonderful day. I received great news and I feel amazing!
```

**Beklenen Sonuçlar:**
- ✅ API: `distilbert-base-uncased-finetuned-sst-2-english` kullanılmalı (PDF gereksinimi)
- ✅ Sentiment: Positive olmalı
- ✅ Özet ve öneriler İngilizce olmalı
- ✅ Duygular İngilizce anahtar kelimelerle tespit edilmeli

### 4. Dil Değiştirme Testi
- ✅ Türkçe'den İngilizce'ye geçiş yapın
- ✅ Dil tercihi kaydedilmeli (uygulama yeniden açıldığında hatırlanmalı)
- ✅ Yeni analiz seçilen dilde yapılmalı

### 5. Offline Fallback Testi
**Test:** İnternet bağlantısını kapatın veya API hatası simüle edin

**Beklenen:**
- ✅ Türkçe seçiliyse Türkçe keyword analizi kullanılmalı
- ✅ İngilizce seçiliyse İngilizce keyword analizi kullanılmalı
- ✅ "Çevrimdışı mod" veya "Offline mode" mesajı gösterilmeli

## 🔍 Kontrol Listesi

- [ ] Dil seçici görünüyor mu?
- [ ] Türkçe seçildiğinde UI Türkçe mi?
- [ ] İngilizce seçildiğinde UI İngilizce mi?
- [ ] Türkçe analiz doğru modeli kullanıyor mu?
- [ ] İngilizce analiz PDF'deki modeli kullanıyor mu?
- [ ] Dil tercihi kaydediliyor mu?
- [ ] Offline modda doğru dil analizi yapılıyor mu?

## 📝 Notlar

- **Türkçe Model:** `ba2hann/bert-base-turkish-sentiment-analysis`
- **İngilizce Model:** `distilbert-base-uncased-finetuned-sst-2-english` (PDF gereksinimi)
- Dil tercihi AsyncStorage'da saklanıyor
- Her dil için ayrı keyword setleri kullanılıyor

