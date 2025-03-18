# Perfin
Easily track your finances and see your balance at a glance.

## Features
- Create and edit transactions
- View transactions by date, category, or title
- View detailed balance and transactions over time

## Resources Used

### Dependencies
- SvelteKit - https://kit.svelte.dev/docs/introduction
- Chart.js - https://www.chartjs.org/
- Moment.js - https://momentjs.com/
- Driver.js - https://driverjs.com/

### Fonts
- Roboto - https://fonts.google.com/specimen/Roboto
- Material Symbols - https://fonts.google.com/icons

## Setup

### Development
- Run `npm install` to install dependencies
- To start the development server, run `npm run dev`

### Production
- Run `npm install`
- Run `npm run build`
- To start the server, run `npm run preview`

## Directory Structure
- `/src` - the source code of the app
  - `/src/lib` - reusable components
    - `/src/lib/UserData.js` - stores all user data
  - `/src/routes` - pages of the app
    - `/src/routes/+page.svelte` - the home page
    - `/src/routes/+layout.svelte` - the global layout of the app
    - `/src/routes/transactions/+page.svelte` - the transactions page
    - `/src/routes/summary/+page.svelte` - the summary page
    - `/src/routes/settings/+page.svelte` - the settings page
    - `/src/routes/help/+page.svelte` - the help page

## Roadmap
The following are plans for future development:
- Allow transactions to be categorized by multiple tags
- Allow the user to save data to an online database
- Allow the user to import data from bank statements
- Automate recurring transactions
- Test Perfin with students at Chapel Hill High School