# 📝 Note App - Ứng dụng Ghi chú

Một ứng dụng ghi chú đơn giản được xây dựng với **Next.js 15**, **TypeScript**, và **Tailwind CSS** theo wireframe đã thiết kế.

![Note App](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Note+App+Screenshot)

## ✨ Tính năng

- 🔐 **JWT Authentication** với backend API
- 📝 **Tạo/Chỉnh sửa/Xóa** ghi chú với API integration
- 📋 **Danh sách bullet points** trong mỗi note
- 🎯 **Giao diện đơn giản** theo wireframe
- 📱 **Responsive design**
- 💪 **Type-safe** với TypeScript
- 🔄 **Real-time data** sync với database
- ⚡ **Loading states** và error handling

## 🛠️ Công nghệ sử dụng

- [Next.js 15](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety  
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Heroicons](https://heroicons.com/) - Beautiful icons
- [ESLint](https://eslint.org/) - Code quality

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- Node.js 18.17 hoặc mới hơn
- npm, yarn, hoặc pnpm

### Cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd nextjs_task
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```

4. **Mở ứng dụng**
   
   Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## 🔌 API Integration

Ứng dụng yêu cầu backend API chạy tại `http://localhost:3000` với các endpoint sau:

### 🔐 Authentication
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "12345"
}
```

**Response:**
```json
{
  "accessToken": "jwt_token_here",
  "user": {
    "id": 2,
    "username": "admin"
  }
}
```

### 📝 Notes API
```http
GET    /notes                    # Lấy tất cả notes
POST   /notes                    # Tạo note mới  
GET    /notes/:id               # Lấy chi tiết note
PATCH  /notes/:id               # Cập nhật note
DELETE /notes/:id               # Xóa note
```

### 📋 Note Items API
```http
POST   /notes/:id/items         # Thêm item vào note
DELETE /notes/:id/items/:itemId # Xóa item khỏi note
```

**Headers required cho authenticated endpoints:**
```javascript
{
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

### 🧪 Demo Credentials
- **Username:** `admin`
- **Password:** `12345`

## 📱 Quy trình sử dụng

### Page 1: Đăng nhập (`/`)
- Nhập email và mật khẩu (bất kỳ)
- Click "Đăng nhập" để vào dashboard

### Page 2: Dashboard (`/dashboard`)  
- **Sidebar trái**: Button "+" để tạo note mới
- **Main area**: Hiển thị các note cards
- **Note cards**: Chứa danh sách bullet points
- **Icons**: Edit (✏️) và Delete (🗑️) ở góc trên phải mỗi note
- **Logout**: Button đăng xuất ở cuối sidebar

### Page 3: Edit Modal
- Click icon Edit trên note để mở modal
- Chỉnh sửa tiêu đề và nội dung
- Thêm/xóa bullet points
- Click "Cập nhật" để lưu thay đổi

## 📁 Cấu trúc thư mục

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx      # Trang dashboard chính
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx         # Trang đăng nhập
├── lib/
│   └── api.ts           # API service và types
public/                  # Static assets
└── ...
```

## 🎨 Design System

### Layout
- **Sidebar**: 192px width, màu trắng với shadow
- **Main content**: Flex-1, background xám nhạt
- **Note cards**: Background xám, border rounded, relative positioning
- **Modal**: Fixed overlay với border xanh

### Color Scheme
- Background: `bg-gray-100`
- Cards: `bg-gray-200` với `border-gray-400`
- Buttons: Gray cho normal, blue cho primary, red cho delete
- Modal: White background với `border-blue-400`

## 📱 Scripts có sẵn

```bash
# Chạy development server
npm run dev

# Build cho production  
npm run build

# Chạy production server
npm run start

# Chạy ESLint
npm run lint
```

## 🔧 Tính năng chính

### Authentication
- JWT token-based authentication với backend API
- Token được lưu trong localStorage  
- Auto redirect khi chưa đăng nhập hoặc token invalid
- Logout functionality với API service

### Note Management
- Tạo note mới với API call và lưu vào database
- Edit note với modal popup và real-time sync
- Delete note với API call và confirmation
- Bullet points management với API integration
- Loading states cho tất cả operations
- Error handling với user-friendly messages

### UI/UX
- Clean, minimal design theo wireframe
- Responsive cho mobile và desktop
- Smooth transitions và hover effects
- Intuitive icon placement

## 🚀 Deploy

### Vercel (Recommended)
1. Push code lên GitHub
2. Kết nối repository với [Vercel](https://vercel.com)
3. Deploy tự động

### Netlify  
1. Build project: `npm run build`
2. Upload thư mục `out/` lên Netlify

## 🔒 Bảo mật

> **Lưu ý**: Đây là demo app với authentication đơn giản. Trong production cần:
> - Backend API authentication
> - Secure token storage
> - Input validation và sanitization
> - HTTPS enforced

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Được xây dựng với ❤️ bằng Next.js & TypeScript</p>
  <p>Theo thiết kế wireframe được cung cấp</p>
</div>
