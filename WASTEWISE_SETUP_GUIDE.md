# 🚀 Wasgo Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Mobile App Setup](#mobile-app-setup)
5. [Payment Gateway Configuration](#payment-gateway-configuration)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [WebSocket & Real-time Features](#websocket--real-time-features)
9. [Deployment](#deployment)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### System Requirements
- **Python**: 3.9+ 
- **Node.js**: 18+ 
- **PostgreSQL**: 14+ with PostGIS extension
- **Redis**: 7+
- **Flutter**: 3.10+
- **Docker**: 20+ (optional)
- **Git**: 2.30+

### Required Accounts & API Keys
- [ ] Google Cloud Platform (for Maps API)
- [ ] Firebase (for push notifications)
- [ ] SendGrid (for emails)
- [ ] Twilio/Africa's Talking (for SMS)
- [ ] MTN MoMo Developer Account
- [ ] Vodafone Cash API Access
- [ ] AirtelTigo Money API Access
- [ ] Paystack Account
- [ ] Sentry (for error tracking)
- [ ] AWS S3 or Cloudinary (for file storage)

---

## 🖥️ Backend Setup

### 1. Clone and Navigate
```bash
cd /workspace/Wasgo-BE
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create Requirements File (if not exists)
Create `requirements.txt`:
```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.0
django-environ==0.11.2
psycopg2-binary==2.9.9
django.contrib.gis==4.2.7
channels==4.0.0
channels-redis==4.1.0
daphne==4.0.0
celery==5.3.4
redis==5.0.1
Pillow==10.1.0
django-storages==1.14.2
boto3==1.29.7
sendgrid==6.11.0
twilio==8.10.0
stripe==7.5.0
django-allauth==0.57.0
djangorestframework-simplejwt==5.3.0
django-filter==23.4
drf-yasg==1.21.7
gunicorn==21.2.0
whitenoise==6.6.0
django-celery-beat==2.5.0
django-redis==5.4.0
python-decouple==3.8
requests==2.31.0
geopy==2.4.0
shapely==2.0.2
django-extensions==3.2.3
pytest==7.4.3
pytest-django==4.7.0
factory-boy==3.3.0
faker==20.1.0
coverage==7.3.2
black==23.11.0
flake8==6.1.0
pre-commit==3.5.0
```

### 5. PostgreSQL with PostGIS Setup
```bash
# Install PostgreSQL and PostGIS
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib postgis

# Access PostgreSQL
sudo -u postgres psql

# Create database and enable PostGIS
CREATE DATABASE Wasgo;
CREATE USER Wasgo_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE Wasgo TO Wasgo_user;
\c Wasgo
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
\q
```

### 6. Redis Installation
```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping  # Should return PONG
```

### 7. Environment Configuration
Create `.env` file in `/workspace/Wasgo-BE/`:
```env
# Django Settings
DJANGO_SECRET_KEY=your-very-secure-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,Wasgo.com

# Database
DB_NAME=Wasgo
DB_USER=Wasgo_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=noreply@Wasgo.com

# Payment Gateways
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx

# MTN MoMo
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_API_KEY=your-mtn-api-key
MTN_MOMO_USER_ID=your-mtn-user-id
MTN_MOMO_API_SECRET=your-mtn-api-secret

# Vodafone Cash
VODAFONE_CASH_API_URL=https://api.vodafonecash.com.gh
VODAFONE_CASH_API_KEY=your-vodafone-api-key

# AirtelTigo
AIRTELTIGO_API_URL=https://api.airteltigo.com.gh
AIRTELTIGO_API_KEY=your-airteltigo-api-key

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=Wasgo-uploads
AWS_S3_REGION_NAME=us-east-1

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Sentry
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Admin
ADMIN_EMAIL=admin@Wasgo.com
```

### 8. Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 9. Load Sample Data
```bash
python manage.py populate_wastebins --bins 100
```

### 10. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 11. Run Development Server
```bash
# Run Django server
python manage.py runserver

# In another terminal, run Celery worker
celery -A backend worker -l info

# In another terminal, run Celery beat
celery -A backend beat -l info

# In another terminal, run Daphne for WebSockets
daphne -b 0.0.0.0 -p 8001 backend.asgi:application
```

---

## 🌐 Frontend Setup (React)

### 1. Navigate to Frontend Directory
```bash
cd /workspace/Wasgo-FE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000/Wasgo/api/v1
REACT_APP_WS_URL=ws://localhost:8001/ws
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 📱 Mobile App Setup (Flutter)

### 1. Flutter Installation
```bash
# Download Flutter SDK
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

# Verify installation
flutter doctor
```

### 2. Navigate to Mobile App Directory
```bash
cd /workspace/Wasgo_mobile
```

### 3. Install Dependencies
```bash
flutter pub get
```

### 4. iOS Setup (Mac only)
```bash
cd ios
pod install
cd ..
```

### 5. Android Setup
- Install Android Studio
- Install Android SDK (API level 33+)
- Set up Android emulator or connect physical device

### 6. Configure Firebase
```bash
# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase
flutterfire configure
```

### 7. Create Configuration Files

Create `lib/config/app_config.dart`:
```dart
class AppConfig {
  static const String appName = 'Wasgo';
  static const String apiUrl = 'http://localhost:8000/Wasgo/api/v1';
  static const String wsUrl = 'ws://localhost:8001/ws';
  
  // Payment Keys
  static const String paystackPublicKey = 'pk_test_xxxxx';
  static const String mtnMomoApiUrl = 'https://sandbox.momodeveloper.mtn.com';
  static const String mtnMomoApiKey = 'your-mtn-api-key';
  static const String mtnMomoUserId = 'your-mtn-user-id';
  static const String mtnMomoApiSecret = 'your-mtn-api-secret';
  
  static const String vodafoneCashApiUrl = 'https://api.vodafonecash.com.gh';
  static const String vodafoneCashApiKey = 'your-vodafone-api-key';
  
  static const String airtelTigoApiUrl = 'https://api.airteltigo.com.gh';
  static const String airtelTigoApiKey = 'your-airteltigo-api-key';
  
  static const String environment = 'sandbox'; // or 'production'
}
```

### 8. Run the App
```bash
# Run on iOS simulator
flutter run -d ios

# Run on Android emulator
flutter run -d android

# Run on Chrome (web)
flutter run -d chrome
```

### 9. Build for Release
```bash
# Build Android APK
flutter build apk --release

# Build Android App Bundle
flutter build appbundle --release

# Build iOS
flutter build ios --release
```

---

## 💳 Payment Gateway Configuration

### MTN Mobile Money Setup

1. **Register at MTN Developer Portal**
   - Visit: https://momodeveloper.mtn.com
   - Create an account
   - Subscribe to Collections API

2. **Create API User**
```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
  -H "X-Reference-Id: YOUR_UUID" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
  -d '{"providerCallbackHost": "YOUR_CALLBACK_URL"}'
```

3. **Generate API Key**
```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/{UUID}/apikey \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

### Paystack Setup

1. **Create Paystack Account**
   - Visit: https://paystack.com
   - Sign up for a business account
   - Complete KYC verification

2. **Get API Keys**
   - Dashboard → Settings → API Keys
   - Copy Public and Secret keys

3. **Configure Webhooks**
   - Dashboard → Settings → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/paystack`

### Vodafone Cash Setup

1. **Contact Vodafone Business**
   - Email: business@vodafone.com.gh
   - Request API access for Vodafone Cash

2. **Integration Requirements**
   - Business registration documents
   - Tax identification number
   - Bank account details

---

## 🔌 WebSocket & Real-time Features

### 1. Configure Channels
In `backend/settings.py`:
```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

ASGI_APPLICATION = 'backend.asgi.application'
```

### 2. Create ASGI Configuration
Create `backend/asgi.py`:
```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.WasteProvider.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
```

### 3. Test WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:8001/ws/tracking/TEST123/');
ws.onmessage = (e) => console.log('Message:', e.data);
ws.send(JSON.stringify({type: 'location_update', location: {lat: 5.6037, lng: -0.1870}}));
```

---

## 🚀 Deployment

### Production Checklist

#### Security
- [ ] Change `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Configure CSP headers
- [ ] Enable rate limiting

#### Database
- [ ] Use connection pooling
- [ ] Set up regular backups
- [ ] Configure read replicas
- [ ] Optimize indexes

#### Performance
- [ ] Enable caching (Redis)
- [ ] Configure CDN for static files
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up monitoring

### Docker Deployment

1. **Build Images**
```bash
docker-compose build
```

2. **Run Containers**
```bash
docker-compose up -d
```

3. **View Logs**
```bash
docker-compose logs -f
```

### Cloud Deployment Options

#### AWS
```bash
# Install EB CLI
pip install awsebcli

# Initialize Elastic Beanstalk
eb init -p python-3.9 Wasgo

# Create environment
eb create Wasgo-prod

# Deploy
eb deploy
```

#### Google Cloud
```bash
# Install gcloud CLI
# Configure app.yaml
gcloud app deploy
```

#### Heroku
```bash
# Install Heroku CLI
heroku create Wasgo-app
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
git push heroku main
```

---

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=apps

# Run specific app tests
pytest apps/WasteBin/tests/

# Generate coverage report
coverage html
```

### Frontend Tests
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Mobile App Tests
```bash
# Run unit tests
flutter test

# Run integration tests
flutter test integration_test

# Run with coverage
flutter test --coverage
```

---

## 🔧 Troubleshooting

### Common Issues

#### PostgreSQL Connection Error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check PostGIS installation
psql -d Wasgo -c "SELECT PostGIS_version();"
```

#### Redis Connection Error
```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping

# Clear Redis cache
redis-cli FLUSHALL
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>
```

#### Migration Errors
```bash
# Reset migrations
python manage.py migrate --fake-zero
python manage.py migrate

# Create new migrations
python manage.py makemigrations --empty appname
```

#### Flutter Build Issues
```bash
# Clean build
flutter clean
flutter pub get
flutter build

# Reset iOS pods
cd ios
pod deintegrate
pod install
```

---

## 📞 Support & Resources

### Documentation
- Django: https://docs.djangoproject.com
- Flutter: https://flutter.dev/docs
- React: https://react.dev
- PostGIS: https://postgis.net/documentation

### Community
- GitHub Issues: https://github.com/Wasgo/issues
- Discord: https://discord.gg/Wasgo
- Stack Overflow: Tag with `Wasgo`

### Contact
- Email: support@Wasgo.com
- Phone: +233 XX XXX XXXX
- Twitter: @WasgoGH

---

## 🎉 Congratulations!

You've successfully set up the Wasgo platform! 

### Next Steps:
1. Configure payment gateways with production credentials
2. Set up monitoring and analytics
3. Configure automated backups
4. Implement CI/CD pipeline
5. Conduct security audit
6. Load test the system
7. Train the team
8. Launch! 🚀

---

*Built with ❤️ for a cleaner Ghana 🇬🇭*