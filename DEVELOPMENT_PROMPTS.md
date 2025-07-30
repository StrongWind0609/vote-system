# Development Prompts Used

This document contains all the prompts used to create the America's Got Talent Live Voting System.

## 1. Initial Project Setup

**Prompt:**
```
Test Assigment:
Build a system that allows the public to vote live for contestants during an America's Got Talent-style show.
The app should display a list of active contestants, let users cast limited votes during a live voting window, and update in real time to reflect current vote trends or statuses.
It should be reliable, responsive across devices, and handle failure gracefully.
Use React with NextJS
What we will look for:
1. Create reusable custom hooks to manage contestant voting logic, ensuring state is isolated per contestant and scalable across the app.
2. Implement error boundaries to catch and display fallback UIs when parts of the app fail, such as data fetch or vote submission.
3. Design a responsive layout so the voting interface adapts smoothly across mobile, tablet, and desktop screen sizes.
4. Validate and handle form input to enforce vote limits, prevent duplicate votes, and give clear user feedback on errors.
5. Simulate live data updates (e.g. changing vote counts) using polling or timers to mimic real-time voting behavior.
6. Structure components and state to reflect a clean separation of concerns and testable logic.
7. Gracefully handle loading and failure states so the system remains usable and informative even under degraded conditions.
Deliver:
1. Proper specification: business and technical
2. All prompts used to code the assigment
3. Folder with the app
4. Tests that the "Vote" button disables after voting and remains disabled even after a page reload, using localStorage to persist vote state.
```

## 2. Business and Technical Specification

**Prompt:**
```
Create a comprehensive specification document that includes:
- Business requirements for the voting system
- Technical requirements and architecture
- Component structure and data flow
- Error handling strategies
- Testing approach
- Performance considerations
```

## 3. TypeScript Type Definitions

**Prompt:**
```
Create TypeScript interfaces for:
- Contestant data structure with id, name, talent, imageUrl, voteCount, isActive
- Vote state management with contestantId, hasVoted, timestamp
- API responses with data, success, message
- Error states with hasError, message, retry function
- Voting window with isOpen, startTime, endTime
```

## 4. Custom Hooks Development

**Prompt:**
```
Create custom React hooks for:
1. useVoting hook:
   - Isolated voting logic per contestant
   - localStorage persistence for vote state
   - Error handling for vote submission
   - Loading states during submission
   - Prevention of duplicate votes

2. useContestants hook:
   - Real-time data fetching with polling
   - Error handling for network failures
   - Loading states
   - Refetch functionality
   - Voting window management
```

## 5. Error Boundary Component

**Prompt:**
```
Implement a comprehensive error boundary component that:
- Catches JavaScript errors in component tree
- Displays fallback UI when errors occur
- Provides retry functionality
- Shows error details in development
- Handles different types of errors gracefully
- Maintains app stability even when components fail
```

## 6. Storage Utility Functions

**Prompt:**
```
Create utility functions for localStorage management:
- getVoteState: Retrieve vote state for a specific contestant
- setVoteState: Save vote state for a contestant
- clearVoteStates: Clear all vote states
- Error handling for localStorage failures
- JSON parsing with error recovery
- Timestamp management for vote tracking
```

## 7. API Simulation Functions

**Prompt:**
```
Create mock API functions that simulate:
- Network delays and realistic response times
- Random network errors (10% failure rate)
- Real-time vote count updates
- Contestant data with realistic information
- Voting window management
- Error responses with meaningful messages
```

## 8. Responsive Contestant Card Component

**Prompt:**
```
Create a responsive contestant card component with:
- Mobile-first design approach
- CSS Grid/Flexbox layout
- Smooth hover animations
- Image error handling with fallbacks
- Vote button with different states (enabled, disabled, voted, submitting)
- Error message display
- Voting window status indicators
- Accessible UI elements
```

## 9. Main Voting Interface Component

**Prompt:**
```
Create the main voting interface component that:
- Displays all contestants in a responsive grid
- Shows voting window status
- Handles loading states with spinners
- Displays error states with retry options
- Updates in real-time with polling
- Adapts to different screen sizes
- Provides clear user feedback
```

## 10. Testing Strategy

**Prompt:**
```
Implement comprehensive tests for:
1. Component Tests:
   - ContestantCard rendering and interactions
   - Vote button behavior and state changes
   - Error handling and fallback UIs
   - Responsive design verification

2. Hook Tests:
   - useVoting state management
   - localStorage persistence
   - Error handling scenarios
   - Vote submission flow

3. Utility Tests:
   - Storage functions with localStorage
   - API simulation functions
   - Error handling edge cases

4. Integration Tests:
   - Vote button disables after voting and persists after page reload
   - Real-time updates work correctly
   - Error boundaries catch and handle errors
```

## 11. Jest Configuration

**Prompt:**
```
Configure Jest for Next.js with TypeScript:
- Module path mapping for @/ imports
- React Testing Library setup
- DOM environment configuration
- Test file patterns
- Coverage reporting
- Mock setup for localStorage
```

## 12. Package.json and Dependencies

**Prompt:**
```
Create package.json with:
- Next.js 14 with React 18
- TypeScript configuration
- Testing dependencies (Jest, React Testing Library)
- Development tools (ESLint)
- Proper scripts for development, building, and testing
```

## 13. Next.js Configuration

**Prompt:**
```
Configure Next.js for:
- TypeScript support
- App directory structure
- Build optimization
- Development server settings
- Static file handling
```

## 14. README Documentation

**Prompt:**
```
Create comprehensive README with:
- Project overview and features
- Technical stack details
- Installation and setup instructions
- Usage examples
- Testing instructions
- Architecture overview
- Development guidelines
- All prompts used during development
```

## 15. Vote Persistence Test

**Prompt:**
```
Create specific tests that verify:
- Vote button disables after voting
- Vote state persists after page reload using localStorage
- Multiple contestants maintain separate vote states
- Error handling for localStorage failures
- Vote button remains disabled across browser sessions
```

## 16. Single Vote Restriction Implementation

**Prompt:**
```
Implement a system where each user is restricted to casting only one vote.
```

**Implementation Details:**
- Added GlobalVoteState interface to track single vote across all contestants
- Modified useVoting hook to check global vote state instead of per-contestant state
- Updated ContestantCard to show "Already Voted" for non-voted contestants
- Added hasVotedForOther flag to distinguish between voted and other contestants
- Updated all tests to work with the new single vote system
- Added comprehensive error handling for vote restriction scenarios

## 17. Next.js App Directory Compatibility Fixes

**Prompt:**
```
Fix client/server component errors and styled-jsx compatibility issues in Next.js 13+ app directory.
```

**Fixes Applied:**
- Added "use client" directive to all components using React hooks
- Converted styled-jsx to separate CSS files for better compatibility
- Fixed import paths from @/ aliases to relative paths
- Updated Jest configuration for proper module resolution
- Removed deprecated experimental.appDir option from next.config.js
- Created separate CSS files for ErrorBoundary, VotingInterface, and ContestantCard components

## 18. Documentation Updates

**Prompt:**
```
Reflect all of prompts into DEVELOPMENT_PROMPTS.md and README.md.
```

## 19. UI/UX Improvements

**Prompt:**
```
The app title color is not acceptable, please change
```

**Implementation:**
- Changed app title color from gradient to white (#ffffff)
- Added text shadow for better readability
- Removed background-clip and text-fill-color properties

## 20. Contestant Data Enhancement

**Prompts:**
```
first image missed.
input correct images
increase the number of contestants to ten
please add the missing contestant images
each contestant must have their own images
```

**Implementation:**
- Increased contestants from 5 to 10
- Replaced placeholder images with professional Unsplash images
- Added unique images for each contestant with proper sizing parameters
- Used w=400&h=300&fit=crop&crop=face for consistent face-focused images

## 21. Error Handling Improvements

**Prompts:**
```
please delete the error status after 4 secondes
the error is happening too frequently
```

**Implementation:**
- Added automatic error clearing after 4 seconds in useVoting hook
- Reduced API error rate from 10% to 2% for better user experience
- Implemented useEffect with setTimeout for error auto-clear functionality

## 22. Image Management

**Prompt:**
```
change Ryan O'Connor's image that we did not used
```

**Implementation:**
- Identified duplicate image usage for Ryan O'Connor
- Updated to use unique Unsplash image that wasn't used by other contestants
- Ensured each contestant has a completely unique image

## Key Implementation Decisions

1. **Custom Hooks**: Used isolated state management per contestant for scalability
2. **Error Boundaries**: Implemented component-level error handling for graceful failures
3. **Responsive Design**: Mobile-first approach with CSS Grid and media queries
4. **localStorage**: Persistent vote state that survives page reloads
5. **Real-time Updates**: Polling-based approach for live data updates
6. **Testing**: Comprehensive test coverage including integration tests
7. **TypeScript**: Full type safety throughout the application
8. **Performance**: Optimized rendering and state updates
9. **Single Vote Restriction**: Global vote state prevents multiple votes per user
10. **Next.js Compatibility**: Full support for app directory and client/server components
11. **Image Management**: Unique professional images for each contestant
12. **Error UX**: Auto-clearing error messages for better user experience
13. **UI Polish**: Improved title styling and visual feedback

## Architecture Highlights

- **Separation of Concerns**: Clear separation between UI, logic, and data layers
- **Reusable Components**: Modular design for maintainability
- **Error Handling**: Graceful degradation at multiple levels
- **State Management**: Global vote state with single vote restriction
- **Testing**: Full test coverage with realistic scenarios
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Performance**: Optimized for real-time updates and responsiveness
- **Vote Restriction**: Single vote per user with clear visual feedback
- **Modern React**: Full compatibility with Next.js 13+ app directory
- **User Experience**: Auto-clearing errors, unique images, and polished UI
- **Data Integrity**: Unique contestant images and proper error handling 