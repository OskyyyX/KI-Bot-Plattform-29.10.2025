# ✅ Google Calendar Integration - 1000% Funktionsfähig

## 🎯 Komplett-Anleitung für sichere API-Verbindung

Die Google Calendar API benötigt **OAuth 2.0** mit **Client ID**, **Client Secret** und **API Key**. Folgen Sie dieser Anleitung exakt!

---

## 🚀 Setup: Google Cloud Console (10 Minuten)

### Schritt 1: Google Cloud Projekt erstellen

1. **Öffnen Sie:** [Google Cloud Console](https://console.cloud.google.com/)
2. Klicken Sie **"Projekt erstellen"**
3. **Name:** `KI-Bot-Calendar-Integration`
4. Klicken Sie **"Erstellen"**
5. Warten Sie 30 Sekunden

---

### Schritt 2: Google Calendar API aktivieren

1. **Menü** (☰) → **"APIs & Services"** → **"Library"**
2. Suchen Sie: **"Google Calendar API"**
3. Klicken Sie drauf
4. Klicken Sie **"ENABLE"** (Aktivieren)
5. Warten Sie 1 Minute

---

### Schritt 3: OAuth Consent Screen konfigurieren

**WICHTIG:** Dieser Schritt ist PFLICHT!

1. **Menü** (☰) → **"APIs & Services"** → **"OAuth consent screen"**
2. Wählen Sie: **"External"** (Extern)
3. Klicken Sie **"CREATE"**

**Formular ausfüllen:**
- **App name:** `KI-Bot Platform`
- **User support email:** Ihre E-Mail
- **App logo:** Optional (überspringen)
- **App domain:** `http://localhost` (für lokale Tests)
- **Developer contact information:** Ihre E-Mail
- Klicken Sie **"SAVE AND CONTINUE"**

**Scopes:**
- Klicken Sie **"ADD OR REMOVE SCOPES"**
- Suchen Sie: `calendar`
- Wählen Sie: **`https://www.googleapis.com/auth/calendar`**
- Klicken Sie **"UPDATE"**
- Klicken Sie **"SAVE AND CONTINUE"**

**Test users:**
- Klicken Sie **"+ ADD USERS"**
- Geben Sie Ihre Google E-Mail ein
- Klicken Sie **"ADD"**
- Klicken Sie **"SAVE AND CONTINUE"**

**Summary:**
- Klicken Sie **"BACK TO DASHBOARD"**

---

### Schritt 4: OAuth 2.0 Client ID erstellen

1. **Menü** (☰) → **"APIs & Services"** → **"Credentials"**
2. Klicken Sie **"+ CREATE CREDENTIALS"**
3. Wählen Sie: **"OAuth client ID"**

**Client ID konfigurieren:**
- **Application type:** **"Web application"**
- **Name:** `KI-Bot Web Client`

**Authorized JavaScript origins:**
- Klicken Sie **"+ ADD URI"**
- Tragen Sie ein: `http://localhost`
- (Optional) Fügen Sie Ihre Domain hinzu: `https://ihre-domain.com`

**Authorized redirect URIs:**
- Klicken Sie **"+ ADD URI"**
- Tragen Sie ein: `http://localhost`
- (Optional) Fügen Sie Ihre Domain hinzu: `https://ihre-domain.com/oauth/callback`

**WICHTIG:** Die Redirect URI muss **EXAKT** `http://localhost` sein (ohne Port!)

4. Klicken Sie **"CREATE"**

**Es erscheint ein Popup:**
```
OAuth client created
Your Client ID: 123456789-abc123xyz.apps.googleusercontent.com
Your Client Secret: GOCSPX-xxxxxxxxxxxxx
```

5. **KOPIEREN SIE BEIDE WERTE SOFORT!**
   - ✅ Client ID kopieren
   - ✅ Client Secret kopieren
6. Klicken Sie **"OK"**

---

### Schritt 5: API Key erstellen

1. Zurück zu **"Credentials"**
2. Klicken Sie **"+ CREATE CREDENTIALS"**
3. Wählen Sie: **"API key"**
4. **Kopieren Sie den API-Key:** `AIzaSyAbc123...`

**API Key einschränken (WICHTIG für Sicherheit):**
5. Klicken Sie auf den **Bleistift-Icon** (Edit) neben dem API Key
6. **Name:** `Calendar API Key`
7. **API restrictions:**
   - Wählen Sie: **"Restrict key"**
   - Aktivieren Sie nur: ✅ **"Google Calendar API"**
8. Klicken Sie **"SAVE"**

---

## 💻 Konfiguration in der KI-Bot-Plattform

### Jetzt haben Sie diese 3 Werte:

```
1. Client ID: 123456789-abc...apps.googleusercontent.com
2. Client Secret: GOCSPX-xxxxxxxxxxxxx
3. API Key: AIzaSyAbc123...
```

### Schritt 6: In die Plattform eintragen

1. **Öffnen Sie** `index.html` (Ihre KI-Bot-Plattform)
2. **Gehen Sie zu:** "Meine Bots" → Website Bot (oder WhatsApp Bot)
3. **Scrollen Sie zu:** "🤖 Agent-Funktionen (API-Verbindungen)"
4. **Schalten Sie den Toggle** für "Google Calendar API" **EIN**

**Sie sehen jetzt 4 Felder:**

```
┌─────────────────────────────────────────────────┐
│ Google Calendar API Verbindung                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1️⃣ OAuth Redirect URL (Automatisch):           │
│    http://localhost                             │
│    ↑ Wird vom System vorgegeben - nicht ändern │
│                                                 │
│ 2️⃣ Client ID *                                  │
│    [123456789-abc...apps.googleusercontent.com] │
│    ↑ Aus Google Cloud Console kopieren         │
│                                                 │
│ 3️⃣ Client Secret *                              │
│    [GOCSPX-xxxxxxxxxxxxx]                       │
│    ↑ Aus Google Cloud Console kopieren         │
│                                                 │
│ 4️⃣ Google API Key *                             │
│    [AIzaSy...........................]          │
│    ↑ API Key aus Google Cloud Console          │
│                                                 │
│ [🔗 Mit Google verbinden]  [💾 Speichern]      │
└─────────────────────────────────────────────────┘
```

**Füllen Sie aus:**
1. ✅ **OAuth Redirect URL:** Bereits eingetragen (`http://localhost`) - NICHT ÄNDERN!
2. ✅ **Client ID:** Fügen Sie Ihre Client ID ein
3. ✅ **Client Secret:** Fügen Sie Ihr Client Secret ein
4. ✅ **Google API Key:** Fügen Sie Ihren API Key ein

---

## 🔗 Verbindung herstellen

### Schritt 7: Mit Google verbinden

1. Klicken Sie **"🔗 Mit Google verbinden"**
2. **Ein Google-Login-Popup öffnet sich**
3. Wählen Sie Ihr Google-Konto
4. **Warnung:** "Google hasn't verified this app"
   - Klicken Sie **"Advanced"**
   - Klicken Sie **"Go to KI-Bot Platform (unsafe)"**
5. **Berechtigungen:** "KI-Bot Platform wants to access your Google Account"
   - ✅ **See, edit, share, and permanently delete all the calendars you can access using Google Calendar**
   - Klicken Sie **"Allow"** (Zulassen)
6. Das Popup schließt sich automatisch
7. ✅ **Bestätigung:** "Erfolgreich mit Google angemeldet!"

---

### Schritt 8: Speichern

1. Klicken Sie **"💾 Speichern"**
2. ✅ **Bestätigung:** "Konfiguration gespeichert!"
3. **Fertig!** 🎉

---

## 💬 Bot testen

### Test 1: Termin erstellen

**Chat-Input:**
```
Buche einen Testtermin für morgen um 14 Uhr mit dem Titel "Meeting mit dem Team"
```

**Erwartete Bot-Antwort:**
```
🤖 Führe Aktion aus: create_calendar_event...
✅ Termin erfolgreich erstellt: Meeting mit dem Team
📅 Datum: 29.10.2025, 14:00 Uhr
🔗 Link: https://calendar.google.com/calendar/event?eid=...
```

**Überprüfung:**
1. Öffnen Sie [Google Calendar](https://calendar.google.com)
2. Prüfen Sie, ob der Termin existiert
3. ✅ **Erfolgreich!**

---

### Test 2: Termine abrufen

**Chat-Input:**
```
Welche Termine habe ich diese Woche?
```

**Erwartete Bot-Antwort:**
```
🤖 Führe Aktion aus: list_calendar_events...
📅 Ihre Termine diese Woche:
1. Meeting mit dem Team - 29.10.2025, 14:00 Uhr
2. Zahnarzt - 30.10.2025, 10:30 Uhr
```

---

## 🔧 Troubleshooting

### ❌ "Bitte alle Felder ausfüllen"

**Problem:** Ein Feld ist leer.

**Lösung:**
- Überprüfen Sie, dass alle 3 Felder ausgefüllt sind:
  - ✅ Client ID
  - ✅ Client Secret  
  - ✅ API Key

---

### ❌ "redirect_uri_mismatch"

**Problem:** Die Redirect URI in Google Console stimmt nicht überein.

**Lösung:**
1. Google Cloud Console → **Credentials**
2. Bearbeiten Sie Ihre **OAuth 2.0 Client ID**
3. **Authorized redirect URIs:**
   - Fügen Sie hinzu: `http://localhost` (EXAKT!)
4. Speichern
5. Warten Sie 5 Minuten
6. Versuchen Sie erneut

---

### ❌ "Google hasn't verified this app"

**Das ist NORMAL!** Ihre App ist im Entwicklungsmodus.

**Lösung:**
1. Klicken Sie **"Advanced"**
2. Klicken Sie **"Go to KI-Bot Platform (unsafe)"**
3. Das ist sicher, weil es Ihre eigene App ist!

---

### ❌ "Access blocked: This app's request is invalid"

**Problem:** OAuth Consent Screen nicht korrekt konfiguriert.

**Lösung:**
1. Google Cloud Console → **OAuth consent screen**
2. **Publishing status:** Sollte "Testing" sein
3. **Test users:** Fügen Sie Ihre E-Mail hinzu
4. **Scopes:** Muss `https://www.googleapis.com/auth/calendar` enthalten
5. Speichern und erneut versuchen

---

### ❌ "Token abgelaufen"

**Problem:** Access Token läuft nach 1 Stunde ab.

**Lösung:**
- Klicken Sie einfach erneut auf **"🔗 Mit Google verbinden"**
- Kein Re-Login nötig (automatisch erneuert)

---

### ❌ "API key not valid"

**Problem:** API Key ist falsch oder nicht eingeschränkt.

**Lösung:**
1. Google Cloud Console → **Credentials**
2. Bearbeiten Sie den API Key
3. **API restrictions:**
   - ✅ **"Restrict key"**
   - ✅ Nur **"Google Calendar API"** aktiviert
4. Speichern
5. Warten Sie 2 Minuten
6. Neuen API Key kopieren und in Plattform eintragen

---

## 🔐 Sicherheit

### Wie werden die Daten gespeichert?

- ✅ **Client ID:** Im Browser localStorage (verschlüsselt)
- ✅ **Client Secret:** Im Browser localStorage (Base64-kodiert)
- ✅ **API Key:** Im Browser localStorage
- ✅ **Access Token:** NUR im JavaScript-Speicher (läuft nach 1h ab)

### Ist das sicher?

- ✅ **JA** für lokale Entwicklung
- ⚠️ **VORSICHT** für Produktionsumgebung:
  - Verwenden Sie einen Backend-Server
  - Speichern Sie Secrets serverseitig
  - Verwenden Sie HTTPS

---

## 📋 Checkliste: Alles korrekt?

- [ ] ✅ Google Cloud Projekt erstellt
- [ ] ✅ Google Calendar API aktiviert
- [ ] ✅ OAuth Consent Screen konfiguriert (External + Scopes + Test users)
- [ ] ✅ OAuth 2.0 Client ID erstellt
- [ ] ✅ Authorized JavaScript origins: `http://localhost`
- [ ] ✅ Authorized redirect URIs: `http://localhost`
- [ ] ✅ Client ID kopiert
- [ ] ✅ Client Secret kopiert
- [ ] ✅ API Key erstellt und eingeschränkt (nur Calendar API)
- [ ] ✅ Alle 3 Werte in Plattform eingetragen
- [ ] ✅ "Mit Google verbinden" erfolgreich
- [ ] ✅ "Speichern" geklickt
- [ ] ✅ Test-Termin erstellt und in Google Calendar sichtbar

---

## 🎉 Herzlichen Glückwunsch!

Ihr Bot kann jetzt **zu 1000% funktionsfähig** mit Google Calendar arbeiten:

- ✅ **Sichere OAuth 2.0 Authentifizierung**
- ✅ **Client ID + Client Secret + API Key**
- ✅ **Termine erstellen** direkt per Chat
- ✅ **Termine abrufen** mit natürlicher Sprache
- ✅ **Teilnehmer einladen** automatisch
- ✅ **Erinnerungen setzen** (E-Mail & Popup)

**Ihr intelligenter Agent ist einsatzbereit! 🚀**

Die Google Calendar API benötigt **OAuth 2.0** statt einem einfachen API-Key. Ich habe das System jetzt korrekt implementiert!

---

## 🚀 Setup: So richten Sie es ein (5 Schritte)

### Schritt 1: Google Cloud Projekt erstellen

1. Gehen Sie zu: [Google Cloud Console](https://console.cloud.google.com/)
2. Klicken Sie auf **"Projekt erstellen"**
3. Name: z.B. "KI-Bot-Calendar"
4. Klicken Sie **"Erstellen"**

---

### Schritt 2: Google Calendar API aktivieren

1. In der Google Cloud Console → **"APIs & Services"** → **"Library"**
2. Suchen Sie: **"Google Calendar API"**
3. Klicken Sie auf **"Google Calendar API"**
4. Klicken Sie **"ENABLE"** (Aktivieren)
5. Warten Sie 1-2 Minuten

---

### Schritt 3: OAuth 2.0 Client ID erstellen

1. **"APIs & Services"** → **"Credentials"** (Anmeldedaten)
2. Klicken Sie **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

**Consent Screen konfigurieren (falls noch nicht gemacht):**
- Klicken Sie **"CONFIGURE CONSENT SCREEN"**
- Wählen Sie: **"External"** (Extern)
- App-Name: `KI-Bot Platform`
- User support email: Ihre E-Mail
- Developer contact: Ihre E-Mail
- Klicken Sie **"SAVE AND CONTINUE"**
- Scopes: Überspringen → **"SAVE AND CONTINUE"**
- Test users: Optional → **"SAVE AND CONTINUE"**
- Summary: **"BACK TO DASHBOARD"**

**OAuth Client erstellen:**
- Zurück zu **"Credentials"** → **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
- Application type: **"Web application"**
- Name: `KI-Bot Web Client`
- **Authorized JavaScript origins:**
  - Klicken Sie **"+ ADD URI"**
  - Tragen Sie ein: `http://localhost` (für lokale Tests)
  - Klicken Sie **"+ ADD URI"**
  - Tragen Sie ein: Ihre Domain (falls online)
- **Authorized redirect URIs:**
  - Klicken Sie **"+ ADD URI"**
  - Tragen Sie ein: `http://localhost`
- Klicken Sie **"CREATE"**

**Client ID kopieren:**
- Es erscheint: "OAuth client created"
- Kopieren Sie die **"Client ID"**
  - Format: `123456789-abc123xyz.apps.googleusercontent.com`
- Klicken Sie **"OK"**

---

### Schritt 4: API Key erstellen (für Discovery Doc)

1. Zurück zu **"Credentials"**
2. Klicken Sie **"+ CREATE CREDENTIALS"** → **"API key"**
3. Kopieren Sie den API-Key
   - Format: `AIzaSyAbc123...`
4. **Wichtig:** Klicken Sie auf **"RESTRICT KEY"**
5. **API restrictions:**
   - Wählen Sie **"Restrict key"**
   - Aktivieren Sie nur: **"Google Calendar API"**
6. Klicken Sie **"SAVE"**

---

### Schritt 5: Konfiguration in der Plattform

1. **Öffnen Sie** Ihre KI-Bot-Plattform (`index.html`)
2. **Gehen Sie zu:** "Meine Bots" → Website Bot (oder WhatsApp Bot)
3. **Scrollen Sie zu:** "🤖 Agent-Funktionen (API-Verbindungen)"
4. **Schalten Sie den Toggle** für "Google Calendar API" **EIN**

**Tragen Sie ein:**
- **Google OAuth 2.0 Client ID**: `123456789-abc123xyz.apps.googleusercontent.com`
- **Google API Key**: `AIzaSyAbc123...`

5. Klicken Sie **"Speichern"**
6. Klicken Sie **"Mit Google anmelden"**

**Was passiert:**
- Ein Google-Login-Fenster öffnet sich
- Melden Sie sich mit Ihrem Google-Konto an
- Erlauben Sie den Zugriff auf Ihren Kalender
- Fenster schließt sich automatisch
- ✅ Bestätigung: "Erfolgreich mit Google angemeldet!"

---

## 💬 Jetzt testen!

### Test 1: Termin erstellen

```
Chat-Input: "Buche einen Testtermin für morgen um 14 Uhr mit dem Titel 'KI-Bot Test'"

Erwartete Antwort:
🤖 Führe Aktion aus: create_calendar_event...
✅ Termin erfolgreich erstellt: KI-Bot Test
🔗 Link: https://calendar.google.com/calendar/event?eid=...
```

**Überprüfung:**
1. Öffnen Sie [Google Calendar](https://calendar.google.com)
2. Schauen Sie, ob der Termin erscheint
3. ✅ Erfolgreich!

---

### Test 2: Termine abrufen

```
Chat-Input: "Welche Termine habe ich diese Woche?"

Erwartete Antwort:
🤖 Führe Aktion aus: list_calendar_events...
[Liste Ihrer Termine]
```

---

## 🔧 Troubleshooting

### ❌ "Bitte melden Sie sich zuerst mit Google an"

**Lösung:**
1. Klicken Sie auf **"Mit Google anmelden"**
2. Erlauben Sie den Zugriff im Popup-Fenster
3. Warten Sie auf die Bestätigung
4. Versuchen Sie erneut

---

### ❌ "Popup-Blocker verhindert Login"

**Lösung:**
1. Erlauben Sie Popups für Ihre Seite
2. Browser-Einstellungen → Popups und Weiterleitungen
3. Fügen Sie Ihre Domain/localhost zur Whitelist hinzu
4. Aktualisieren Sie die Seite (F5)
5. Klicken Sie erneut auf "Mit Google anmelden"

---

### ❌ "redirect_uri_mismatch"

**Lösung:**
1. Google Cloud Console → Credentials
2. Bearbeiten Sie Ihre OAuth 2.0 Client ID
3. **Authorized JavaScript origins:**
   - Fügen Sie hinzu: `http://localhost`
   - Fügen Sie hinzu: Ihre aktuelle URL (z.B. `file://` NICHT verwenden!)
4. **Authorized redirect URIs:**
   - Fügen Sie hinzu: `http://localhost`
5. Speichern
6. Warten Sie 5 Minuten
7. Versuchen Sie erneut

---

### ❌ "Access blocked: This app's request is invalid"

**Lösung:**
1. Google Cloud Console → OAuth consent screen
2. **Publishing status:** Klicken Sie **"PUBLISH APP"**
3. Bestätigen Sie die Veröffentlichung
4. ODER: Fügen Sie Ihre E-Mail als **"Test user"** hinzu
5. Versuchen Sie erneut

---

### ❌ Token abgelaufen

**Was passiert:**
- Nach ca. 1 Stunde läuft der Access Token ab
- Sie erhalten: "Token abgelaufen oder nicht vorhanden"

**Lösung:**
- Klicken Sie einfach erneut auf **"Mit Google anmelden"**
- Kein Re-Login nötig (Auto-Refresh wenn bereits angemeldet)

---

## 🎯 Wie es funktioniert

### OAuth 2.0 Flow

```
1. Benutzer klickt "Mit Google anmelden"
   ↓
2. Google-Login-Fenster öffnet sich
   ↓
3. Benutzer erlaubt Zugriff auf Calendar
   ↓
4. Google gibt Access Token zurück
   ↓
5. Token wird in JavaScript gespeichert
   ↓
6. Alle API-Calls nutzen diesen Token
```

### Sicherheit

- ✅ **OAuth 2.0**: Sicherster Google-Login-Mechanismus
- ✅ **Access Token**: Nur im Browser gespeichert (nicht auf Server)
- ✅ **Automatischer Ablauf**: Token läuft nach 1 Stunde ab
- ✅ **Re-Auth**: Einfacher Klick zum erneuten Anmelden
- ✅ **API Restrictions**: Key nur für Calendar API nutzbar

---

## 📋 Checkliste: Alles richtig eingerichtet?

- [ ] ✅ Google Cloud Projekt erstellt
- [ ] ✅ Google Calendar API aktiviert
- [ ] ✅ OAuth 2.0 Consent Screen konfiguriert
- [ ] ✅ OAuth 2.0 Client ID erstellt
- [ ] ✅ Authorized JavaScript origins gesetzt (`http://localhost`)
- [ ] ✅ API Key erstellt und eingeschränkt
- [ ] ✅ Client ID in Plattform eingetragen
- [ ] ✅ API Key in Plattform eingetragen
- [ ] ✅ Konfiguration gespeichert
- [ ] ✅ "Mit Google anmelden" erfolgreich
- [ ] ✅ Test-Termin erstellt und in Google Calendar sichtbar

---

## 🎉 Herzlichen Glückwunsch!

Ihr Bot kann jetzt **zu 100% funktionsfähig** mit Google Calendar arbeiten:

- ✅ **Sichere OAuth 2.0 Authentifizierung**
- ✅ **Termine erstellen** direkt per Chat
- ✅ **Termine abrufen** mit natürlicher Sprache
- ✅ **Teilnehmer einladen** automatisch
- ✅ **Erinnerungen setzen** (E-Mail & Popup)

**Ihr intelligenter Agent ist einsatzbereit! 🚀**
