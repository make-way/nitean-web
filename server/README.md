# Server

This folder contains all the backend functionality for the KhmerCoders web application. It's organized into three main directories, each serving a specific purpose in our server-side architecture.

## 📁 Folder Structure

```text
server/
├── actions/      # Server Actions
├── cache/        # React Cache utilities
├── services/     # Business logic services
└── README.md     # This file
```

## 🚀 Actions

The `actions/` folder contains **Server Actions** - functions that run on the server and can be called directly from client components. These provide a seamless way to handle form submissions and server-side operations.

Server Actions allow us to:

- Handle form submissions without API routes
- Perform server-side validation
- Execute database operations securely
- Maintain type safety between client and server

## 🗄️ Cache

The `cache/` folder implements **React Cache** functionality for optimizing data fetching and reducing redundant requests.

React Cache helps us:

- Deduplicate identical requests
- Cache function results across component renders
- Improve application performance
- Reduce database load

## 🔧 Services

The `services/` folder contains business logic services that handle complex operations and integrations.

Services provide:

- Reusable business logic
- Third-party API integrations
- Complex data processing
- Shared utilities across actions and components

---

*This server architecture supports the KhmerCoders platform by providing a robust, scalable, and maintainable backend foundation.*