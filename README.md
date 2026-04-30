<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <strong>Bliss Shipping Backend</strong>

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Bliss Shipping is a modern logistics platform that connects customers, drivers, and dispatchers for seamless package delivery and tracking. This backend provides RESTful APIs for order management, real-time tracking, driver assignment, and vehicle management.

## Project Setup

```bash
# Install dependencies
$ npm install
```

## Compile and run the project

```bash
# Development mode
$ npm run start

# Production mode
$ npm run start:prod
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/bliss-shipping

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=4005

# File Upload
BASE_URL=http://localhost:4005
DEFAULT_PROFILE=/images/default-avatar.png
```

## Project Structure

```bash
src/
├── modules/
│   ├── auth/
│   ├── driver/
│   │   ├── dto/
│   │   ├── controller.ts
│   │   └── service.ts
│   └── user/
│       ├── dto/
│       └── service.ts
├── common/
│   ├── constants/
│   ├── enums/
│   └── helpers/
├── utils/
│   └── helpers/
└── uploads/
    ├── profile/
    ├── pod/
    └── failed/
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.




## Support

This project is MIT licensed.
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
