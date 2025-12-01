# Project Architecture

## Overview

This project follows **Clean Architecture** principles with a clear separation of concerns.

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│             Presentation Layer              │
│  (Screens, Components, Navigation)          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│            Business Logic Layer             │
│     (Services, Hooks, Store/State)          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│              Data Layer                     │
│    (API, Storage, External Services)        │
└─────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── api/              # External API integrations
│   └── huggingface/  # AI model API
├── assets/           # Static resources
├── components/       # React components
│   ├── common/       # Reusable UI components
│   └── features/     # Feature-specific components
├── config/           # Configuration files
├── constants/        # App-wide constants
├── hooks/            # Custom React hooks
├── models/           # TypeScript interfaces/types
├── navigation/       # React Navigation setup
├── screens/          # Screen components
├── services/         # Business logic services
├── store/            # Redux state management
│   └── slices/       # Redux slices
├── theme/            # Theming and styling
└── utils/            # Helper functions
```

## Key Principles

### 1. Separation of Concerns
- **Screens**: Only UI composition and navigation
- **Components**: Reusable, pure presentation
- **Hooks**: State and side effect management
- **Services**: Business logic and external integrations
- **Store**: Global state management

### 2. Data Flow

```
User Interaction → Screen → Hook/Service → API/Storage
                     ↓
                  Redux Store
                     ↓
                Components Update
```

### 3. State Management

- **Local State**: React useState for component-specific state
- **Global State**: Redux Toolkit for app-wide state
- **Server State**: RTK Query for API data caching
- **Persistent State**: AsyncStorage for offline data

### 4. Type Safety

- Full TypeScript coverage
- Strict type checking enabled
- Interface definitions in `/models`

## Feature Module Example

```typescript
Feature: Sentiment Analysis
├── Screen: HomeScreen
├── Components: SentimentCard, InputField
├── Hook: useAnalysis
├── Service: aiService
├── Store Slice: analysisSlice
├── API: huggingface/sentimentAPI
└── Models: Analysis, Sentiment
```

## Best Practices

1. **Keep components pure and reusable**
2. **Extract business logic into hooks and services**
3. **Use TypeScript interfaces for all data structures**
4. **Implement error boundaries for error handling**
5. **Follow single responsibility principle**
6. **Write self-documenting code with clear naming**

## Technology Stack

- **Framework**: React Native 0.82.1
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **AI Integration**: Hugging Face API
- **Code Quality**: ESLint, Prettier
