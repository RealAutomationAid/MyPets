# MyPets Ragdoll - Premium Ragdoll Cat Breeding Website

A modern, responsive website for showcasing and managing a premium Ragdoll cat breeding business, featuring interactive galleries, admin management, and real-time content updates.

## 🌟 Features

- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS v4.0
- **Interactive Gallery**: Animated carousel with hover effects and smooth transitions
- **Admin Dashboard**: Complete management system for cats, news, and media
- **Real-time Database**: Powered by Convex for instant updates
- **Multi-language Support**: Bulgarian and English language options
- **SEO Optimized**: Meta tags, structured data, and performance optimizations
- **Responsive Design**: Mobile-first approach with modern animations

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4.0, shadcn/ui components
- **Database**: Convex (real-time database)
- **Animations**: Framer Motion
- **State Management**: React Hooks + Convex subscriptions
- **Build Tool**: Vite
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- Convex account for database functionality

## 🛠️ Local Development

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd MyPets
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Convex database**
```bash
# Install Convex CLI globally
npm install -g convex

# Initialize Convex (follow the prompts)
npx convex dev
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🌐 Deployment to Vercel

### Automatic Deployment (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Import your repository in [Vercel Dashboard](https://vercel.com/dashboard)
   - Vercel will automatically detect it's a Vite project

2. **Configure Environment Variables**
   Add these environment variables in Vercel dashboard:
   ```
   VITE_CONVEX_URL=<your_convex_deployment_url>
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your site will be available at `https://your-project.vercel.app`

### Manual Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
vercel --prod
```

## 🗄️ Convex Database Configuration for Vercel

Your Convex database will work seamlessly with Vercel deployment. Follow these steps:

1. **Convex Production Setup**
```bash
# Deploy your Convex functions to production
npx convex deploy --prod
```

2. **Update Environment Variables**
   - In your Vercel dashboard, add the production Convex URL to `VITE_CONVEX_URL`
   - The URL format is: `https://your-convex-deployment.convex.cloud`

3. **Verify Deployment**
   - Your Convex functions will automatically work with your Vercel deployment
   - No additional configuration needed for database connectivity

## 📁 Project Structure

```
MyPets/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── admin/          # Admin dashboard components
│   │   └── ...
│   ├── pages/              # Page components
│   ├── services/           # API and database services
│   ├── hooks/              # Custom React hooks
│   ├── data/               # Static data and fallbacks
│   └── assets/             # Images and static files
├── convex/                 # Convex database functions
├── public/                 # Static public files
└── vercel.json            # Vercel configuration
```

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration with SPA routing
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `convex/schema.ts` - Database schema definitions

## 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

## 🎨 Customization

The website is built with a modular component structure. Key areas for customization:

- **Colors & Themes**: Modify `tailwind.config.ts`
- **Database Schema**: Update `convex/schema.ts`
- **Content**: Edit language files and fallback data
- **Components**: Customize in `src/components/`

## 📱 Responsive Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🔒 Admin Features

Access the admin dashboard at `/admin` with:
- Cat management (add, edit, delete)
- News article management
- Image gallery management
- TikTok video management
- SEO settings
- Social media configuration

## 📈 Performance Optimizations

- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Code Splitting**: Route-based code splitting with React.lazy
- **Caching**: Vercel Edge caching for static assets
- **Database**: Real-time subscriptions with Convex

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For deployment issues or questions:
- Check the [Vercel documentation](https://vercel.com/docs)
- Review [Convex documentation](https://docs.convex.dev)
- Create an issue in this repository
