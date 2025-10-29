# 🤖 Agent-System: Google Calendar Integration

## 🎯 Übersicht

Ihr KI-Bot ist jetzt ein **intelligenter Agent**, der nicht nur chattet, sondern auch **Aktionen ausführen** kann! Die erste Integration ist **Google Calendar** - der Bot kann:

- ✅ **Termine erstellen** (automatisch im Google Kalender)
- ✅ **Termine abrufen** (Liste aller Termine in einem Zeitraum)
- ✅ **Intelligente Terminplanung** (versteht natürliche Sprache)

---

## 🚀 Setup: Google Calendar API konfigurieren

### Schritt 1: Google API Key erstellen

1. **Gehen Sie zu:** [Google Cloud Console](https://console.cloud.google.com/)
2. **Erstellen Sie ein neues Projekt** oder wählen Sie ein bestehendes
3. **Aktivieren Sie** die **Google Calendar API**:
   - Navigation → APIs & Services → Library
   - Suchen: "Google Calendar API"
   - Klicken auf "Enable"
4. **Erstellen Sie einen API-Key**:
   - APIs & Services → Credentials
   - "Create Credentials" → "API Key"
   - Kopieren Sie den Key (beginnt mit `AIzaSy...`)

### Schritt 2: API-Key in die Plattform eintragen

1. **Öffnen Sie:** "Meine Bots" → Website Bot oder WhatsApp Bot
2. **Scrollen Sie zu:** "🤖 Agent-Funktionen (API-Verbindungen)"
3. **Schalten Sie den Toggle** für "Google Calendar API" **EIN**
4. **Tragen Sie ein:**
   - **Google API Key**: Ihr API-Key (`AIzaSy...`)
   - **Calendar ID**: `primary` (für Hauptkalender) oder Ihre Gmail-Adresse
5. **Klicken Sie auf:** "Speichern"
6. **Bestätigung:** "✅ Konfiguration gespeichert!"

---

## 💬 Verwendung: Termine per Chat buchen

### Beispiel 1: Termin erstellen

```
👤 Sie: "Buche einen Termin für morgen um 14 Uhr mit dem Titel 'Meeting mit Team'"

🤖 Bot: "🤖 Führe Aktion aus: create_calendar_event..."
        "✅ Termin erfolgreich erstellt: Meeting mit Team"
        "🔗 Link: https://calendar.google.com/calendar/event?eid=..."
```

**Was passiert:**
1. Bot erkennt die Absicht (Termin buchen)
2. Bot nutzt `create_calendar_event` Tool
3. Termin wird im Google Calendar erstellt
4. Bot gibt Bestätigung mit Link

### Beispiel 2: Termine abrufen

```
👤 Sie: "Welche Termine habe ich diese Woche?"

🤖 Bot: "🤖 Führe Aktion aus: list_calendar_events..."
        "Du hast folgende Termine diese Woche:
         - Montag, 10:00: Team Meeting
         - Mittwoch, 14:00: Kundengespräch
         - Freitag, 16:00: Retrospektive"
```

### Beispiel 3: Komplexe Terminplanung

```
👤 Sie: "Buche ein Meeting mit anna@firma.de und peter@firma.de für nächsten Dienstag von 10 bis 11 Uhr zum Thema Quartalsplanung"

🤖 Bot: "🤖 Führe Aktion aus: create_calendar_event..."
        "✅ Termin erfolgreich erstellt: Quartalsplanung"
        "📧 Einladungen gesendet an: anna@firma.de, peter@firma.de"
```

---

## 🔧 Technische Details

### Wie das Agent-System funktioniert

```
┌──────────────┐
│  Benutzer    │ "Buche einen Termin"
└──────┬───────┘
       │
       v
┌──────────────┐
│ Mistral AI   │ Versteht Intent & Parameter
│   (Agent)    │ → Tool: create_calendar_event
└──────┬───────┘
       │
       v
┌──────────────┐
│ Agent System │ Führt Tool-Call aus
│  (JavaScript)│ → Google Calendar API
└──────┬───────┘
       │
       v
┌──────────────┐
│ Google API   │ Erstellt Termin
│   Calendar   │ → Rückgabe: Event-Link
└──────┬───────┘
       │
       v
┌──────────────┐
│  Benutzer    │ "✅ Termin erstellt!"
└──────────────┘
```

### Mistral AI Function Calling

Der Bot nutzt **Mistral AI's Function Calling** Feature:

```javascript
// Tools werden definiert
tools: [
    {
        type: 'function',
        function: {
            name: 'create_calendar_event',
            description: 'Erstellt einen neuen Termin',
            parameters: {
                title: 'Titel des Termins',
                startTime: 'Start-Zeit (ISO 8601)',
                endTime: 'End-Zeit (ISO 8601)',
                attendees: 'Teilnehmer (E-Mails)'
            }
        }
    }
]
```

**Mistral AI entscheidet automatisch:**
- Wann ein Tool genutzt werden soll
- Welche Parameter extrahiert werden müssen
- Wie die Antwort formuliert wird

---

## 📋 Verfügbare Agent-Funktionen

### 1. `create_calendar_event`
**Erstellt einen Termin im Google Calendar**

**Parameter:**
- `title` (String, Pflicht): Titel/Betreff des Termins
- `description` (String, Optional): Detaillierte Beschreibung
- `startTime` (String, Pflicht): Start-Zeit im ISO 8601 Format
  - Beispiel: `2025-10-30T14:00:00`
- `endTime` (String, Pflicht): End-Zeit im ISO 8601 Format
- `attendees` (Array, Optional): Liste der Teilnehmer
  - Format: `[{email: "user@example.com"}]`

**Rückgabe:**
```javascript
{
    success: true,
    eventId: "abc123...",
    htmlLink: "https://calendar.google.com/...",
    message: "Termin erfolgreich erstellt: Meeting"
}
```

### 2. `list_calendar_events`
**Listet alle Termine in einem Zeitraum auf**

**Parameter:**
- `timeMin` (String, Pflicht): Start des Zeitraums (ISO 8601)
- `timeMax` (String, Pflicht): Ende des Zeitraums (ISO 8601)

**Rückgabe:**
```javascript
[
    {
        summary: "Team Meeting",
        start: { dateTime: "2025-10-30T10:00:00" },
        end: { dateTime: "2025-10-30T11:00:00" }
    },
    ...
]
```

---

## 🎨 Natürliche Sprache verstehen

Der Bot versteht **verschiedene Formulierungen**:

### Termin erstellen:
- ✅ "Buche einen Termin morgen um 14 Uhr"
- ✅ "Erstelle ein Meeting für nächste Woche Montag 10:00"
- ✅ "Plane ein Gespräch mit Anna am 15. November um 15 Uhr"
- ✅ "Neuer Termin: Freitag 16:00-17:00 Projekttreffen"

### Termine abrufen:
- ✅ "Welche Termine habe ich heute?"
- ✅ "Zeige mir meine Meetings diese Woche"
- ✅ "Was steht im Kalender für nächsten Monat?"
- ✅ "Liste alle Termine im Oktober"

### Komplexe Anfragen:
- ✅ "Buche ein 2-stündiges Meeting mit team@firma.de morgen ab 10 Uhr"
- ✅ "Erstelle einen wiederkehrenden Termin jeden Montag um 9 Uhr"
- ✅ "Plane eine Videokonferenz für alle Teilnehmer aus der E-Mail"

---

## ⚙️ Konfiguration & Settings

### Calendar ID

**Was ist die Calendar ID?**
- `primary`: Ihr Hauptkalender (Standard)
- `ihre-email@gmail.com`: Spezifischer Kalender
- Kalender-ID aus Google Calendar Settings

**Wie finde ich meine Calendar ID?**
1. Öffnen Sie [Google Calendar](https://calendar.google.com)
2. Klicken Sie auf Einstellungen (⚙️)
3. Wählen Sie den gewünschten Kalender
4. Scrollen Sie zu "Kalender-ID"
5. Kopieren Sie die ID

### API-Key Sicherheit

**Best Practices:**
- ✅ Verwenden Sie API-Key-Einschränkungen in Google Cloud
- ✅ Beschränken Sie auf "Google Calendar API"
- ✅ Setzen Sie IP-Whitelisting (optional)
- ✅ Teilen Sie Ihren Key NIEMALS öffentlich

**Einschränkungen setzen:**
1. Google Cloud Console → Credentials
2. Klicken Sie auf Ihren API-Key
3. "API restrictions" → "Restrict key"
4. Wählen Sie: "Google Calendar API"
5. Speichern

---

## 🧪 Testing

### Test 1: Einfacher Termin
```
Chat-Input: "Buche einen Testtermin für heute 15 Uhr"

Erwartetes Ergebnis:
- Bot führt create_calendar_event aus
- Termin erscheint in Google Calendar
- Bestätigung mit Link
```

### Test 2: Termine abrufen
```
Chat-Input: "Zeige meine Termine für morgen"

Erwartetes Ergebnis:
- Bot führt list_calendar_events aus
- Liste aller Termine wird angezeigt
```

### Test 3: Termin mit Teilnehmern
```
Chat-Input: "Buche ein Meeting mit test@example.com morgen 10 Uhr"

Erwartetes Ergebnis:
- Termin wird erstellt
- E-Mail-Einladung an test@example.com
```

---

## 🔍 Troubleshooting

### ❌ "Google Calendar Agent ist nicht aktiviert"

**Lösung:**
1. Schalten Sie den Toggle "Google Calendar API" EIN
2. Speichern Sie die Konfiguration
3. Versuchen Sie es erneut

### ❌ "Google API Key fehlt"

**Lösung:**
1. Überprüfen Sie, ob Sie den API-Key eingegeben haben
2. Key muss mit `AIzaSy` beginnen
3. Keine Leerzeichen am Anfang/Ende

### ❌ "HTTP 403: Forbidden"

**Ursache:** API nicht aktiviert oder Key-Einschränkungen

**Lösung:**
1. Google Cloud Console → APIs & Services → Library
2. Suchen: "Google Calendar API"
3. Klicken auf "Enable"
4. Warten Sie 2-3 Minuten
5. Versuchen Sie erneut

### ❌ "HTTP 401: Unauthorized"

**Ursache:** Ungültiger API-Key

**Lösung:**
1. Überprüfen Sie den API-Key
2. Erstellen Sie einen neuen Key
3. Aktualisieren Sie die Konfiguration

### ❌ "HTTP 400: Bad Request"

**Ursache:** Ungültige Parameter (z.B. falsches Datumsformat)

**Lösung:**
- Der Bot sollte automatisch das richtige Format verwenden
- Falls nicht: Debuggen Sie die Console (F12)
- Überprüfen Sie die Tool-Call Parameter

---

## 💡 Best Practices

### 1. Klare Zeitangaben
```
✅ "Buche einen Termin morgen um 14:00 Uhr"
✅ "Erstelle ein Meeting am 15. November 2025 um 10:00"
❌ "Buche irgendwann einen Termin" (zu unspezifisch)
```

### 2. Vollständige Informationen
```
✅ "Buche 'Kundengespräch' von 14:00 bis 15:00 mit info@kunde.de"
❌ "Buche einen Termin" (fehlt: Was, Wann, Wie lange?)
```

### 3. Zeitzone beachten
- Standard: Europe/Berlin
- Bei anderen Zeitzonen: Explizit angeben

---

## 📊 Limits & Kosten

### Google Calendar API Limits
- **Kostenlos**: 1.000.000 Anfragen/Tag
- **Pro Benutzer**: 500 Anfragen/100 Sekunden

**Für normale Nutzung mehr als ausreichend!**

### Mistral AI Kosten
- Jeder Tool-Call = 1 API-Anfrage
- Empfohlen: Mistral Large (beste Function Calling Performance)
- Kosten: ~0.01€ pro Terminbuchung

---

## 🎯 Roadmap: Zukünftige Agent-Funktionen

### Geplante Integrationen:
- 📧 **E-Mail senden** (Gmail API)
- 📝 **Dokumente erstellen** (Google Docs API)
- 💬 **Nachrichten senden** (Slack, Teams)
- 🗄️ **Daten speichern** (Google Sheets API)
- 🔔 **Benachrichtigungen** (Push Notifications)

---

## ✅ Checkliste: Agent-System bereit?

- [ ] ✅ Google Cloud Projekt erstellt
- [ ] ✅ Google Calendar API aktiviert
- [ ] ✅ API-Key generiert und kopiert
- [ ] ✅ API-Key in Plattform eingetragen
- [ ] ✅ Calendar ID konfiguriert
- [ ] ✅ Toggle "Google Calendar API" aktiviert
- [ ] ✅ Konfiguration gespeichert
- [ ] ✅ Test-Termin erfolgreich erstellt
- [ ] ✅ Termine können abgerufen werden

---

## 🎉 Herzlichen Glückwunsch!

Ihr Bot ist jetzt ein **vollwertiger Agent** und kann:
- 🤖 Chatten & Fragen beantworten
- 📁 Dateien analysieren (Wissensbasis)
- 📅 Termine buchen (Google Calendar)
- 🚀 **Weitere Aktionen** (folgen bald!)

**Ihr KI-Bot wird immer mächtiger! 💪**

---

## 📞 Support

**Bei Problemen:**
1. Überprüfen Sie die Browser-Konsole (F12)
2. Testen Sie den API-Key direkt in Google Cloud
3. Prüfen Sie die Agent-Konfiguration
4. Schauen Sie in die Logs: `console.log`

**Weitere Dokumentation:**
- `README_MISTRAL.md` - Mistral AI Grundlagen
- `WISSENSBASIS_ANLEITUNG.md` - Datei-Integration
- `MODELLAUSWAHL_INFO.md` - Optimale Modelle
