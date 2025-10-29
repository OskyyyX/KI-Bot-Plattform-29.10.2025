# 📋 Google Calendar API - Quick Start

## ✅ Was Sie brauchen (aus Google Cloud Console):

1. **Google API Key** (Format: `AIzaSy...`)
2. **OAuth Client ID** (Format: `123456789-abc...apps.googleusercontent.com`)

---

## 🚀 Setup in 3 Minuten:

### **Schritt 1: Google Cloud Console**

Öffnen Sie: https://console.cloud.google.com/

1. **Projekt erstellen** (oder vorhandenes wählen)
2. **APIs & Services → Library**
   - Suchen: "Google Calendar API"
   - Klicken: "ENABLE"

3. **APIs & Services → Credentials**
   - Klicken: "+ CREATE CREDENTIALS" → "API key"
   - Kopieren Sie den **API Key** ✅

4. **OAuth Consent Screen konfigurieren**
   - Typ: "External"
   - App name: "KI-Bot Platform"
   - Support email: Ihre E-Mail
   - Speichern

5. **OAuth Client ID erstellen**
   - "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **"Web application"**
   - Authorized JavaScript origins:
     ```
     http://localhost
     http://localhost:5500
     ```
   - ❌ **Redirect URIs: LEER LASSEN!**
   - Kopieren Sie die **Client ID** ✅

---

### **Schritt 2: In Ihrer Plattform**

1. Öffnen Sie `index.html` im Browser
2. Gehen Sie zu: **Meine Bots → Website Bot**
3. Scrollen Sie zu: **🤖 Agent-Funktionen → Google Calendar API**
4. Toggle **AN** schalten
5. Eingeben:
   - **Feld 1**: Ihr API Key
   - **Feld 2**: Ihre Client ID
6. Klicken: **🔗 Mit Google verbinden**
7. Google Popup → Anmelden → **"Zulassen"**
8. Status: ✅ **"Erfolgreich verbunden!"**
9. Klicken: **💾 Speichern**

---

### **Schritt 3: Testen**

Im Chat fragen:

```
Zeige mir meine Termine für heute
```

```
Erstelle einen Termin morgen um 14 Uhr: Meeting
```

---

## 📖 Ausführliche Anleitung

Für eine **detaillierte Schritt-für-Schritt-Anleitung mit Screenshots** öffnen Sie:

👉 **`google-calendar-setup-guide.html`** (im Browser öffnen)

Oder in der Plattform auf den Link **"📖 Vollständige Setup-Anleitung öffnen"** klicken.

---

## 🔧 Technische Details

Ihre Implementierung nutzt die **offizielle Google-Methode**:

```javascript
// 1. Initialisierung mit API Key
await gapi.client.init({
    apiKey: apiKey,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
});

// 2. OAuth mit Client ID (Popup-Modus)
const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/calendar',
    ux_mode: 'popup'  // Kein Redirect nötig!
});

// 3. Zugriff anfordern
tokenClient.requestAccessToken({ prompt: 'consent' });
```

---

## ❌ Häufige Fehler

### **"invalid_request" im Popup**
✅ Lösung: Fügen Sie `http://localhost` zu "Authorized JavaScript origins" hinzu

### **"API key not valid"**
✅ Lösung: Aktivieren Sie die Google Calendar API in der Library

### **Popup wird blockiert**
✅ Lösung: Erlauben Sie Popups für `localhost` in Ihrem Browser

---

## 📚 Offizielle Dokumentation

- **Setup-Guide**: https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
- **Calendar API**: https://developers.google.com/calendar/api/v3/reference
- **OAuth 2.0**: https://developers.google.com/identity/protocols/oauth2

---

## ✅ Checkliste

- [ ] Google Cloud Projekt erstellt
- [ ] Calendar API aktiviert
- [ ] API Key erstellt und kopiert
- [ ] OAuth Consent Screen konfiguriert
- [ ] OAuth Client ID erstellt (Web application)
- [ ] JavaScript origins hinzugefügt (`http://localhost`)
- [ ] Keine Redirect URIs eingetragen
- [ ] API Key in Plattform eingegeben
- [ ] Client ID in Plattform eingegeben
- [ ] "Mit Google verbinden" erfolgreich
- [ ] Konfiguration gespeichert
- [ ] Chat-Test durchgeführt

---

**🎉 Viel Erfolg mit Ihrer Google Calendar Integration!**
