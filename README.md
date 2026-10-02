# Rental Management System

A React application built with Vite and React Router that enables property managers and tenants to browse rental listings, search properties, and view detailed property information using the RentCast API.

## Project Overview

This project provides a simple rental property management interface with property search, filtering, dynamic property details, client-side routing, and responsive UI components.

## Key Features

- **Interactive Property Search:** Search and filter properties by name, address, city, state, or ZIP code.
- **External API Integration:** Property data is retrieved through the RentCast API `/properties` endpoint, with mock data available for development and testing.
- **Property Details View:** Dynamic routing using `/properties/:id` displays detailed property information.
- **Property Filtering:** Filter properties by property age and size.
- **Property Sorting:** Sort listings by newest, oldest, or largest.
- **Responsive Navigation:** Client-side navigation using React Router.

## Tech Stack

- **Frontend Framework:** React 19.2.8 (Vite)
- **Routing:** React Router DOM 7.18.4
- **Styling:** Standard CSS
- **Data Source:** RentCast API
- **Development:** JavaScript, Git, and GitHub

## Team Contributions

- **Tabby:** React Router setup, navigation, base project structure, and API integration coordination
- **Sonia:** RentCast API integration and data-fetching helpers
- **David:** Property cards component and property listing display
- **Luice:** Search filtering, input controls, and property details page
- **Zack:** UI/CSS integration and project documentation

## Project Structure

```text
src/
├── api/             # API helper functions and RentCast integration
├── Components/      # Reusable UI components
├── data/            # Mock data and sample properties
├── pages/           # Main route views and page components
├── App.jsx          # Main application routes
└── App.css          # Application styling
