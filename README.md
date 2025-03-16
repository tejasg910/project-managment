# Project Management Application

A modern web application for managing projects, built with Next.js, Tailwind CSS, and Clerk authentication.

![Project Management Dashboard](https://prnt.sc/7KtoHFKmwfGp)

## Features

- **User Authentication**: Secure login and registration using Clerk
- **Project Management**: Create, read, update, and delete project entries
- **Data Persistence**: Local JSON file storage for project data
- **Responsive UI**: Mobile-friendly interface with Tailwind CSS
- **Search Functionality**: Filter projects by name, address, or city
- **Sorting Capabilities**: Sort project data by any column
- **Form Validation**: Client-side validation using Zod

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **UI Components**:
  - Headless UI (for modals and dropdowns)
  - TanStack Table (for data table with sorting)
- **Form Management**: React Hook Form with Zod validation
- **Data Storage**: Local JSON file

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tejasg910/project-managment.git
   cd project-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Clerk environment variables in a `.env.local` file:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Structure

```
project-management/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   │   └── projects/     # Project API endpoints
│   ├── dashboard/        # Dashboard page
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout
│   └── page.js           # Home/login page
├── components/           # React components
│   ├── Navbar.jsx        # Navigation bar
│   ├── ProjectForm.jsx   # Project form component
│   ├── ProjectList.jsx   # Project listing with search & sort
│   └── ProjectModal.jsx  # Modal for adding/editing projects
├── data/                 # Data storage
│   └── projects.json     # JSON file for project data
├── middleware.js         # Auth middleware
└── tailwind.config.js    # Tailwind configuration
```

## Usage

### Authentication

- The application uses Clerk for authentication
- Users must sign in to access the dashboard and manage projects
- The home page redirects to the dashboard if already signed in

### Managing Projects

- **View Projects**: All projects are displayed in a table on the dashboard
- **Search**: Use the search bar to filter projects by name, address, or city
- **Sort**: Click on column headers to sort projects
- **Add Project**: Click the "Add Project" button to create a new project
- **Edit Project**: Click "Edit" on any project row to modify its details
- **Delete Project**: Click "Delete" on any project row to remove it

### Search & Sort Functionality

- **Search**: The application provides real-time searching across all project fields
- **Multi-field Search**: The search function checks project name, address, and city
- **Case Insensitive**: Searches are case-insensitive for better user experience
- **Sorting**: Click on any column header to sort ascending/descending
- **Multiple Sorts**: Hold Shift while clicking column headers for multi-column sorting

## API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a specific project
- `PUT /api/projects/[id]` - Update a specific project
- `DELETE /api/projects/[id]` - Delete a specific project

## Customization

### Styling

- The application uses Tailwind CSS for styling
- The primary color scheme is white and green
- To modify the theme, edit the `globals.css` file

### Adding More Features

- **Additional Fields**: To add more fields to projects, update:
  1. The form schema in `ProjectModal.jsx`
  2. The table columns in `ProjectList.jsx`
  3. The API routes to handle the new fields

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk](https://clerk.dev/)
- [Headless UI](https://headlessui.dev/)
- [TanStack Table](https://tanstack.com/table/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
