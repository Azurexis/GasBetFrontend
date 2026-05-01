# GasBet Frontend

Frontend der GasBet-Anwendung auf Basis von React und Vite.

GasBet ist eine Webanwendung, in der Nutzer Vorhersagen zur Entwicklung von Kraftstoffpreisen abgeben können. Das Frontend stellt Ereignisse, eigene Tipps, Community-Tipps, Rangliste, Statistiken und Preisverläufe dar und kommuniziert über eine REST-API mit dem Backend.

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Recharts

Deployment:

- Azure Static Web Apps

Backend-Anbindung:

- Azure App Service (.NET API)

---

## Features

- Anzeige aktueller Ereignisse
- Tipps auf Preisentwicklungen abgeben
- Eigene Tipps und Statistiken einsehen
- Community-Tipps anzeigen
- Rangliste nach Gesamtpunkten
- Preisverlauf als Diagramm
- Responsive Layout mit mobilen Kartenansichten
- JWT-basierter Login für geschützte Bereiche

---

## Projektstruktur

```txt
src/
  api/
  assets/
  components/
  pages/
  types/
  utils/
```

- components/ enthält wiederverwendbare UI-Bausteine
- pages/ enthält die einzelnen Seiten der Anwendung
- types/ enthält DTOs und Typdefinitionen
- utils/ enthält Formatierungs- und Hilfsfunktionen
- api/ enthält Hilfslogik für Requests, z. B. authFetch

---

## Lokale Entwicklung

### Voraussetzungen

- Node.js
- npm

### Installation

```bash
npm install
```

### Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist danach lokal über die von Vite ausgegebene URL erreichbar.

---

## Umgebungsvariablen

Für die API-Anbindung wird eine Vite-Umgebungsvariable verwendet.

### .env

```env
VITE_API_BASE_URL=https://your-backend-url
```

Beispiel:

```env
VITE_API_BASE_URL=https://gas-bet-backend.azurewebsites.net
```

---

## Build

Produktions-Build erstellen:

```bash
npm run build
```

Vorschau des Builds lokal:

```bash
npm run preview
```

---

## Routing / Azure Static Web Apps

Da es sich um eine Single Page Application mit React Router handelt, wird für direkte Aufrufe von Unterseiten ein Fallback auf index.html benötigt.

Dafür wird eine staticwebapp.config.json im Projektroot verwendet.

Beispiel:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": [
      "/assets/*",
      "/favicon.ico",
      "/*.png",
      "/*.jpg",
      "/*.svg",
      "/*.css",
      "/*.js"
    ]
  }
}
```

---

## Deployment

Das Frontend wird über Azure Static Web Apps bereitgestellt.

Der Deployment-Workflow erfolgt über GitHub Actions.  
Wichtig für Vite-Projekte ist dabei, dass der Build-Output auf dist zeigt.

Beispiel:

```yml
app_location: "/"
api_location: ""
output_location: "dist"
```

---

## Backend-Kommunikation

Das Frontend greift über HTTP auf die Backend-API zu, unter anderem für:

- Events
- Predictions
- Leaderboard
- User Stats
- Price History

Geschützte Endpunkte verwenden JWT-basierte Authentifizierung.

---

## Hinweise

- Alle VITE_* Variablen sind im Frontend sichtbar und daher nicht als Secret zu behandeln.
- Echte Secrets wie Datenbankzugänge, interne API-Keys oder JWT-Secrets gehören ausschließlich ins Backend bzw. in Cloud-Konfigurationen.

---

## Status

Das Projekt ist als praxisnahes Portfolio- und Lernprojekt aufgebaut und wird schrittweise weiterentwickelt.  
Geplante Verbesserungen betreffen unter anderem zusätzliche Community-Funktionen, bessere Session-Verwaltung und weitere Optimierungen für Mobile UX.

---

## Lizenz

Aktuell keine Lizenz definiert.