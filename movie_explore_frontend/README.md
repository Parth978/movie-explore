# Movie Plex - Movie Explorer Frontend

A modern React application for exploring movies, actors, and directors. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** - Version 20.19.0+ or 22.12.0+ recommended
- **npm** - Comes with Node.js

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie_explore_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (optional):

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

If not set, the app defaults to `http://127.0.0.1:8000/api/v1`.

### 4. Start the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (default Vite port).

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open Vitest UI for interactive testing |

## 🧪 Running Tests

### Run All Tests Once

```bash
npm run test:run
```

### Run Tests in Watch Mode

```bash
npm run test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Tests with Visual UI

```bash
npm run test:ui
```

## 🏗️ Building for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
movie_explore_frontend/
├── public/              # Static assets
├── src/
│   ├── api/             # API client configuration
│   │   └── client.ts
│   ├── assets/          # Images and other assets
│   ├── components/      # Reusable UI components
│   │   ├── FilterBar.tsx
│   │   ├── Header.tsx
│   │   ├── MovieCard.tsx
│   │   └── SearchBar.tsx
│   ├── page/            # Page components
│   │   ├── Home.tsx
│   │   ├── MovieDetails.tsx
│   │   └── Profile.tsx
│   ├── test/            # Test utilities and mocks
│   │   ├── mocks/
│   │   ├── utils/
│   │   └── setup.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Application entry point
│   └── types.ts         # TypeScript type definitions
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Vitest** - Testing framework
- **React Testing Library** - Component testing utilities

## 🔗 API Requirements

This frontend requires a backend API running at the configured `VITE_API_URL`. The API should provide the following endpoints:

- `GET /movies/` - List all movies (supports query params: `title`, `actor`, `director`, `genre`)
- `GET /movies/:id` - Get movie details
- `GET /genres/` - List all genres
- `GET /reviews/?movieId=:id` - Get reviews for a movie
- `GET /actors/:id` - Get actor details with filmography
- `GET /directors/:id` - Get director details with filmography

## � Docker

### Prerequisites

- **Docker** - Version 20.10+ recommended
- **Docker Compose** - Version 2.0+ (included with Docker Desktop)

### Build and Run with Docker Compose

```bash
# Build and start the container
docker compose up -d

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

The application will be available at `http://localhost:3000`.

### Build and Run with Docker CLI

```bash
# Build the image
docker build -t movie-plex-frontend .

# Run the container
docker run -d -p 3000:80 --name movie-plex movie-plex-frontend

# Stop and remove
docker stop movie-plex && docker rm movie-plex
```

### Environment Variables

Set the API URL when building:

```bash
# Using Docker Compose
VITE_API_URL=http://api.example.com/api/v1 docker compose up -d --build

# Using Docker CLI
docker build --build-arg VITE_API_URL=http://api.example.com/api/v1 -t movie-plex-frontend .
```

## �📝 License

This project is private and not licensed for public use.
