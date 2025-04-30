# MTWS Website Revamp TODO

## Setup
- [x] Set up Tailwind CSS integration
- [x] Add Lucide icons library
- [x] Switch to using Tailwind CSS via CDN instead of npm package

## UI/UX Improvements
- [x] Create a modern responsive layout
- [x] Add MTWS logo to the header
- [x] Improve overall styling with Tailwind CSS
- [x] Remove the picker option functionality
- [x] Create a clean prayer time display interface
- [x] Make the UI mobile-friendly
- [x] Change the name to "Masjid Tawheed Was-Sunnah"
- [x] Change the title to "MTWS Iqāmah Times"
- [x] Remove admin access and restore buttons

## New Design Tasks (Based on Reference Design)
- [x] Implement green color scheme with modern UI (Updated to use #558422, a darker variant of #72B02D)
- [x] Add both Gregorian and Hijri date display
- [x] Create card-based layout for each prayer time
- [x] Highlight current/next prayer time in a different color
- [x] Display countdown timer until next prayer
- [x] Show Iqamah times below prayer times
- [x] Add special styling for Jumuah (Friday) prayer
- [x] Implement large, clean typography for time displays
- [x] Add masjid address information
- [x] Create responsive design that works on digital signage and mobile
- [x] Create a fullscreen digital signage display version

## Features
- [x] Integrate Lucide icons for better visual elements
- [x] Add proper header with MTWS branding
- [x] Improve the data display for prayer times
- [x] Create a footer with relevant information

## Technical Improvements
- [x] Refactor existing JavaScript for better maintainability
- [x] Optimize backend API requests
- [x] Implement proper error handling with user-friendly messages
- [x] Ensure cross-browser compatibility
- [x] Archive original files to the "/old" directory
- [x] Add functionality to calculate and display next prayer time
- [x] Create countdown timer functionality with JavaScript
- [x] Detect current prayer based on time and highlight it
- [x] Implement Hijri date conversion 

## Styling Fixes and Data Integration
- [x] Make Iqamah times the primary display with larger typography (big numbers)
- [x] Display Adhan times as smaller text above Iqamah times
- [x] Add text under each salah saying "COMES IN AT: [time]" for Adhan times
- [x] Convert all times from 24-hour to 12-hour format with AM/PM
- [x] Pull Adhan prayer times from the MD table files (may.md and june.md)
- [x] Pull Iqamah times from the dataplicity API (Implemented in index.js to fetch times from API based on current day of week)
- [x] Use the "sunrise" column from MD files for Shuruq times
- [x] Ensure correct styling for all prayer cards (active and inactive states)
- [x] Fix mobile responsiveness issues

## Additional UI Improvements
- [x] Add wavy border divider between the header section and prayer cards section
- [x] Switch to a simpler, more minimal card design without shadows or hover effects
- [x] Reorganize prayer cards in a 2×3 grid layout (first row: Fajr, Shuruq, Dhuhr; second row: Asr, Maghrib, Isha)
- [x] Align prayer times and names to the left within cards (instead of center alignment)
- [x] Use green text for prayer names (instead of on white background)
- [x] Consider adding a verification badge next to the masjid name
- [x] Make Jumuah card span full width at the bottom
- [x] Use 12-hour time format (HH:MM) instead of 24-hour format
- [x] Add consistent padding and spacing between all elements
- [x] Use a consistent color for all prayer times (instead of highlighting current prayer)
- [x] Display times in larger, bolder font with clearer distinction between adhan and iqamah times 

## Layout and Display Requirements
- [x] Make IQAMAH times the primary focus with large, bold typography
- [x] Move Adhan (prayer) times to the bottom of each card
- [x] Format Adhan times as "COMES IN AT: [time] AM/PM"
- [x] Keep prayer name at the top of each card in masjid-accent color
- [x] Ensure all cards follow the same layout pattern
- [x] Update the Jumuah card to show both prayer time and Iqamah time in the same format
- [x] Keep the current card-based grid layout but ensure consistent spacing
- [x] Maintain highlight for current/next prayer 