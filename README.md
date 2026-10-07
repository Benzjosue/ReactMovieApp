# React Movie App

A movie discovery app: browse popular titles, search for something specific, and keep the movies you want to come back to in one place.

## Why I Built This

I wanted to understand how a React application works beyond what appears on the screen. A search box looks simple, but making it useful requires several pieces to work together: user input, state updates, network requests, response data, and components that display the result.

This project gave me a concrete way to connect those pieces. The goal was to build a complete interaction: find a movie, save it, navigate to a favorites page, and remove it when it no longer belongs on the list.

I focused on understanding the flow of data through the application. Where does a movie object come from? Which component needs it? What changes when someone clicks the heart? How does that change reach another page? Those questions shaped how I approached the project.

## The Experience

The application starts with popular movies from The Movie Database (TMDB). Each card displays a poster, a title, and the release year. Users can search TMDB's catalog by title, save movies using the heart button, and view their collection on a separate Favorites page.

The interaction stays focused. There is no sign-up flow or account system. Favorites are stored in the browser, so the collection belongs to that browser rather than a remote user account.

## Core User Flow

```text
Browse popular movies → Search by title → Favorite a movie → Open Favorites → Review or remove movies
```

| Area | What happens |
| --- | --- |
| Home | Requests popular movies when the page mounts and displays the returned cards. |
| Search | Submits the entered title to TMDB and replaces the displayed movies with the search results. |
| Movie card | Displays the poster, title, release year, and a heart button reflecting favorite status. |
| Favorites | Reads the shared favorites array and renders a card for each saved movie. |
| Navigation | Switches between Home and Favorites through React Router. |

## Key Features

- **Live movie data:** popular titles and search results come from TMDB rather than a fixed local dataset.
- **Title search:** a controlled input keeps the entered text in React state; submitting the form sends an API request.
- **Search validation:** blank or whitespace-only queries are ignored, and searches are blocked while a request is already loading.
- **Reusable movie cards:** the same component displays movies on both pages.
- **Shared favorites:** React Context provides the collection and the functions used to add, remove, and check movies.
- **Favorite feedback:** the heart button receives an active CSS class when a movie is saved.
- **Browser persistence:** favorites are serialized to local storage and read back when the provider mounts.
- **Loading and error messages:** Home displays request progress and messages for caught failures.
- **Responsive layout:** CSS adjusts the movie grid and card presentation for different screen sizes.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Interface | React | Components, state, and rendering |
| Language | JavaScript and JSX | Application logic and interface descriptions |
| Development and build | Vite | Local server and production assets |
| Navigation | React Router | Home and Favorites routes |
| Styling | CSS | Grid layout, cards, navigation, and button states |
| Data | TMDB API | Popular movies, search results, and poster paths |
| Networking | Fetch API | HTTP requests from the browser |
| Persistence | Local Storage | Browser-specific favorites |
| Code checks | ESLint | Static feedback on potential code issues |
| Deployment configuration | Vercel | Hosting configuration and route rewrites |

## Architecture Overview

```text
src/
├── components/
│   ├── MovieCard.jsx       # Poster, movie details, and favorite interaction
│   └── NavBar.jsx          # Links between application pages
├── contexts/
│   └── MovieContext.jsx    # Shared favorites state and helper functions
├── pages/
│   ├── Home.jsx            # Popular movies, search, loading, and errors
│   └── Favorites.jsx       # Saved movie collection
├── services/
│   └── api.js              # TMDB request functions
├── css/                    # Application and component stylesheets
├── App.jsx                 # Provider, navigation, and route definitions
└── main.jsx                # React root and BrowserRouter

index.html                  # HTML entry point
package.json                # Dependencies and npm scripts
vercel.json                 # Rewrite configuration for client-side routes
```

### Data Flow

The API service requests data and parses the response body as JSON. It returns the `results` array to Home, which stores that array in state. Home maps each movie object to a `MovieCard` element and passes the object through the `movie` prop.

```text
TMDB → API service → Home state → MovieCard props → Displayed cards
```

Favoriting follows a separate path. A card uses `useMovieContext()` to access shared helper functions. Clicking its heart adds or removes a movie from the provider's state. Components reading that context receive the updated collection, and an effect writes the collection to local storage.

```text
Heart click → Context helper → Favorites state → Updated cards and Favorites page
                                          └→ Local Storage
```

### Routes

| URL | Component |
| --- | --- |
| `/` | Home |
| `/favorites` | Favorites |

The route path determines the URL. Naming a component `Home` does not automatically create a `/home` route.

## API Integration

The service uses two TMDB operations:

| Function | Endpoint | Result |
| --- | --- | --- |
| `getPopularMovies()` | `/movie/popular` | A page of movies ordered by popularity |
| `searchMovies(query)` | `/search/movie` | Movies matching the supplied search text |

The search request uses `encodeURIComponent(query)` to encode the user-supplied text for inclusion in the URL. Both functions use `async` and `await` to receive the response, parse its body, and return the movie array.

Movie cards read fields such as `id`, `title`, `release_date`, and `poster_path`. Poster images are requested from TMDB's image service using the returned poster path.

API reference: [Popular movies](https://developer.themoviedb.org/reference/movie-popular-list) and [Movie search](https://developer.themoviedb.org/reference/search-movie).

## Favorites and Persistence

The context exposes four values:

| Value | Responsibility |
| --- | --- |
| `favorites` | Current array of saved movie objects |
| `addToFavorites(movie)` | Creates a new array containing the existing movies and the added movie |
| `removeFromFavorites(movieId)` | Filters out the movie with the matching ID |
| `isFavorite(movieId)` | Checks whether the collection contains that movie |

Updates create new arrays instead of modifying the existing state directly. Local storage accepts strings, so saving uses `JSON.stringify()` and restoring uses `JSON.parse()`.

Favorites do not synchronize between devices, browser profiles, or different site addresses. Clearing site storage also clears the saved collection.

## Running Locally

Install a current Node.js LTS release with npm, then clone the repository:

```bash
git clone https://github.com/Benzjosue/ReactMovieApp.git
cd ReactMovieApp
npm install
```

These commands assume `package.json` is at the repository root. If the app is inside a subfolder, change into that folder before running npm commands.

The current API service reads an `API_KEY` constant in `src/services/api.js`. Configure that value with your own TMDB API key. Do not commit your personal key.

For an environment-variable setup, change the declaration to:

```js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

Then create `.env.local` beside `package.json`:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

The project's `*.local` ignore rule excludes this file from Git. Restart the development server after changing environment variables.

```bash
npm run dev
```

Open the local address printed in the terminal.

### Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate production assets in `dist` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

Import the GitHub repository into Vercel and select the directory containing the app's `package.json` as the project root. Use the Vite preset, `npm run build` as the build command, and `dist` as the output directory.

The rewrite in `vercel.json` sends client-side routes to `index.html`, allowing direct visits and refreshes on `/favorites`.

If the API service has been updated to use `VITE_TMDB_API_KEY`, add that variable in Vercel before deploying. Vite embeds browser-accessible environment variables in the build; this keeps credentials out of repository files but does not make them private to visitors. Keeping a credential private requires a backend or server-side proxy.

Stylesheet paths must match the tracked filenames exactly. For example, `Navbar.css` and `NavBar.css` are different filenames on a case-sensitive deployment environment.

## Current Scope and Next Improvements

This version focuses on discovery, search, and a browser-based favorites collection. Several improvements remain:

- Check `response.ok` and validate returned data before putting API results into state.
- Add a clear message when a search returns no movies.
- Correct the Favorites empty-state condition to check `favorites.length > 0`; an empty array is truthy in JavaScript.
- Strengthen local-storage initialization so saving cannot overwrite stored favorites before restoration completes, and handle invalid stored JSON.
- Provide fallback images for movies without a poster.
- Add pagination and a movie details view.
- Improve accessibility with an explicit search label and descriptive favorite-button labels.

These are planned improvements rather than features already implemented.

## What I Practiced

The project connects reusable components, props, state, controlled forms, event handlers, conditional rendering, array transformations, asynchronous requests, routing, context, and browser storage in one application.

It also made deployment behavior concrete: local files must be saved, dependencies must belong to the correct project folder, import capitalization matters, and client-side routes need host configuration. Understanding those connections matters as much as getting the initial page to render.

## Movie Data

Movie information and poster images are provided by [The Movie Database](https://www.themoviedb.org/). This application is not endorsed or certified by TMDB.
typescript-eslint.io) in your project.
