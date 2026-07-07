# BookiVoice 📚 🎙️

> Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.  
> 將您的書籍轉化為互動式 AI 語音對話。用聽的方式探索、學習並與 AI 討論您的愛書。

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.1-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)

---

## 🌐 語言選擇 / Language Navigation

- [🇹🇼 繁體中文 (Traditional Chinese)](#-繁體中文-traditional-chinese)
- [🇺🇸 English](#-english)

---

<br />

# 🇹🇼 繁體中文 (Traditional Chinese)

## 📖 關於 BookiVoice

**BookiVoice** 是一個基於 **Next.js 16 (App Router)** 與 **React 19** 打造的現代化 AI 閱讀與語音互動平台。傳統的閱讀方式往往單向且靜態，而 BookiVoice 讓使用者能夠輕鬆上傳 PDF 書籍，透過內建的智能解析引擎自動切割段落並生成封面，再搭配多樣化的 AI 語音角色（Persona），讓讀者能直接用「語音對話」的方式與書籍內容交談、探討重點與發問，打造身臨其境的沉浸式學習體驗。

---

## ✨ 核心功能

- 📄 **智能 PDF 瀏覽器端解析**
  - 整合 `pdfjs-dist`，在使用者上傳 PDF 時直接於前端快速解析全文內容。
  - **自動封面生成**：若無手動上傳封面，系統會自動渲染 PDF 第一頁作為高品質預設封面。
- 🎙️ **互動式 AI 語音對話 (Voice Chat)**
  - 提供多種個性化的 AI 語音角色（如英式沉穩的 Daniel、美式清晰的 Rachel、輕鬆對話的 Dave 等）。
  - 在專屬閱讀室中與書本直接對話，支援即時對話紀錄與播放狀態追蹤。
- ⚡ **智慧文本分段演算法 (Smart Chunking)**
  - 內建分段演算法將長篇書籍自動切分為每段約 500 字的 `TextSegment`，並保留 50 字前後重疊區間（Overlap），確保 AI 理解上下文不斷層。
- 🔒 **企業級認證與高可靠儲存**
  - 結合 **Clerk** 進行無縫且安全的會員登入與權限管理。
  - 檔案與圖片媒體皆託管於 **Vercel Blob**，提供極速的內容分發與下載。
- 🎨 **現代化流暢視覺與微動畫**
  - 採用 **Tailwind CSS v4** 與 **Radix UI** 構建質感復古圖書館（Vintage Library）美學。
  - 搭配 **GSAP (GreenSock)** 打造精緻順滑的頁面轉場、滾動視差與介面互動動畫。

---

## 🛠️ 技術架構 (Tech Stack)

| 類別 | 技術與工具 |
| :--- | :--- |
| **核心框架** | Next.js 16.2 (App Router), React 19.2, TypeScript |
| **樣式與 UI** | Tailwind CSS v4, Radix UI, Lucide React, clsx, tailwind-merge |
| **動畫引擎** | GSAP 3 (ScrollTrigger), `@gsap/react`, tw-animate-css |
| **資料庫與 ORM** | MongoDB, Mongoose (自訂連線池暫存優化) |
| **身份驗證** | Clerk (`@clerk/nextjs`) |
| **雲端儲存** | Vercel Blob Client (`@vercel/blob`) |
| **文件解析** | PDF.js (`pdfjs-dist`) |
| **表單與驗證** | React Hook Form, Zod, Sonner (Toast 提示) |

---

## 📁 專案目錄結構

```text
bookiVoice/
├── app/                  # Next.js App Router 路由定義
│   ├── (root)/           # 主要頁面群組 (首頁、新增書籍等)
│   ├── api/              # 後端 API Endpoints (如 /api/upload 檔案上傳驗證)
│   ├── books/            # 書籍詳情與語音互動頁面 (/books/[slug])
│   ├── globals.css       # 全域樣式與 Tailwind CSS 設定
│   └── layout.tsx        # 應用程式根佈局 (配置 Clerk Provider 等)
├── components/           # 共用 React 元件
│   ├── BookCard.tsx      # 書籍卡片元件
│   ├── BookDetailsPage   # 書籍閱讀與語音對話專屬介面
│   ├── Hero.tsx          # 首頁視覺橫幅與三步驟介紹
│   ├── Navbar.tsx        # 頂部導覽列與用戶登入狀態模組
│   ├── UploadForm.tsx    # PDF 上傳、語音選擇與表單驗證模組
│   └── ui/               # 基礎 UI 元件庫 (Input, Label 等)
├── database/             # 資料庫連線與 Mongoose Models
│   ├── mongoose.ts       # MongoDB 單例連線池管理
│   └── models/           # 資料表模型 (Book, BookSegment, VoiceSession)
├── lib/                  # 核心業務邏輯與工具函式
│   ├── actions/          # Next.js Server Actions (書籍 CRUD 操作)
│   ├── constant.ts       # 應用程式常數定義
│   ├── utils.ts          # PDF 解析 (`parsePDFFile`)、分段演算法與 Slug 生成
│   └── zod.ts            # 表單資料驗證 Schema
└── public/               # 靜態資源 (圖片、Logo、插圖)
```

---

## 🚀 快速開始 (Getting Started)

### 1. 環境需求
- **Node.js**: v20.0.0 或以上版本
- **套件管理工具**: npm / yarn / pnpm / bun
- **外部服務帳號**: MongoDB Atlas cluster、Clerk 帳號、Vercel 帳號 (用於 Blob 儲存)

### 2. 安裝相依套件

請先選定一個目錄並確認專案已下載至本地：

```bash
npm install
# 或使用 yarn / pnpm / bun
pnpm install
```

### 3. 設定環境變數

在專案根目錄建立一隻 `.env.local` 檔案，並填入以下金鑰：

```env
# MongoDB 連線字串
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookivoice?retryWrites=true&w=majority"

# Clerk 認證服務 API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Vercel Blob 雲端儲存 Token
bookvoice_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 4. 啟動開發伺服器

執行以下指令啟動開發環境：

```bash
npm run dev
```

開啟瀏覽器並前往 [http://localhost:3000](http://localhost:3000) 即可看到應用程式。

---

## 💡 使用流程

1. **登入/註冊**：點擊右上角的 Sign In 透過 Clerk 進行快速註冊或登入。
2. **上傳書籍**：點擊首頁「Add new book」，選擇您的 PDF 檔案並填入書名與作者。
3. **選擇語音**：在表單下方從「Male Voices」或「Female Voices」挑選適合該書本氣質的 AI 語音。
4. **自動解析與建立**：點擊「Begin Synthesis」，系統將自動擷取 PDF 封面、切分文本段落並寫入資料庫。
5. **語音對話互動**：進入書籍專頁，點擊右下方的麥克風圖示按鈕，開始享受與書籍的即時 AI 語音問答！

---
<br />

# 🇺🇸 English

## 📖 About BookiVoice

**BookiVoice** is an advanced web application built with **Next.js 16 (App Router)** and **React 19** that transforms traditional static reading into interactive, voice-driven AI conversations. By effortlessly uploading any PDF book, readers can leverage our built-in intelligent PDF parser to automatically extract text segments and generate cover images. Paired with distinct AI voice personas, BookiVoice allows you to listen, learn, and actively debate or question your favorite reads through real-time voice chat.

---

## ✨ Key Features

- 📄 **Intelligent Client-Side PDF Processing**
  - Powered by `pdfjs-dist`, PDFs are rapidly parsed and processed directly within the user's browser.
  - **Automatic Cover Generation**: If no custom cover image is provided, the system automatically renders the first page of the PDF as a high-resolution cover preview.
- 🎙️ **Interactive AI Voice Conversations**
  - Choose from a curated selection of AI voice personas (e.g., Daniel's authoritative British tone, Dave's casual Essex vibe, or Rachel's calm American clarity).
  - Engage in seamless voice dialogues with your book inside a dedicated interactive listening room.
- ⚡ **Context-Aware Text Chunking**
  - Implements an optimized text segmentation algorithm that slices book text into ~500-word segments (`TextSegment`) with a 50-word overlap, ensuring continuity and accurate AI context retrieval.
- 🔒 **Enterprise-Grade Security & Storage**
  - Integrated with **Clerk** for robust, hassle-free user authentication and session management.
  - Leverages **Vercel Blob** for high-speed, scalable cloud storage of book PDFs and image assets.
- 🎨 **Fluid & Premium Aesthetics**
  - Designed with **Tailwind CSS v4** and **Radix UI**, delivering a rich, vintage library aesthetic with modern glassmorphism touches.
  - Enhanced with **GSAP (GreenSock)** for smooth timeline animations, parallax effects, and responsive micro-interactions.

---

## 🛠️ Tech Stack

| Category | Technologies & Tools |
| :--- | :--- |
| **Core Framework** | Next.js 16.2 (App Router), React 19.2, TypeScript |
| **Styling & UI** | Tailwind CSS v4, Radix UI, Lucide React, clsx, tailwind-merge |
| **Animations** | GSAP 3 (ScrollTrigger), `@gsap/react`, tw-animate-css |
| **Database & ORM** | MongoDB, Mongoose (with optimized singleton connection caching) |
| **Authentication** | Clerk (`@clerk/nextjs`) |
| **Cloud Storage** | Vercel Blob Client (`@vercel/blob`) |
| **File Parsing** | PDF.js (`pdfjs-dist`) |
| **Forms & Validation** | React Hook Form, Zod, Sonner (Toast notifications) |

---

## 📁 Project Structure

```text
bookiVoice/
├── app/                  # Next.js App Router definitions
│   ├── (root)/           # Main route group (Home, Add Book, etc.)
│   ├── api/              # API Endpoints (e.g., /api/upload for Vercel Blob tokens)
│   ├── books/            # Book details and voice chat interface (/books/[slug])
│   ├── globals.css       # Global styles and Tailwind CSS imports
│   └── layout.tsx        # Root application layout (Clerk Provider, Fonts, etc.)
├── components/           # Reusable React components
│   ├── BookCard.tsx      # Book display card with priority loading
│   ├── BookDetailsPage   # Dedicated reading & voice conversation view
│   ├── Hero.tsx          # Animated hero banner with 3-step feature guide
│   ├── Navbar.tsx        # Top navigation bar with Clerk user controls
│   ├── UploadForm.tsx    # PDF dropzone, persona selector & form handling
│   └── ui/               # Primitive UI components (Input, Label, etc.)
├── database/             # MongoDB connection & Mongoose Schemas
│   ├── mongoose.ts       # Singleton database connection manager
│   └── models/           # Schemas (Book, BookSegment, VoiceSession)
├── lib/                  # Core business logic and helper functions
│   ├── actions/          # Server Actions for Book CRUD and segmentation
│   ├── constant.ts       # Application constants and configuration
│   ├── utils.ts          # PDF parsing (`parsePDFFile`), chunking & slug generation
│   └── zod.ts            # Zod validation schemas
└── public/               # Static assets (images, logos, illustrations)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20.0.0 or higher
- **Package Manager**: npm / yarn / pnpm / bun
- **External Services**: MongoDB Atlas cluster, Clerk account, and Vercel Blob storage

### 2. Installation

Clone the repository and install the required dependencies:

```bash
npm install
# or using yarn / pnpm / bun
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and configure the following keys:

```env
# MongoDB Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookivoice?retryWrites=true&w=majority"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Vercel Blob Storage Read/Write Token
bookvoice_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 4. Run the Development Server

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 💡 Usage Workflow

1. **Sign In**: Click "Sign In" in the top navbar to authenticate via Clerk.
2. **Upload a Book**: Click "Add new book" on the home screen. Upload your PDF file and provide the title and author.
3. **Select a Voice Persona**: Choose an assistant voice from our curated male and female options that best matches the personality of your book.
4. **Process & Save**: Click "Begin Synthesis". The application will extract text segments, generate a cover preview, upload media to Vercel Blob, and store records in MongoDB.
5. **Start Voice Chat**: Navigate to your newly added book page and click the floating microphone button to start a real-time AI voice conversation with your book!

---

## 📝 License

This project is licensed under the MIT License.
