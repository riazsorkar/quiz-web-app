# Docker Setup Guide for QuizMaster

This guide explains how to run the QuizMaster application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### 1. Build and Run All Services

From the `quiz-web-app` directory:

```bash
docker-compose up --build
```

This will:
- Build the backend Spring Boot application
- Build the frontend Next.js application
- Start PostgreSQL database
- Connect all services together

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **PostgreSQL**: localhost:5432

### 3. Default Credentials

After the backend starts, these test accounts are automatically seeded:

**Student Account:**
- Email: `test@quiz.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@quiz.com`
- Password: `admin123`

## Docker Commands

### Start Services (detached mode)
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ deletes database data)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild Services
```bash
# Rebuild all
docker-compose up --build

# Rebuild specific service
docker-compose up --build backend
```

### Restart a Service
```bash
docker-compose restart backend
```

## Individual Service Commands

### Run Backend Only
```bash
cd backend
docker build -t quiz-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/quiz_app \
  quiz-backend
```

### Run Frontend Only
```bash
cd frontend
docker build -t quiz-frontend .
docker run -p 3000:3000 quiz-frontend
```

## Troubleshooting

### Backend Can't Connect to Database
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check logs: `docker-compose logs postgres`
- Wait for database to be ready (healthcheck runs every 10s)

### Frontend Can't Connect to Backend
- Verify backend is running: `docker-compose logs backend`
- Check if port 8080 is accessible: `curl http://localhost:8080/api/auth/login`

### Port Already in Use
If ports 3000, 8080, or 5432 are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change host port
```

### Clear Everything and Start Fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Production Considerations

### Environment Variables
Create a `.env` file for production:

```env
POSTGRES_PASSWORD=strong_password_here
SPRING_DATASOURCE_PASSWORD=strong_password_here
JWT_SECRET=your_secure_jwt_secret_here
```

### Database Persistence
The PostgreSQL data is stored in a Docker volume `postgres_data`. To backup:

```bash
docker exec quiz-postgres pg_dump -U postgres quiz_app > backup.sql
```

To restore:
```bash
docker exec -i quiz-postgres psql -U postgres quiz_app < backup.sql
```

### Change DDL Auto to Update
For production, modify backend environment in `docker-compose.yml`:

```yaml
environment:
  SPRING_JPA_HIBERNATE_DDL_AUTO: update  # Instead of create-drop
```

## Architecture

```
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │
│  Port: 3000     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Backend        │─────▶│  PostgreSQL  │
│  (Spring Boot)  │      │  Port: 5432  │
│  Port: 8080     │      └──────────────┘
└─────────────────┘

All services connected via quiz-network
```

## Next Steps

1. Access the application at http://localhost:3000
2. Log in with test credentials
3. Explore quizzes, take tests, and view the dashboard
4. Log in as admin to manage quizzes and users

## Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Check resource usage
docker stats

# Enter a container shell
docker exec -it quiz-backend sh
docker exec -it quiz-postgres psql -U postgres quiz_app

# Remove unused images
docker image prune -a
```
