# 📅 Google Calendar API - Vollständige Einrichtungsanleitung

## ✅ Überblick: Was ist implementiert?

Ihre Plattform nutzt die **offizielle Google-Methode** mit:
- ✅ **API Key** (für `gapi.client.init()`)
- ✅ **OAuth Client ID** (für Benutzer-Authentifizierung)
- ✅ **Popup-basierter OAuth-Flow** (kein Redirect erforderlich)
- ✅ **Discovery Document** für automatische API-Erkennung

---

## 🚀 Schritt-für-Schritt Einrichtung

### **SCHRITT 1: Google Cloud Console Projekt erstellen**

1. Gehen Sie zu: https://console.cloud.google.com/
2. Klicken Sie auf **"Projekt erstellen"** oder wählen Sie ein vorhandenes Projekt
3. Geben Sie einen Projektnamen ein (z.B. "KI-Bot-Plattform")
4. Klicken Sie auf **"Erstellen"**

---

### **SCHRITT 2: Google Calendar API aktivieren**

1. Navigieren Sie zu: **APIs & Services → Library**
2. Suchen Sie nach **"Google Calendar API"**
3. Klicken Sie auf **"Google Calendar API"**
4. Klicken Sie auf **"ENABLE"** (Aktivieren)

---

### **SCHRITT 3: API Key erstellen** ⭐ (Feld 1 in Ihrer Plattform)

1. Gehen Sie zu: **APIs & Services → Credentials**
2. Klicken Sie auf **"+ CREATE CREDENTIALS"**
3. Wählen Sie **"API key"**
4. Der API Key wird angezeigt (Format: `AIzaSy...`)
5. **WICHTIG**: Klicken Sie auf **"Edit API key"** und konfigurieren Sie:

   **API-Einschränkungen (empfohlen):**
   - **Application restrictions**: None (für Entwicklung)
   - **API restrictions**: Wählen Sie "Restrict key" und wählen Sie nur **"Google Calendar API"**

6. Klicken Sie auf **"Save"**
7. **Kopieren Sie den API Key** (Sie benötigen ihn später!)

**Beispiel API Key:**
```
AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI
```

---

### **SCHRITT 4: OAuth Client ID erstellen** ⭐ (Feld 2 in Ihrer Plattform)

1. Gehen Sie wieder zu: **APIs & Services → Credentials**
2. Klicken Sie auf **"+ CREATE CREDENTIALS"**
3. Wählen Sie **"OAuth client ID"**

**Falls OAuth-Zustimmungsbildschirm noch nicht konfiguriert:**
   - Klicken Sie auf **"CONFIGURE CONSENT SCREEN"**
   - Wählen Sie **"External"** (für alle Gmail-Nutzer)
   - Klicken Sie auf **"CREATE"**
   - Füllen Sie aus:
     - **App name**: KI-Bot Platform
     - **User support email**: Ihre E-Mail
     - **Developer contact**: Ihre E-Mail
   - Klicken Sie auf **"SAVE AND CONTINUE"**
   - Bei "Scopes": Klicken Sie einfach **"SAVE AND CONTINUE"**
   - Bei "Test users": Klicken Sie **"SAVE AND CONTINUE"**
   - Klicken Sie auf **"BACK TO DASHBOARD"**

**Jetzt OAuth Client ID erstellen:**

4. Klicken Sie erneut auf **"+ CREATE CREDENTIALS" → "OAuth client ID"**
5. Wählen Sie **Application type**: **"Web application"**
6. Geben Sie einen Namen ein (z.B. "KI-Bot Web Client")

7. **Autorisierte JavaScript-Quellen** (URIs):
   - Klicken Sie auf **"+ ADD URI"**
   - Für **lokale Entwicklung**:
     ```
     http://localhost
     http://localhost:5500
     http://localhost:3000
     http://127.0.0.1
     ```
   - Für **Produktion** (später):
     ```
     https://ihre-domain.com
     ```

8. **Autorisierte Weiterleitungs-URIs**: **LEER LASSEN** ✅
   - ⚠️ **Wichtig**: Bei Popup-Modus (ux_mode: 'popup') sind KEINE Redirect URIs erforderlich!
   - Ihre Implementierung nutzt bereits `ux_mode: 'popup'` ✅

9. Klicken Sie auf **"CREATE"**

10. **Kopieren Sie die Client ID** (Format: `123456789-abc...apps.googleusercontent.com`)

**Beispiel Client ID:**
```
123456789-abc1de2fghij3klmno4pqr5st.apps.googleusercontent.com
```

---

### **SCHRITT 5: Client Secret (OPTIONAL - NICHT NÖTIG!)** ❌

- ⚠️ **Sie benötigen KEIN Client Secret** für Ihre Implementierung!
- Ihre Plattform nutzt den **Implicit Flow** (nur API Key + Client ID)
- Client Secret ist nur für **Server-seitige** Anwendungen nötig

---

### **SCHRITT 6: Content Security Policy (CSP) - Falls vorhanden**

Falls Ihre HTML-Datei oder Server CSP-Header verwenden, fügen Sie hinzu:

```html
<meta http-equiv="Content-Security-Policy" content="
  script-src 'self' https://apis.google.com https://accounts.google.com/gsi/client;
  frame-src 'self' https://accounts.google.com/gsi/;
  connect-src 'self' https://accounts.google.com/gsi/;
  style-src 'self' https://accounts.google.com/gsi/style;
">
```

**Aktuell**: Ihre `index.html` hat **keine CSP** → Kein Handlungsbedarf ✅

---

## 💻 In Ihrer Plattform verwenden

### **1. Öffnen Sie Ihre Plattform**

```
Datei: index.html (im Browser öffnen)
```

### **2. Navigieren Sie zu "Meine Bots" → "Website Bot"**

### **3. Scrollen Sie zu "🤖 Agent-Funktionen" → "Google Calendar API"**

### **4. Toggle aktivieren** (Schieberegler auf ON)

### **5. Geben Sie Ihre Credentials ein:**

**Feld 1: Google API Key**
```
AIzaSy... (aus Schritt 3)
```

**Feld 2: OAuth Client ID**
```
123456789-abc...apps.googleusercontent.com (aus Schritt 4)
```

### **6. Klicken Sie auf "🔗 Mit Google verbinden"**

- Ein Popup-Fenster öffnet sich
- Melden Sie sich mit Ihrem Google-Konto an
- Klicken Sie auf **"Zulassen"** / **"Allow"**
- Popup schließt sich automatisch
- Sie sehen: ✅ **"Erfolgreich mit Google Calendar verbunden!"**

### **7. Speichern Sie die Konfiguration**

- Klicken Sie auf **"💾 Speichern"**

---

## 🧪 Testen Sie die Verbindung

### **Im Chat fragen:**

```
Zeige mir meine Termine für heute
```

```
Erstelle einen Termin morgen um 14 Uhr: Besprechung mit Team
```

### **Erwartetes Verhalten:**

✅ Bot listet Ihre Google Calendar Termine auf  
✅ Bot erstellt neue Termine in Ihrem Kalender  
✅ Events erscheinen in Google Calendar (calendar.google.com)

---

## 🔧 Technische Details: Was passiert im Hintergrund?

### **Initialisierung (app.js → initializeGoogleAuth)**

```javascript
// 1. Lade gapi.client
gapi.load('client', callback);

// 2. Initialisiere mit API Key + Discovery Doc
await gapi.client.init({
    apiKey: apiKey,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
});

// 3. Lade Calendar API
await gapi.client.load('calendar', 'v3');

// 4. Erstelle OAuth Token Client
const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/calendar',
    ux_mode: 'popup',  // ← KEIN REDIRECT!
    callback: (response) => {
        gapi.client.setToken({ access_token: response.access_token });
    }
});

// 5. Starte OAuth Popup
tokenClient.requestAccessToken({ prompt: 'consent' });
```

### **API-Aufrufe**

```javascript
// Events abrufen
const response = await gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: '2025-10-29T00:00:00Z',
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
});

// Event erstellen
await gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: {
        summary: 'Meeting',
        start: { dateTime: '2025-10-30T14:00:00+01:00' },
        end: { dateTime: '2025-10-30T15:00:00+01:00' }
    }
});
```

---

## ❌ Häufige Fehler & Lösungen

### **Fehler: "invalid_request" (OAuth Popup)**

**Ursache**: Falsche Client ID oder fehlende JavaScript-Quellen

**Lösung**:
1. Prüfen Sie die Client ID (kopiert ohne Leerzeichen?)
2. Gehen Sie zu Google Console → Credentials → Ihre OAuth Client ID
3. Unter "Authorized JavaScript origins": Fügen Sie `http://localhost` hinzu
4. Klicken Sie auf "Save"
5. Warten Sie 5 Minuten (Google-Cache)
6. Versuchen Sie erneut

---

### **Fehler: "API key not valid"**

**Ursache**: API Key falsch oder Calendar API nicht aktiviert

**Lösung**:
1. Prüfen Sie den API Key (kopiert ohne Leerzeichen?)
2. Google Console → APIs & Services → Library
3. Suchen Sie "Google Calendar API"
4. Klicken Sie auf "ENABLE" falls nicht aktiviert
5. Warten Sie 2-3 Minuten

---

### **Fehler: "Google APIs werden noch geladen..."**

**Ursache**: Google-Bibliotheken noch nicht vollständig geladen

**Lösung**:
1. Warten Sie 5-10 Sekunden nach Seitenaufruf
2. Laden Sie die Seite neu (F5)
3. Prüfen Sie Browser-Konsole (F12) auf Script-Fehler
4. Prüfen Sie Internet-Verbindung

---

### **Fehler: Popup wird blockiert**

**Ursache**: Browser blockiert Popups

**Lösung**:
1. Klicken Sie in der Adressleiste auf das **Popup-Symbol** 🚫
2. Wählen Sie **"Popups von dieser Website immer zulassen"**
3. Versuchen Sie erneut

---

## 🔒 Sicherheitshinweise

### **API Key sichtbar im Browser**

⚠️ **API Keys sind in Client-seitigen Apps immer sichtbar!**

**Schutzmaßnahmen:**

1. **API-Einschränkungen** (in Google Console):
   - Wählen Sie "Restrict key"
   - Aktivieren Sie nur "Google Calendar API"

2. **Application restrictions** (optional):
   - Wählen Sie "HTTP referrers"
   - Fügen Sie Ihre Domain hinzu (z.B. `https://ihre-domain.com/*`)

3. **Quotas überwachen**:
   - Google Console → APIs & Services → Dashboard
   - Prüfen Sie regelmäßig die Nutzung

### **OAuth Token**

✅ **Tokens werden NICHT im localStorage gespeichert**  
✅ **Tokens sind nur in-memory** (laufen nach 1 Stunde ab)  
✅ **Nutzer muss bei jedem Seitenaufruf neu autorisieren** (sichere Methode)

---

## 📊 Testen: Vollständiger Workflow

### **Test 1: Events auflisten**

1. Chat öffnen
2. Eingeben: `Zeige mir meine Termine für heute`
3. Bot sollte antworten: Liste Ihrer Google Calendar Events

### **Test 2: Event erstellen**

1. Chat öffnen
2. Eingeben: `Erstelle einen Termin morgen um 15 Uhr: Zahnarzt`
3. Bot sollte antworten: `✅ Termin erstellt: Zahnarzt am ...`
4. Prüfen Sie in Google Calendar: Event sollte sichtbar sein

### **Test 3: Zeitraum-Abfragen**

1. Chat: `Zeige Termine nächste Woche`
2. Chat: `Habe ich am Freitag etwas vor?`
3. Bot nutzt Mistral AI Function Calling + Google Calendar API

---

## 🎯 Checkliste: Ist alles richtig konfiguriert?

- [ ] Google Cloud Projekt erstellt
- [ ] Google Calendar API aktiviert (Enable geklickt)
- [ ] API Key erstellt (AIzaSy...)
- [ ] API Key eingeschränkt auf "Google Calendar API"
- [ ] OAuth Consent Screen konfiguriert
- [ ] OAuth Client ID erstellt (Typ: Web application)
- [ ] JavaScript origins hinzugefügt (http://localhost)
- [ ] KEINE Redirect URIs (bei Popup-Modus)
- [ ] API Key in Plattform eingegeben
- [ ] Client ID in Plattform eingegeben
- [ ] Toggle aktiviert
- [ ] "Mit Google verbinden" geklickt
- [ ] Popup erschienen und "Zulassen" geklickt
- [ ] Status: "✅ Erfolgreich verbunden"
- [ ] Konfiguration gespeichert
- [ ] Chat-Test durchgeführt

---

## 📚 Offizielle Dokumentation

- **Google Identity Services**: https://developers.google.com/identity/gsi/web/guides/overview
- **Google Calendar API**: https://developers.google.com/calendar/api/v3/reference
- **OAuth 2.0**: https://developers.google.com/identity/protocols/oauth2
- **JavaScript Quickstart**: https://developers.google.com/calendar/api/quickstart/js

---

## 🆘 Support

Bei weiteren Problemen:

1. **Browser-Konsole prüfen** (F12 → Console Tab)
2. **Network Tab prüfen** (F12 → Network Tab) für API-Fehler
3. **Google Console Logs** prüfen (Cloud Console → Logging)

---

**Viel Erfolg! 🚀**
