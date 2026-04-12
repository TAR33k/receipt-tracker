<div align="center">
  <img width="100" height="100" alt="logo" src="https://github.com/user-attachments/assets/8664219b-349d-45f5-8160-58c4ff8c019e" />

  <h1>
    <font color="#5E6AD2" style="font-weight: bold;">Receipt</font><font color="#EDEDEF" style="font-weight: bold;">Tracker</font>
    <br>
    <font size="5">AI-Powered Receipt Processing & Analytics</font>
  </h1>

A modern, cloud-native solution for intelligent receipt management with real-time analytics and multi-currency support.

  <p>
    <img alt="Backend" src="https://img.shields.io/badge/Backend-.NET%208-blueviolet.svg?style=for-the-badge&logo=dotnet"/>
    <img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%2019-blue.svg?style=for-the-badge&logo=react"/>
    <img alt="Database" src="https://img.shields.io/badge/Database-SQL%20Server-red.svg?style=for-the-badge&logo=microsoftsqlserver"/>
    <img alt="Cloud" src="https://img.shields.io/badge/Cloud-Azure-0078D4.svg?style=for-the-badge&logo=microsoftazure"/>
    <img alt="Auth" src="https://img.shields.io/badge/Auth-Clerk-6C47FF.svg?style=for-the-badge"/>
  </p>

  <p>
    <a href="https://streceipts2727.z1.web.core.windows.net">https://streceipts2727.z1.web.core.windows.net</a>
  </p>

</div>

---

## About ReceiptTracker

**ReceiptTracker** is a comprehensive receipt management platform that leverages **Azure Document Intelligence** for AI-powered OCR, enabling automatic extraction of merchant data and transaction details from receipt images. The platform provides a sophisticated analytics dashboard with interactive charts, spending trend analysis, and multi-currency support with automatic conversion.

### Key Capabilities

| Feature                 | Description                                                                     |
| ----------------------- | ------------------------------------------------------------------------------- |
| **Receipt Upload**      | Drag-and-drop image upload with Azure Blob Storage                              |
| **AI Processing**       | Azure Document Intelligence extracts merchant, date, total, items, and tax data |
| **Review System**       | Confidence-based flagging for manual review when extraction quality is low      |
| **Analytics Dashboard** | Spending trends, merchant breakdown, category distribution, time patterns       |
| **Currency Switching**  | Real-time currency conversion with cached exchange rates                        |

---

## System Architecture

The platform follows a clean, multi-layered .NET architecture with clear separation of concerns.

- `ReceiptTracker.Api`: **ASP.NET Core Web API** serves as the entry point, handling HTTP requests, JWT authentication, and routing.
- `ReceiptTracker.Core`: Contains **domain entities**, **enums**, and **interface contracts** for services and repositories.
- `ReceiptTracker.Infrastructure`: Implements data access with **Entity Framework Core**, **Azure services** (Blob Storage, Document Intelligence), and business logic services including analytics calculations and currency conversion.
- `ReceiptTracker.Functions`: **Azure Functions** with **BlobTrigger** for asynchronous receipt processing, enabling scalable background OCR without blocking the API.
- `ReceiptTracker.Web`: **React 19** frontend with TypeScript, using TanStack Query for server state and Recharts for data visualization.

---

## Features

### AI-Powered Receipt Processing

- **Asynchronous Processing**: Azure Functions with BlobTrigger automatically process receipts in the background, enabling immediate API response while OCR runs independently
- **Quarantine to Processed Workflow**: Uploaded images stored in `receipts-quarantine`, automatically moved to `receipts-processed` after successful analysis
- **Azure Document Intelligence** integration for automatic OCR
- Extracts merchant name, transaction date/time, total amount, currency, line items
- Tax detail extraction with multiple tax rate support
- Merchant address parsing (street, city, postal code, country)
- **Confidence scoring** with 80% threshold for automatic flagging of low-quality extractions
- Manual review workflow for receipts requiring verification

### Analytics Dashboard

- **Spending Overview**: Current month vs previous month with percent change
- **12-Month Trends**: Interactive area chart with projection for current partial month
- **Top Merchants**: Bar chart showing top 5 merchants by spending
- **Category Breakdown**: Pie chart distribution with automatic category detection
- **Time Distribution**: Day-of-week and hour-of-day spending patterns
- **Quick Stats**: Total receipts, monthly activity, unique merchants, average confidence

### Currency System

- **Live exchange rates** from ExchangeRate-API
- **Multi-currency display** on both Dashboard and Analytics pages

### Security

- **Clerk authentication** with JWT token validation
- **Role-based access** via user-scoped data queries

---

## Tech Stack

### Backend

| Technology                              | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| **.NET 8**                              | Core framework with ASP.NET Core Web API             |
| **Azure Functions (Isolated Worker)**   | Background receipt processing via BlobTrigger        |
| **Entity Framework Core 8**             | ORM with SQL Server provider                         |
| **Azure.AI.DocumentIntelligence**       | OCR and receipt data extraction                      |
| **Azure.Storage.Blobs**                 | Image storage in quarantine and processed containers |
| **Microsoft.IdentityModel.Tokens**      | JWT token validation for Clerk auth                  |
| **Microsoft.Extensions.Caching.Memory** | In-memory caching for exchange rates and analytics   |

### Frontend

| Technology                       | Purpose                              |
| -------------------------------- | ------------------------------------ |
| **React 19**                     | UI framework with hooks              |
| **TypeScript**                   | Type-safe development                |
| **TanStack Query (React Query)** | Server state management with caching |
| **React Router**                 | Client-side routing                  |
| **Tailwind CSS**                 | Utility-first styling                |
| **shadcn/ui**                    | Accessible headless UI components    |
| **Recharts**                     | Interactive data visualization       |
| **Framer Motion**                | Page and component animations        |
| **Clerk React**                  | Authentication components            |
| **Lucide React**                 | Icon library                         |

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool                                                                                     | Purpose                                      |
| ---------------------------------------------------------------------------------------- | -------------------------------------------- |
| **[.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)**                       | To build and run the backend API             |
| **[Node.js 18+](https://nodejs.org/)**                                                   | For frontend development and build tools     |
| **[SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)**        | Local or remote database instance            |
| **[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)**            | Optional, for deployment                     |
| **[Azurite](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite)** | Local Azure Storage emulator for development |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/TAR33k/receipt-tracker.git
cd receipt-tracker
```

### 2. Backend Setup

```bash
# Navigate to API project
cd src/ReceiptTracker.Api

# Initialize user secrets
dotnet user-secrets init

# Configure connection strings and API keys
dotnet user-secrets set "ConnectionStrings:SqlConnection" "Server=localhost;Database=ReceiptTracker;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "Azure:StorageConnectionString" "UseDevelopmentStorage=true"
dotnet user-secrets set "Azure:DocumentIntelligence:Endpoint" "https://your-resource.cognitiveservices.azure.com"
dotnet user-secrets set "Azure:DocumentIntelligence:Key" "your-key-here"
dotnet user-secrets set "Clerk:Authority" "https://your-domain.clerk.accounts.dev"
dotnet user-secrets set "AllowedOrigins:StaticWebApp" "https://your-static-web-app.azurestaticapps.net"

# Apply database migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at `http://localhost:5000` with Swagger UI at `/swagger`.

### 3. Frontend Setup

```bash
# Navigate to web project
cd src/ReceiptTracker.Web

# Install dependencies
npm install

# Create environment file
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here" > .env.local
echo "VITE_API_URL=http://localhost:5000" >> .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 4. Local Azure Storage (Azurite)

```bash
# Install Azurite globally (if not already installed)
npm install -g azurite

# Start Azurite emulator
azurite --silent --location ./azurite-data --debug ./azurite-debug.log --skipApiVersionCheck

# Verify containers (in separate terminal)
az storage blob list --container-name receipts-quarantine --connection-string "UseDevelopmentStorage=true" --output table
az storage blob list --container-name receipts-processed --connection-string "UseDevelopmentStorage=true" --output table
```

---

## Development

### Useful Commands

```bash
# Run unit tests
dotnet test tests/ReceiptTracker.UnitTests/ReceiptTracker.UnitTests.csproj --verbosity normal

# Run integration tests
dotnet test tests/ReceiptTracker.IntegrationTests/ReceiptTracker.IntegrationTests.csproj

# Format backend code
dotnet format

# Format frontend code
cd src/ReceiptTracker.Web && npm run format

# Lint frontend
cd src/ReceiptTracker.Web && npm run lint

# Build
dotnet build
cd src/ReceiptTracker.Web && npm run build
```

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
