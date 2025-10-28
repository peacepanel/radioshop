# Radio Shop — GitHub Edition

واجهة ستاتيكية على GitHub Pages تقرأ المنتجات وقائمة الأغاني من Google Sheets عامة عبر واجهة GViz (بدون GAS).

## المتطلبات
- Google Sheets عامة (أو Published to the web).
- تعبئة الشيتات كما يلي.

## الشيتات
### 1) Sheet: Playlists (ضمن PLAYLISTS_SSID)
أضف ورقة باسم **Playlists** بعناوين الأعمدة بالضبط:

| period | title | src | duration |
|--------|-------|-----|----------|
| morning | Sunny Morning | https://your-domain/audio/track1.mp3 | 139 |
| day     | Energy        | https://your-domain/audio/track2.mp3 | 155 |
| night   | Calm Night    | https://your-domain/audio/track3.mp3 | 198 |

> **src** يجب أن يكون رابط MP3 مباشر. يُفضل استضافة الملفات في نفس الريبو داخل مجلد `audio/` ثم استعمال رابط GitHub Pages.

### 2) Sheet: Config (ضمن PRODUCTS_SSID)
ورقة باسم **Config**، العمود **A** يحوي أسماء أوراق المنتجات (الفئات)، سطر لكل اسم، ابتداء من **A2**.

مثال:
```
A
-
Accessories
Goods
Shoes
```

### 3) أوراق المنتجات (ضمن PRODUCTS_SSID)
لكل فئة (مثلاً: `Accessories`, `Goods`) أنشئ ورقة بيانات. يفضّل وضع رؤوس أعمدة واضحة (على الصف 1):

- `image`  (رابط صورة)
- `name`   (اسم/وصف)
- `price`  (نصي)
- `link`   (اختياري)
- `mood`   (morning/day/night – اختياري للتصفية)

> إن لم توجد رؤوس مطابقة، سيستخدم التطبيق الفهارس الاحتياطية: `image` ← العمود 6 (F)، و`name` ← العمود 19 (S).

## تفعيل القراءة العامة
1. افتح الشيت → **File → Share → Publish to the web** → Publish.
2. أو اجعل المشاركة **Anyone with the link – Viewer**.

## الضبط
حرر ملف `assets/config.js` وحدد القيم:
- `PRODUCTS_SSID` معرف شيت المنتجات
- `PLAYLISTS_SSID` معرف شيت القوائم
- تأكد من أسماء الأوراق: `PLAYLISTS_SHEET`, `CONFIG_SHEET`

## النشر على GitHub Pages
1. أنشئ Repository عام وارفع الملفات.
2. **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Branch: `main`, Folder: `/ (root)`.
4. افتح رابط Pages الظاهر.

## ملاحظات تشغيل الصوت
- يجب الضغط على زر "تشغيل" بسبب سياسات المتصفح (Autoplay).
- لو وضعت روابط Google Drive مباشرة قد تتعرّض لمشاكل CORS أو التحميل البطيء على بعض الأجهزة. الأفضل استضافة MP3 على GitHub Pages أو CDN.

## تخصيصات إضافية
- إن رغبت بمزامنة أدق بين الأجهزة، أضف EndPoint وقت بسيط (مثلاً Cloudflare Worker يعيد `{now: Date.now()}`) واستبدل حساب الوقت المحلي في `radio.js` بالقيمة القادمة من المخدم.
