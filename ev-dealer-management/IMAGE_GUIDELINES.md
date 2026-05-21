# 📸 Hướng Dẫn Kích Thước Ảnh Xe

## ✅ Kích Thước Khuyến Nghị

### 🏆 **Khuyến nghị chính: 1280x720px (16:9)**
- Tỷ lệ chuẩn cho xe hơi
- Cân bằng tốt giữa chất lượng và dung lượng
- Tải nhanh, hiển thị đẹp

### Các Lựa Chọn Khác:

**Tỷ lệ 16:9 (Landscape - Nằm ngang):**
- ⭐ **1920x1080px** (Full HD) - Chất lượng cao nhất
- ✅ **1280x720px** (HD) - **KHUYẾN NGHỊ**
- ⚡ **960x540px** - Nhẹ, tải cực nhanh
- 💾 **800x450px** - Nhỏ gọn

**Tỷ lệ 4:3 (Cũng chấp nhận được):**
- **1200x900px**
- **800x600px**

## 🎨 Yêu Cầu Chất Lượng

### ✅ ĐÚng:
- ✓ Định dạng: **JPG** hoặc **PNG**
- ✓ Dung lượng: **< 500KB** (tối ưu)
- ✓ Độ phân giải: **72-150 DPI** (web)
- ✓ Tỷ lệ: **16:9** hoặc **4:3**
- ✓ Nền: **Trắng** hoặc **Trong suốt** (PNG)
- ✓ Góc chụp: **3/4 trước** hoặc **Nghiêng 45°**

### ❌ SAI:
- ✗ Ảnh quá nhỏ (< 800px width)
- ✗ Ảnh quá lớn (> 3000px hoặc > 2MB)
- ✗ Tỷ lệ lẻ (1:1, 21:9...)
- ✗ Ảnh bị mờ, nhiễu
- ✗ Watermark, logo lớn

## 📐 Cách Resize Ảnh

### Online Tools (Miễn phí):
1. **TinyPNG** - https://tinypng.com (Nén không mất chất lượng)
2. **Squoosh** - https://squoosh.app (Google tool)
3. **ResizeImage** - https://resizeimage.net

### Photoshop:
```
File > Export > Save for Web (Legacy)
- Image Size: 1280x720px
- Quality: 70-80%
- Format: JPEG
```

### Code (Python):
```python
from PIL import Image

img = Image.open('vehicle.jpg')
img = img.resize((1280, 720), Image.LANCZOS)
img.save('vehicle_optimized.jpg', quality=85, optimize=True)
```

## 🖼️ Template Upload

Khi upload ảnh xe mới, đảm bảo:

1. **Ảnh chính (Main)**: 1280x720px - Góc 3/4 trước
2. **Ảnh phụ 1**: 1280x720px - Góc 3/4 sau
3. **Ảnh phụ 2**: 1280x720px - Nội thất/cabin
4. **Ảnh phụ 3**: 1280x720px - Chi tiết (bánh xe, đèn, logo...)

## 🎯 Lợi Ích

✅ **Không bị móp méo** - Tỷ lệ cố định
✅ **Tải nhanh** - Dung lượng tối ưu
✅ **Responsive** - Hiển thị đẹp trên mọi thiết bị
✅ **SEO tốt** - Google thích ảnh tối ưu
✅ **UX tốt** - Người dùng không phải chờ lâu

## 📝 Checklist Trước Khi Upload

- [ ] Kích thước: 1280x720px hoặc 1920x1080px
- [ ] Định dạng: JPG hoặc PNG
- [ ] Dung lượng: < 500KB
- [ ] Tên file: có ý nghĩa (vd: `tesla-model-3-white-front.jpg`)
- [ ] Góc chụp: rõ ràng, đẹp mắt
- [ ] Nền: sạch sẽ, không lộn xộn
- [ ] Đã nén/tối ưu

---

**Lưu ý:** Frontend đã được config `object-fit: contain` nên ảnh sẽ tự động scale mà không bị méo. Nhưng tốt nhất vẫn nên dùng tỷ lệ chuẩn!
