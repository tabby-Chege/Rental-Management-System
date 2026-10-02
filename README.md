# Rental Management System

A React application built with Vite and React Router that enables property managers and tenants to browse rental listings, search properties by city/state, and inspect detailed real-time market data integrated with the RentCast API.

## Project Overview
This project consolidates property data fetching, dynamic search filtering, client-side routing, and responsive UI components into a single-page application (SPA).

## Key Features
- **Interactive Property Search:** Filter properties by targeted US cities and states.
- **Real-Time Data Integration:** Live data requests powered by the RentCast API (`/properties` endpoint).
- **Property Details View:** Dynamic routing (`/properties/:id`) for in-depth listing attributes.
- **Responsive Navigation:** Clean SPA client-side routing via React Router DOM.

## Tech Stack
- **Frontend Framework:** React 18 (Vite)
- **Routing:** React Router DOM v6
- **Styling:** Standard CSS (Custom Variables & Modern Layout Grids)
- **Data Source:** RentCast API

## Team Contributions
- **Tabby:** React Router Setup, Navigation Bar & Base Layout Shell
- **Sonia:** RentCast API Integration & Data Fetching Helpers
- **David:** Property Cards Component & Listing Display Layout
- **Luice:** Search Filtering Logic, Input Controls & Property Details Page
- **Zack:** Project Lead, UI/CSS Integration, System Architecture & Documentation

## Project Structure
```text
src/
├── api/          # API helper functions & RentCast integration
├── components/   # Reusable UI components (PropertyCard, Navbar, etc.)
├── data/         # Mock data & fallback configurations (cities, sample properties)
├── pages/        # Main route views (Home, Properties, SearchPage, PropertyDetails)
├── App.jsx       # Core router setup & app layout shell
└── App.css       # Global design system & theme variables

