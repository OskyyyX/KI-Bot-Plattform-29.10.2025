# 🔄 OAuth 2.0 Authorization Code Flow - Ablaufdiagramm

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GOOGLE CALENDAR API - OAuth 2.0 FLOW                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐                                      ┌──────────────────┐
│             │                                      │                  │
│    USER     │                                      │  GOOGLE OAUTH    │
│             │                                      │                  │
└──────┬──────┘                                      └────────┬─────────┘
       │                                                      │
       │                                                      │
┌──────▼──────────────────────────────────────────────────────────────────┐
│ SCHRITT 1: Credentials eingeben                                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │ [1] Client-ID: 123456789-abc...apps.googleusercontent.com  │      │
│  │ [2] Client Secret: GOCSPX-1234567890abcdefghijklmn          │      │
│  │ [3] Redirect URI: http://localhost:3000/index.html          │      │
│  │                   (automatisch erkannt)                      │      │
│  └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│  [ Button: 🔗 Mit Google verbinden ]                                    │
│                                                                         │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │
                                        │ USER KLICKT BUTTON
                                        │
┌───────────────────────────────────────▼─────────────────────────────────┐
│ SCHRITT 2: Authorization URL bauen                                     │
│                                                                         │
│  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')│
│  authUrl.searchParams.append('client_id', clientId)                    │
│  authUrl.searchParams.append('redirect_uri', redirectUri)              │
│  authUrl.searchParams.append('response_type', 'code')                  │
│  authUrl.searchParams.append('scope', 'calendar')                      │
│  authUrl.searchParams.append('access_type', 'offline')                 │
│  authUrl.searchParams.append('prompt', 'consent')                      │
│  authUrl.searchParams.append('state', 'website')                       │
│                                                                         │
│  window.location.href = authUrl.toString()                             │
│                                                                         │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │
                                        │ REDIRECT ZU GOOGLE
                                        │
                           ┌────────────▼──────────────┐
                           │                           │
                           │   GOOGLE CONSENT SCREEN   │
                           │                           │
                           │  ┌──────────────────────┐ │
                           │  │ KI-Bot Platform      │ │
                           │  │ möchte Zugriff auf:  │ │
                           │  │                      │ │
                           │  │ ✓ Google Calendar    │ │
                           │  │   (Termine ansehen   │ │
                           │  │    und erstellen)    │ │
                           │  │                      │ │
                           │  │ [ Abbrechen ]        │ │
                           │  │ [ Zulassen ]         │ │
                           │  └──────────────────────┘ │
                           │                           │
                           └────────────┬──────────────┘
                                        │
                                        │ USER KLICKT "ZULASSEN"
                                        │
┌───────────────────────────────────────▼─────────────────────────────────┐
│ SCHRITT 3: Google leitet zurück mit Authorization Code                 │
│                                                                         │
│  http://localhost:3000/index.html?code=4/0AQl...&state=website         │
│                                                                         │
│  URL-Parameter:                                                         │
│  ├─ code: 4/0AQl...  ← Authorization Code                              │
│  └─ state: website   ← Bot Type (website/whatsapp)                     │
│                                                                         │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │
                                        │ handleOAuthCallback() ERKENNT CODE
                                        │
┌───────────────────────────────────────▼─────────────────────────────────┐
│ SCHRITT 4: Tausche Code gegen Access Token                             │
│                                                                         │
│  POST https://oauth2.googleapis.com/token                              │
│                                                                         │
│  Body (application/x-www-form-urlencoded):                             │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │ code: 4/0AQl...                                                │    │
│  │ client_id: 123456789-abc...apps.googleusercontent.com         │    │
│  │ client_secret: GOCSPX-1234567890abcdefghijklmn                │    │
│  │ redirect_uri: http://localhost:3000/index.html                 │    │
│  │ grant_type: authorization_code                                 │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Response (JSON):                                                       │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │ {                                                              │    │
│  │   "access_token": "ya29.a0AfH6SMB...",                        │    │
│  │   "expires_in": 3600,                                          │    │
│  │   "refresh_token": "1//0gHkF3...",                            │    │
│  │   "scope": "https://www.googleapis.com/auth/calendar",        │    │
│  │   "token_type": "Bearer"                                       │    │
│  │ }                                                              │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │
                                        │ TOKENS GESPEICHERT
                                        │
┌───────────────────────────────────────▼─────────────────────────────────┐
│ SCHRITT 5: Tokens speichern & URL bereinigen                           │
│                                                                         │
│  config.accessToken = "ya29.a0AfH6SMB..."                              │
│  config.refreshToken = "1//0gHkF3..."                                  │
│  config.tokenExpiry = Date.now() + 3600000                             │
│                                                                         │
│  localStorage.setItem('website_agent_google', JSON.stringify({...}))   │
│                                                                         │
│  // Bereinige URL (entferne code & state)                              │
│  window.history.replaceState({}, '', 'http://localhost:3000/index.html')│
│                                                                         │
│  ✅ Erfolgreich mit Google Calendar verbunden!                          │
│                                                                         │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │
                                        │ BEREIT FÜR API-AUFRUFE
                                        │
┌───────────────────────────────────────▼─────────────────────────────────┐
│ SCHRITT 6: API-Aufrufe mit Access Token                                │
│                                                                         │
│  A) EVENTS ABRUFEN:                                                     │
│  ───────────────────                                                    │
│  GET https://www.googleapis.com/calendar/v3/calendars/primary/events   │
│  Headers:                                                               │
│  └─ Authorization: Bearer ya29.a0AfH6SMB...                             │
│                                                                         │
│  Response:                                                              │
│  {                                                                      │
│    "items": [                                                           │
│      {                                                                  │
│        "summary": "Meeting mit Team",                                  │
│        "start": { "dateTime": "2025-10-29T14:00:00+01:00" },           │
│        "end": { "dateTime": "2025-10-29T15:00:00+01:00" }              │
│      }                                                                  │
│    ]                                                                    │
│  }                                                                      │
│                                                                         │
│  B) EVENT ERSTELLEN:                                                    │
│  ──────────────────                                                     │
│  POST https://www.googleapis.com/calendar/v3/calendars/primary/events  │
│  Headers:                                                               │
│  ├─ Authorization: Bearer ya29.a0AfH6SMB...                             │
│  └─ Content-Type: application/json                                     │
│                                                                         │
│  Body:                                                                  │
│  {                                                                      │
│    "summary": "Zahnarzt",                                              │
│    "start": { "dateTime": "2025-10-30T15:00:00+01:00" },               │
│    "end": { "dateTime": "2025-10-30T16:00:00+01:00" }                  │
│  }                                                                      │
│                                                                         │
│  Response:                                                              │
│  {                                                                      │
│    "id": "abc123...",                                                  │
│    "htmlLink": "https://calendar.google.com/event?eid=...",            │
│    "summary": "Zahnarzt",                                              │
│    ...                                                                  │
│  }                                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│  ZUSAMMENFASSUNG:                                                       │
│                                                                         │
│  1. User gibt Client-ID + Client Secret ein                            │
│  2. Klickt "Mit Google verbinden"                                       │
│  3. Wird zu Google OAuth weitergeleitet                                │
│  4. Meldet sich an und klickt "Zulassen"                               │
│  5. Google leitet zurück mit Authorization Code                        │
│  6. System tauscht Code gegen Access Token + Refresh Token             │
│  7. Tokens werden gespeichert                                          │
│  8. URL wird bereinigt                                                  │
│  9. ✅ Bereit für API-Aufrufe!                                          │
│                                                                         │
│  Token läuft ab nach: 3600 Sekunden (1 Stunde)                         │
│  Refresh Token: Dauerhaft (für automatische Erneuerung)                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Wichtige Endpoints:

| Endpoint | Verwendung |
|----------|------------|
| `https://accounts.google.com/o/oauth2/v2/auth` | Authorization URL (User-Redirect) |
| `https://oauth2.googleapis.com/token` | Token Exchange (Code → Access Token) |
| `https://www.googleapis.com/calendar/v3/calendars/primary/events` | Calendar API (Events) |

---

## 📦 Gespeicherte Daten (localStorage):

```json
{
  "enabled": true,
  "clientId": "123456789-abc...apps.googleusercontent.com",
  "clientSecret": "R09DU1BYLTEyMzQ1Njc4OTA=", // Base64(GOCSPX-1234567890)
  "redirectUri": "http://localhost:3000/index.html",
  "accessToken": "ya29.a0AfH6SMB...",
  "refreshToken": "1//0gHkF3...",
  "tokenExpiry": 1735478400000
}
```

---

## 🔒 Sicherheitshinweise:

1. ⚠️ **Client Secret nicht in Browser-Code einbetten!**
   - Nur in localStorage (verschlüsselt)
   - In Produktion: Server-seitige Token-Verwaltung empfohlen

2. ✅ **HTTPS in Produktion verwenden!**
   - Redirect URI: `https://ihre-domain.com/...`
   - Nie `http://` in Produktion!

3. 🔄 **Refresh Token nutzen:**
   - Access Token läuft nach 1 Stunde ab
   - Refresh Token bleibt dauerhaft gültig
   - Kann für automatische Erneuerung verwendet werden

4. 🔐 **Tokens sicher speichern:**
   - Nicht in Cookies (XSS-Risiko)
   - Nicht in URL-Parametern
   - Nur in localStorage (akzeptabel für Prototypen)
   - In Produktion: httpOnly Cookies oder Server-Session

---

**Viel Erfolg! 🚀**
