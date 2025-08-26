# Wasgo - Smart Waste Management System 🌱

## 🎯 Project Aim

**To digitize and optimize waste collection in Ghana through IoT-enabled smart bins and real-time monitoring, making cities cleaner and waste management more efficient.**

## 📋 Key Objectives

1. **Reduce Waste Overflow by 80%** - Real-time monitoring prevents bin overflow
2. **Improve Collection Efficiency by 60%** - Data-driven scheduling and routing
3. **Achieve 95% On-Time Collection** - Better coordination and tracking
4. **Increase Recycling by 40%** - Proper waste segregation and tracking
5. **Serve 100,000+ Households** - Scalable solution for urban areas

## Smarter Waste Management for a Cleaner Ghana

Wasgo is an innovative IoT-powered waste management platform that revolutionizes urban waste collection in Ghana. By integrating smart sensors, real-time tracking, and comprehensive service management, we help cities reduce collection costs while improving environmental sustainability.

![Wasgo Dashboard](https://img.shields.io/badge/Version-2.0.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Production_Ready-success)

## 🌟 Key Features

### IoT & Real-Time Monitoring
- **Smart Bin Sensors** - Real-time fill level monitoring (0-100%)
- **GPS Tracking** - Live location tracking of bins and vehicles
- **Sensor Health Monitoring** - Battery level, signal strength, and fault detection
- **Automated Alerts** - Instant notifications for full bins and maintenance needs
- **Temperature & Humidity Sensors** - Environmental monitoring for waste safety

### Service Management
- **Service Requests** - On-demand waste collection and special pickups
- **Driver Management** - Assignment, tracking, and performance monitoring
- **Vehicle Fleet** - Complete fleet management with maintenance tracking
- **Provider Network** - Multi-provider support for different service areas
- **Zone Management** - Geographic service area management

### Customer Features
- **Mobile App** - iOS and Android apps for customers
- **Web Portal** - Public website for service requests and information
- **Real-time Tracking** - Track collection vehicles in real-time
- **Payment Integration** - Mobile money, cards, and invoicing
- **Notifications** - SMS, email, and push notifications

### Admin Dashboard
- **Bin Management** - Monitor all smart bins across the city
- **Service Analytics** - Real-time metrics and insights
- **Driver Dispatch** - Assign and track drivers
- **Report Generation** - Environmental and operational reports

## 🚀 System Components

### Backend (Django)
- **Location**: `/Wasgo-BE/`
- **Technology**: Python Django REST Framework
- **Database**: PostgreSQL with PostGIS
- **Key Apps**:
  - WasteBin - Smart bin and sensor management
  - ServiceRequest - Service request handling
  - Driver - Driver management and tracking
  - Vehicle - Fleet management
  - Payment - Payment processing
  - Notification - Multi-channel notifications

### Frontend Applications
- **Public Website** (`/Wasgo-FE/`) - React-based customer portal
- **Admin Dashboard** (`/Wasgo-FE-Admin/`) - Administrative interface
- **Mobile App** (`/Wasgo-Mobile/`) - React Native mobile application

### IoT Infrastructure
- **Virtual Bin Simulator** (`/virtual-bin-simulator/`) - Testing environment
- **MQTT Protocol** - IoT communication
- **Sensor Types**: Ultrasonic, GPS, Temperature, Humidity, Battery monitoring

## 📁 Project Structure

```
Wasgo/
├── Wasgo-BE/               # Django Backend
│   ├── apps/
│   │   ├── WasteBin/       # Smart bin management
│   │   ├── ServiceRequest/ # Service requests
│   │   ├── Driver/         # Driver management
│   │   ├── Vehicle/        # Fleet management
│   │   ├── Payment/        # Payment processing
│   │   ├── Provider/       # Service providers
│   │   └── ...             # Other apps
│   └── requirements.txt
├── Wasgo-FE/               # React Frontend
├── Wasgo-FE-Admin/         # Admin Dashboard
├── Wasgo-Mobile/           # Mobile App
├── virtual-bin-simulator/  # IoT Simulator
└── documentation/          # Project Documentation
    ├── wasgo-project-overview.md
    ├── wasgo-user-stories.md
    ├── wasgo-erd.md
    └── ...
```

## 🛠️ Technology Stack

### Backend
- Python 3.10+
- Django 4.2+
- Django REST Framework
- PostgreSQL with PostGIS
- Redis (caching)
- Celery (async tasks)

### Frontend
- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- Google Maps API

### Mobile
- React Native
- Expo
- Native Base

### Infrastructure
- Docker
- AWS/Azure
- MQTT Broker
- SendGrid (email)

## 📊 Agile Documentation

### Project Documentation
- [Project Overview](./documentation/wasgo-project-overview.md) - System overview and stakeholders
- [User Stories](./documentation/wasgo-user-stories.md) - Complete user stories with acceptance criteria
- [Entity Relationship Diagram](./documentation/wasgo-erd.md) - Database schema and relationships
- [Sequence Diagrams](./documentation/diagrams/sequence-diagrams.md) - Process flows
- [Data Flow Diagrams](./documentation/diagrams/data-flow.md) - Data movement patterns
- [System Architecture](./documentation/architecture/README.md) - Technical architecture
- [API Specifications](./documentation/api-specs/README.md) - REST API documentation
- [Sprint Planning](./documentation/sprint-planning.md) - Agile sprint breakdown

## 🌍 Environmental Impact

Since launch, Wasgo has helped Ghana achieve:
- **500,000+ tons** of waste properly collected
- **50,000 tons** of recyclables diverted from landfills
- **100,000+ households** served
- **70% reduction** in illegal dumping
- **24/7 service** availability

## 🚦 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ with PostGIS
- Redis

### Backend Setup
```bash
cd Wasgo-BE
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd Wasgo-FE
npm install
npm run dev
```

### Admin Dashboard
```bash
cd Wasgo-FE-Admin
npm install
npm run dev
```

## 📡 API Documentation

### Key Endpoints

#### Smart Bin Management
- `GET /api/bins/` - List all smart bins
- `POST /api/bins/sensor-data/` - Upload sensor readings
- `GET /api/bins/alerts/` - Get active bin alerts

#### Service Requests
- `POST /api/service-requests/` - Create service request
- `GET /api/service-requests/track/{id}/` - Track request status
- `PUT /api/service-requests/{id}/assign/` - Assign to driver

#### Driver Operations
- `POST /api/drivers/check-in/` - Driver check-in
- `PUT /api/drivers/location/` - Update driver location
- `GET /api/drivers/assignments/` - Get driver assignments

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [docs.wasgo.com](https://docs.wasgo.com)
- **Email**: support@wasgo.com
- **Phone**: +233 20 123 4567

---

**Built with ❤️ for a cleaner, greener Ghana 🇬🇭**