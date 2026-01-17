# Supabase Kurulum Adımları

## ✅ SQL Şemasını Çalıştırma

### Adım 1: Supabase Dashboard'a Gidin
1. https://supabase.com/dashboard adresine gidin
2. Projenizi seçin: `uuiwyrjzbagvwoobbuor`

### Adım 2: SQL Editor'ü Açın
1. Sol menüden **SQL Editor** seçeneğine tıklayın
2. **New Query** butonuna tıklayın

### Adım 3: SQL Kodunu Yapıştırın
1. `database.sql` dosyasının tamamını kopyalayın
2. SQL Editor'e yapıştırın
3. **Run** (Çalıştır) butonuna tıklayın

### Adım 4: Sonuçları Kontrol Edin
Başarılı olursa şu mesajları göreceksiniz:
- ✅ `CREATE TABLE` - leads tablosu oluşturuldu
- ✅ `CREATE TABLE` - projects tablosu oluşturuldu
- ✅ `CREATE INDEX` - İndeksler oluşturuldu
- ✅ `CREATE POLICY` - RLS politikaları oluşturuldu
- ✅ `CREATE FUNCTION` - Trigger fonksiyonu oluşturuldu

## 🔍 Doğrulama

### Tabloları Kontrol Edin
1. Sol menüden **Table Editor** seçin
2. Şu tabloları göreceksiniz:
   - `leads` (9 sütun)
   - `projects` (6 sütun)

### RLS Politikalarını Kontrol Edin
1. Table Editor'de `leads` tablosunu seçin
2. Sağ üstten **RLS** (Row Level Security) butonuna tıklayın
3. Şu politikaları göreceksiniz:
   - "Allow public insert"
   - "Allow authenticated select"

## 🧪 Test Etme

### Test 1: Lead Ekleme (Anonim)
SQL Editor'de şunu çalıştırın:

```sql
INSERT INTO public.leads (name, email, phone, company, message, interest_area)
VALUES ('Test User', 'test@example.com', '+90 555 123 4567', 'Test Company', 'Test mesajı', 'demo');
```

Başarılı olursa: `INSERT 0 1`

### Test 2: Lead Okuma
```sql
SELECT * FROM public.leads ORDER BY created_at DESC LIMIT 5;
```

Eklediğiniz test kaydını göreceksiniz.

### Test 3: Uygulama Bağlantısı
1. Tarayıcıda http://localhost:5173/ adresini açın
2. Browser Console'u açın (F12)
3. Supabase bağlantı hatası olmamalı

## ⚠️ Olası Hatalar ve Çözümleri

### Hata: "relation already exists"
**Çözüm**: Tablolar zaten oluşturulmuş. SQL'deki `DROP TABLE` komutlarını kullanabilirsiniz:

```sql
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
```

Ardından `database.sql` dosyasını tekrar çalıştırın.

### Hata: "permission denied"
**Çözüm**: Supabase Dashboard'da doğru projeyi seçtiğinizden emin olun.

### Hata: "policy already exists"
**Çözüm**: SQL dosyası zaten `DROP POLICY IF EXISTS` komutlarını içeriyor. Tekrar çalıştırabilirsiniz.

## 📊 Beklenen Sonuç

Başarılı kurulum sonrası:
- ✅ 2 tablo oluşturuldu (leads, projects)
- ✅ 5 indeks oluşturuldu
- ✅ 6 RLS politikası aktif
- ✅ 1 trigger fonksiyonu çalışıyor
- ✅ Uygulama Supabase'e bağlanabiliyor

## 🚀 Sonraki Adımlar

1. **Kayıt Olun**: Ana sayfadan "Kayıt Ol" ile hesap oluşturun
2. **Chatbot Oluşturun**: Builder'da örnek promptları deneyin
3. **İletişim Formu Test Edin**: "Satış Ekibiyle Görüş" butonunu kullanın
4. **Verileri Kontrol Edin**: Supabase Table Editor'de lead'leri görün

---

**Not**: `.env` dosyası zaten Supabase credentials'larınızla oluşturuldu. Development server yeniden başlatmanız gerekebilir:

```bash
# Terminal'de Ctrl+C ile durdurun
# Ardından tekrar başlatın:
npm run dev
```
