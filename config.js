// 🔧 إعدادات الشيتات (ضع المعرّفات الصحيحة)
window.SHEETS_CONFIG = {
  PRODUCTS_SSID: '1K08r0X7XQ6ZUkUYjR8QI_91X1hX6v7K8e6181Vuz4os', // منتجات
  PLAYLISTS_SSID: '1QvNlmAyMIaRd0kWov1ga7WyNt-gvK1VboczHhvDnzzg', // قوائم موسيقية

  // ورقة القوائم الموسيقية وحقولها
  PLAYLISTS_SHEET: 'Playlists',
  PLAYLISTS_HEADERS: {
    period: 'period',
    title: 'title',
    src: 'src',
    duration: 'duration' // ثواني
  },

  // ورقة الإعدادات للحصول على أسماء أوراق المنتجات
  CONFIG_SHEET: 'Config',
  CONFIG_PRODUCTS_LIST_RANGE: 'A2:A', // عمود يحوي أسماء الأوراق (الفئات)

  // خرائط أعمدة المنتجات
  PRODUCT_HEADERS: {
    image: ['image','صورة','img','الرابط'],
    name:  ['name','الاسم','title','text','نص','وصف'],
    price: ['price','السعر'],
    link:  ['link','رابط'],
    mood:  ['mood','الفترة','period']
  },
  // فهارس احتياطية لو ما وجد رؤوس
  PRODUCT_FALLBACK_INDEX: {
    image: 5,   // F
    name:  18,  // S
    price: -1,
    link:  -1,
    mood:  -1
  }
};
