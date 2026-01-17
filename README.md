# Apricodi AI Builder - Enhanced Features

## 🎉 Yeni Özellikler

Bu güncelleme ile Apricodi AI Builder'a şu özellikler eklendi:

### 1. İnteraktif Chatbot Demoları
- Şirket bilgilerine dayalı akıllı soru-cevap sistemi
- Önceden tanımlanmış Q&A veritabanı desteği
- Gerçek zamanlı mesajlaşma ve yazıyor göstergesi
- Bağlam farkındalığı ile akıllı yanıtlar

### 2. Kullanıcı Kaydı ve Kimlik Doğrulama
- Supabase Auth ile tam entegre kayıt sistemi
- Oturum yönetimi ve kalıcılık
- Kullanıcı profil bilgileri (ad, şirket)
- Güvenli şifre yönetimi

### 3. Satış Ekibi İletişim Formu
- Lead toplama ve Supabase'e kaydetme
- Form validasyonu ve hata yönetimi
- Başarı/hata bildirimleri
- İlgi alanı kategorileri

### 4. Supabase Veritabanı Entegrasyonu
- `leads` tablosu - İletişim formu gönderileri
- `projects` tablosu - Kullanıcı projeleri (gelecek özellik)
- Row Level Security (RLS) politikaları
- Otomatik zaman damgaları

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Supabase Yapılandırması

`.env.example` dosyasını `.env` olarak kopyalayın ve Supabase bilgilerinizi girin:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Veritabanı Tablolarını Oluşturun

1. Supabase Dashboard'a gidin
2. SQL Editor'ü açın
3. `database.sql` dosyasının içeriğini kopyalayıp çalıştırın

Bu işlem şu tabloları oluşturacak:
- `leads` - İletişim formu verileri
- `projects` - Kullanıcı projeleri
- Gerekli indeksler ve RLS politikaları

### 4. Uygulamayı Çalıştırın

```bash
npm run dev
```

## 📋 Veritabanı Şeması

### `leads` Tablosu

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID | Birincil anahtar |
| name | TEXT | Ad soyad |
| email | TEXT | E-posta adresi |
| phone | TEXT | Telefon numarası |
| company | TEXT | Şirket adı |
| message | TEXT | Mesaj içeriği |
| interest_area | TEXT | İlgi alanı (demo, pricing, vb.) |
| project_id | TEXT | İlgili proje ID (opsiyonel) |
| created_at | TIMESTAMP | Oluşturulma zamanı |

### `projects` Tablosu

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID | Birincil anahtar |
| user_id | UUID | Kullanıcı ID (auth.users) |
| name | TEXT | Proje adı |
| description | TEXT | Proje açıklaması |
| schema | JSONB | Uygulama şeması |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Güncellenme zamanı |

## 🎯 Kullanım

### İnteraktif Chatbot Oluşturma

Builder'da şu şekilde bir prompt kullanın:

```
Müşteri destek chatbot'u oluştur - TechCorp adlı yazılım şirketi için, 
ürünlerimiz: AI Analytics, Cloud Platform, API Gateway. 
Müşteriler ürünler hakkında soru sorabilsin ve fiyat bilgisi alabilsin.
```

Chatbot otomatik olarak:
- Şirket bilgilerini anlayacak
- Ürünler hakkında sorulara cevap verecek
- Bağlam farkındalığı ile akıllı yanıtlar verecek

### Kullanıcı Kaydı

1. Ana sayfadan "Kayıt Ol" butonuna tıklayın
2. Formu doldurun (ad, e-posta, şirket, şifre)
3. Otomatik olarak dashboard'a yönlendirileceksiniz

### Lead Toplama

İki yöntemle lead toplayabilirsiniz:

1. **Ana Sayfa İletişim Formu**: "Satış Ekibiyle Görüş" butonu
2. **Builder Lead Modal**: "Kodu İndir" veya "Yayınla" butonları

Tüm lead'ler Supabase `leads` tablosuna kaydedilir.

## 🔒 Güvenlik

- Row Level Security (RLS) tüm tablolarda aktif
- Kullanıcılar sadece kendi projelerini görebilir
- İletişim formları herkese açık (lead toplama için)
- Şifreler Supabase Auth tarafından güvenli şekilde saklanır

## 🛠️ Geliştirme

### Yeni Chatbot Yanıtları Ekleme

`ChatInterface.tsx` içindeki `generateResponse` fonksiyonunu düzenleyin:

```typescript
// Özel anahtar kelimeler için yanıt ekleyin
if (lowerMessage.includes('özel_kelime')) {
  return 'Özel yanıt';
}
```

### Yeni Form Alanları Ekleme

`ContactForm.tsx` veya `Register.tsx` componentlerini düzenleyin ve Supabase şemasını güncelleyin.

## 📝 Notlar

- Supabase ücretsiz planı 50,000 aylık aktif kullanıcıyı destekler
- Veritabanı boyutu limiti: 500 MB (ücretsiz plan)
- Gemini API kullanımı için Google AI Studio'dan API key alın
- Production'da environment variable'ları güvenli şekilde saklayın

## 🐛 Sorun Giderme

### Supabase Bağlantı Hatası

- `.env` dosyasının doğru konumda olduğundan emin olun
- Supabase URL ve Anon Key'in doğru olduğunu kontrol edin
- Browser console'da hata mesajlarını kontrol edin

### Auth Sorunları

- Supabase Dashboard > Authentication > Settings'den email confirmation'ı kapatabilirsiniz (geliştirme için)
- RLS politikalarının doğru yapılandırıldığından emin olun

### Chatbot Yanıt Vermiyor

- Prompt'ta şirket bilgilerinin açıkça belirtildiğinden emin olun
- Browser console'da hata mesajlarını kontrol edin
- `companyInfo` ve `qaDatabase` alanlarının doğru doldurulduğunu kontrol edin

## 📞 Destek

Sorularınız için:
- GitHub Issues
- E-posta: support@apricodi.com
