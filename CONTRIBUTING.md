#  Contributing to AI Job Chommie Platform

Thank you for your interest in contributing to the AI Job Chommie Platform! This document provides guidelines and instructions for contributing to this world-class job search platform designed specifically for the South African market.

##  Mission Statement

Our mission is to empower every South African, especially entry-level job seekers, with AI-powered tools to find meaningful employment opportunities. Every contribution should align with this social impact goal.

##  Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Recognition](#recognition)

##  Code of Conduct

This project adheres to a code of conduct that fosters an inclusive and welcoming environment. By participating, you agree to:

- **Be respectful and inclusive** to all contributors regardless of background
- **Focus on constructive feedback** that helps improve the platform
- **Prioritize the mission** of helping South African job seekers
- **Maintain professional communication** in all interactions
- **Support accessibility** and inclusive design practices

##  Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** installed
- **Git** configured with your credentials  
- **Docker** (recommended for local development)
- **PostgreSQL** and **Redis** (or use Docker setup)
- **Basic knowledge** of TypeScript, React, and Node.js

### First-time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/aijobchommie-platform.git
   cd aijobchommie-platform
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/FernandoSteyn/aijobchommie-platform.git
   ```
4. **Run the setup script**:
   ```bash
   # On Unix/macOS
   ./scripts/dev-setup.sh
   
   # On Windows
   .\scripts\dev-setup.ps1
   ```

##  Development Setup

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development services
npm run docker:dev

# Start the development servers
npm run dev
```

### Workspace Structure

Our monorepo consists of:

```
packages/
├── api/       # Node.js API server
├── web/       # React SaaS application  
├── admin/     # Admin dashboard
└── shared/    # Shared utilities and types
```

### Available Scripts

```bash
npm run dev          # Start all development servers
npm run build        # Build all packages
npm run test         # Run all tests
npm run lint         # Lint all code
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

##  Contribution Guidelines

### Priority Areas

We especially welcome contributions in:

1. **Entry-level job features** - Improving search, filtering, and application processes
2. **Mobile experience** - Enhancing mobile-first design and performance
3. **Accessibility** - Making the platform usable for all South Africans
4. **Local language support** - Adding Afrikaans and indigenous language support
5. **AI improvements** - Better job matching and resume analysis
6. **Performance optimization** - Faster load times and better user experience

### Types of Contributions

- ** Bug fixes** - Fix issues and improve reliability
- ** New features** - Add functionality that helps job seekers
- ** Documentation** - Improve guides, comments, and examples
- ** UI/UX improvements** - Better design and user experience
- ** Performance** - Optimize speed and resource usage
- ** Testing** - Add tests to improve code quality
- ** Localization** - Add support for South African languages

##  Pull Request Process

### Before Creating a PR

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Follow coding standards** (see below)
4. **Add tests** for new functionality
5. **Update documentation** as needed

### PR Requirements

Your pull request must:

- [ ] **Pass all tests** and linting checks
- [ ] **Include descriptive commit messages**
- [ ] **Have clear PR title and description**
- [ ] **Include tests** for new features
- [ ] **Update documentation** if needed
- [ ] **Be focused** on a single feature or fix
- [ ] **Be reviewed** by at least one maintainer

### PR Template

```markdown
## Description
Brief description of what this PR accomplishes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for features
- [ ] Manual testing completed

## Impact on Job Seekers
How does this change improve the experience for South African job seekers?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

##  Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots or videos** if applicable
- **Impact on users** (especially job seekers)

### Feature Requests

For new features, provide:

- **User story** format: "As a [user type], I want [goal] so that [benefit]"
- **Detailed description** of the feature
- **Mockups or examples** if available
- **Priority justification** - how it helps our mission
- **Implementation considerations**

##  Coding Standards

### TypeScript Guidelines

```typescript
//  Good: Use explicit types
interface JobSearchParams {
  location: string;
  category: EntryLevelCategory;
  experience: ExperienceLevel;
}

//  Avoid: Implicit any types
function searchJobs(params: any) { ... }
```

### React Components

```typescript
//  Good: Functional components with TypeScript
interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <div className="job-card">
      {/* Component content */}
    </div>
  );
};
```

### API Endpoints

```typescript
//  Good: Proper error handling and validation
export const searchEntryLevelJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = entryLevelSearchSchema.parse(req.query);
    const jobs = await jobService.searchEntryLevel(params);
    
    res.json({
      success: true,
      data: jobs,
      meta: { total: jobs.length }
    });
  } catch (error) {
    next(error);
  }
};
```

### Naming Conventions

- **Files**: `kebab-case.ts`, `PascalCase.tsx` for components
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Database tables**: `snake_case`

### Import Organization

```typescript
// External libraries
import React from 'react';
import { Router } from 'express';

// Internal shared packages
import { Job, EntryLevelCategory } from '@shared/types';
import { validateJob } from '@shared/utils';

// Local imports
import { jobService } from '../services';
import './JobCard.css';
```

##  Testing Requirements

### Test Coverage

- **Unit tests**: All utility functions and services
- **Integration tests**: API endpoints and database operations
- **Component tests**: React components with user interactions
- **E2E tests**: Critical user journeys (job search, application)

### Testing Standards

```typescript
//  Good: Descriptive test names
describe('Entry Level Job Search', () => {
  it('should prioritize urgent hiring opportunities', async () => {
    const results = await searchEntryLevelJobs({
      category: 'general_labor',
      urgentOnly: true
    });
    
    expect(results.every(job => job.isUrgent)).toBe(true);
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test --workspace=packages/api

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

##  Documentation

### Code Documentation

- **JSDoc comments** for all public functions
- **README files** for each package
- **Inline comments** for complex business logic
- **API documentation** with examples

### Examples

```typescript
/**
 * Searches for entry-level jobs with priority for urgent positions
 * @param params - Search parameters including location and category
 * @returns Promise resolving to matched jobs with urgency indicators
 * @example
 * ```typescript
 * const jobs = await searchEntryLevelJobs({
 *   location: 'johannesburg',
 *   category: 'cleaning'
 * });
 * ```
 */
export async function searchEntryLevelJobs(
  params: EntryLevelSearchParams
): Promise<JobSearchResult> {
  // Implementation
}
```

### Documentation Updates

When adding features, update:

- **README.md** if public API changes
- **Package-specific docs** for new functionality  
- **Environment variable examples** for new config
- **Deployment instructions** if infrastructure changes

##  Recognition

### Contributor Hall of Fame

Contributors who make significant impacts will be:

- **Listed in our README** with their contributions
- **Invited to join** our contributor community
- **Given priority** for job opportunities (if desired)
- **Recognized in releases** and announcements

### Contribution Levels

- ** Bronze**: First merged PR
- ** Silver**: 5+ merged PRs or significant feature
- ** Gold**: 15+ merged PRs or major architectural contribution
- ** Diamond**: Long-term commitment and mentoring others

##  Questions?

### Getting Help

- **GitHub Discussions** - For questions and ideas
- **GitHub Issues** - For bugs and feature requests
- **Email**: contribute@aijobchommie.co.za
- **Slack**: Join our contributor Slack workspace

### Mentorship Program

New contributors can request mentorship for:

- **Code reviews and feedback**
- **Architecture guidance**
- **Career development advice**
- **Open source best practices**

##  Thank You!

Every contribution, no matter how small, helps create opportunities for South African job seekers. Thank you for being part of this mission to transform lives through technology.

---

**Made with  for South African job seekers**

*By contributing to AI Job Chommie Platform, you're not just writing code - you're creating opportunities and changing lives.*
