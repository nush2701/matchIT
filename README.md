# matchIT - AI-Powered Outfit Recommender

A modern web application that uses AI to generate personalized outfit suggestions based on your existing wardrobe and occasion requirements.

## ✨ Features

- **AI-Powered Recommendations**: Get intelligent outfit suggestions based on your clothing items and occasion
- **Smart Search Integration**: Find similar items online with integrated search functionality
- **Modern UI/UX**: Beautiful, responsive design with glass morphism effects
- **Authentication**: Secure login with Google OAuth and email/password
- **Real-time Generation**: Instant outfit recommendations powered by OpenAI
- **Copy & Share**: Easy copying of suggestions to clipboard

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: OpenAI API
- **Styling**: Custom CSS with CSS variables and glass morphism effects

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/matchIT.git
   cd matchIT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/matchit"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
matchIT/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── generate/      # AI generation endpoint
│   │   └── search/        # Search functionality
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── InputForm.tsx      # Main input form
│   ├── OutputDisplay.tsx  # Results display
│   ├── navbar.tsx         # Navigation bar
│   └── ClientLayout.tsx   # Client-side layout
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── openai.ts         # OpenAI integration
│   └── prisma.ts         # Database client
└── prisma/               # Database schema and migrations
```

## 🎨 Design System

The application uses a custom design system with:
- **Color Palette**: Soft pastel colors with light/dark mode support
- **Glass Morphism**: Modern glass-like UI elements
- **Responsive Design**: Mobile-first approach
- **CSS Variables**: Dynamic theming support

## 🔧 API Endpoints

- `POST /api/generate` - Generate outfit suggestions
- `POST /api/search` - Search for similar items
- `POST /api/signup` - User registration
- `GET /api/auth/*` - Authentication routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [OpenAI](https://openai.com/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)

---

Made with ❤️ for fashion enthusiasts everywhere
