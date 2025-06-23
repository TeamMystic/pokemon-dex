# 🔥 Pokemon Dex

## 📖 Description

Pokemon Dex adalah aplikasi web interaktif yang memungkinkan pengguna untuk mencari, menjelajahi, dan mempelajari informasi tentang Pokemon. Aplikasi ini dibangun menggunakan teknologi modern seperti React, Vite, dan Tailwind CSS dengan integrasi PokeAPI untuk data Pokemon yang real-time.

## ✨ Features

- 🔍 **Smart Search**: Pencarian Pokemon berdasarkan nama dengan real-time filtering
- 🎮 **Generation Filter**: Filter Pokemon berdasarkan generasi (I - IX) dengan multi-select
- 📱 **Responsive Design**: Tampilan yang optimal di semua device
- 🎨 **Modern UI**: Interface yang clean dan user-friendly menggunakan Tailwind CSS
- ⚡ **Infinite Scroll**: Load more Pokemon saat scroll ke bawah
- 🌐 **Real-time Data**: Menggunakan PokeAPI untuk data Pokemon terkini
- 🔗 **URL Parameters**: Filter tersimpan di URL untuk sharing dan bookmark

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.0.0
- **Build Tool**: Vite 6.3.1
- **Styling**: Tailwind CSS 4.1.4
- **Routing**: React Router DOM 7.5.1
- **UI Components**: Headless UI & Heroicons
- **HTTP Client**: Axios 1.8.4
- **Icons**: Lucide React & Heroicons

## 🚀 Getting Started

### Prerequisites

Pastikan Anda sudah menginstall:

- **Node.js** (versi 18 atau lebih tinggi)
- **npm** atau **yarn**

### Installation

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd pokemon-dex
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Run development server**

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. **Open browser**
   Buka [http://localhost:5173](http://localhost:5173) untuk melihat aplikasi

## 📝 Available Scripts

```bash
# Menjalankan development server
npm run dev

# Build untuk production
npm run build

# Preview build production
npm run preview

# Linting code
npm run lint
```

## 🗂️ Project Structure

```
pokemon-dex/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── assets/            # Images, icons, dll
│   ├── components/        # Reusable components
│   │   └── Navbar.jsx     # Navigation component
│   ├── hook/              # Custom React hooks
│   │   └── useSearchPokemon.jsx  # Hook untuk search & filter logic
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.jsx           # Application entry point
│   ├── router.jsx         # React Router configuration
│   └── index.css          # Global styles with Tailwind
├── package.json
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md
```

### Key Files:

- **`useSearchPokemon.jsx`**: Custom hook yang menghandle semua logic search, filter generasi, dan API calls
- **`App.jsx`**: Main component dengan UI search bar, generation filter, dan Pokemon grid
- **`router.jsx`**: Routing configuration dengan URL parameter support

## 🎯 How to Use

1. **Search Pokemon**: Ketik nama Pokemon di search bar untuk mencari Pokemon spesifik
2. **Filter by Generation**: Klik dropdown "Any generations" dan pilih satu atau lebih generasi Pokemon (Gen I - IX)
3. **Browse All Pokemon**: Biarkan field search kosong untuk melihat semua Pokemon
4. **Infinite Scroll**: Scroll ke bawah untuk memuat Pokemon lebih banyak secara otomatis
5. **URL Sharing**: URL akan update sesuai filter, bisa di-bookmark atau dishare

### Filter Combinations:

- **Search Only**: Mencari Pokemon berdasarkan nama
- **Generation Only**: Menampilkan Pokemon dari generasi tertentu
- **Search + Generation**: Mencari Pokemon dengan nama tertentu dalam generasi yang dipilih

## 🌐 API Integration

Aplikasi ini menggunakan [PokeAPI](https://pokeapi.co/) untuk mendapatkan data Pokemon:

- **Base URL**: `https://pokeapi.co/api/v2/`
- **Endpoints yang digunakan**:
  - `/pokemon?offset={offset}&limit={limit}` - List Pokemon dengan pagination
  - `/pokemon/{id or name}` - Detail Pokemon individual
  - `/generation/{id}` - Data Pokemon berdasarkan generasi

### Data yang Diambil:

- **Pokemon Basic Info**: Nama, ID, sprites
- **Pokemon Types**: Fire, Water, Grass, dll.
- **Official Artwork**: High-quality Pokemon images
- **Generation Data**: Pengelompokan Pokemon berdasarkan generasi

## 🎨 UI Components

- **Search Bar**: Input field untuk pencarian Pokemon dengan debounce 2 detik
- **Generation Selector**: Multi-select dropdown menggunakan Headless UI Listbox
- **Pokemon Cards**: Card layout dengan gradient background dan Pokemon artwork
- **Loading States**: Infinite scroll loading saat mencapai bottom
- **Navbar**: Navigation bar component
- **Responsive Grid**: Grid layout yang menyesuaikan dengan ukuran layar

## 📱 Responsive Design

Aplikasi ini fully responsive dengan breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

Untuk deploy ke production:

1. **Build aplikasi**

   ```bash
   npm run build
   ```

2. **Deploy ke platform pilihan**
   - Vercel
   - Netlify
   - Firebase Hosting
   - GitHub Pages

## 🤝 Contributing

1. Fork project ini
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 📄 License

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk detail.

## 👨‍💻 Author

**Fadhlan Khusnaini Al Barid**

- GitHub: [@fadhlankhusnaini](https://github.com/fadhlankhusnaini)
- Project: FERN-P1-S1GP01

## 🙏 Acknowledgments

- [PokeAPI](https://pokeapi.co/) untuk menyediakan data Pokemon
- [React](https://reactjs.org/) team untuk framework yang amazing
- [Tailwind CSS](https://tailwindcss.com/) untuk utility-first CSS framework
- [Vite](https://vitejs.dev/) untuk build tool yang super cepat

---

⭐ Jangan lupa untuk memberikan star jika project ini membantu Anda!
