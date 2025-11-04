# 🚀 Google Gemini AI Integration - Anleitung

## ✅ Was wurde integriert?

Ihre KI-Bot-Plattform unterstützt jetzt **Google Gemini AI** als Alternative zu Mistral AI!

### 🎯 Hauptvorteile von Gemini:

1. **💰 Kostenlos:** 15 Anfragen/Minute im Free Tier (keine Kreditkarte nötig)
2. **🇪🇺 DSGVO-konform:** Server in Europa, ideal für deutsche Handwerker & Ärzte
3. **⚡ Schnell:** Gemini 1.5 Flash antwortet in unter 1 Sekunde
4. **🧠 Intelligent:** Gemini 1.5 Pro konkurriert mit GPT-4
5. **📅 Kalender-Zugriff:** Zugriff auf Google Calendar & Outlook Calendar (geplant)
6. **📁 Dateizugriff:** Liest hochgeladene Dateien (Wissensbasis)

---

## 📝 1. Google Gemini API Key erhalten

### Schritt 1: Google AI Studio besuchen
1. Gehe zu: https://aistudio.google.com/app/apikey
2. Melde dich mit deinem Google-Konto an
3. Klicke auf **"Create API Key"**

### Schritt 2: API Key kopieren
- Der API Key beginnt mit `AIza...`
- **Wichtig:** Speichere ihn sicher!

---

## 🔧 2. Gemini in der Plattform konfigurieren

### Für Website Bot:

1. **Navigiere zu "Meine Bots"** im Menü
2. Scrolle zum **Website Bot**
3. Finde den Bereich **"Google Gemini AI (Alternative zu Mistral)"**
4. Trage deinen API-Schlüssel ein
5. Klicke auf **"Validieren"** ✅
6. Wähle ein Modell:
   - **Gemini 1.5 Flash** (Schnell & Günstig - €0.35/1M Tokens) ⚡ *Empfohlen*
   - **Gemini 1.5 Pro** (Intelligenter - €7/1M Tokens) 🧠
   - **Gemini Pro** (Standard-Version)
7. Aktiviere den Toggle: **"🚀 Gemini statt Mistral verwenden"**

### Für WhatsApp Bot:

- Gleiche Schritte wie oben, aber im WhatsApp Bot Bereich

---

## 💬 3. Gemini verwenden

### Chat starten:
1. Gehe zum **Chat Bot** Menü
2. Der Bot verwendet jetzt **Gemini** statt Mistral
3. Du siehst beim Laden: "Denke nach (Gemini)..."

### Beispiel-Anfragen:

#### 📅 Kalender-Anfragen:
```
"Welche Termine habe ich morgen?"
"Zeig mir meine Termine nächste Woche"
"Was steht heute an?"
```

#### 📁 Wissensbasis-Anfragen:
```
"Was steht in dem Dokument über Preise?"
"Fasse die hochgeladene PDF zusammen"
"Welche Informationen gibt es zu [Thema]?"
```

#### 💼 Allgemeine Fragen:
```
"Erkläre mir [Thema]"
"Schreibe eine E-Mail an [Person]"
"Was ist der Unterschied zwischen [A] und [B]?"
```

---

## 🔄 4. Zwischen Mistral und Gemini wechseln

Du kannst jederzeit zwischen beiden APIs wechseln:

### Gemini aktivieren:
- Toggle-Switch: **EIN** ✅
- localStorage: `website_use_gemini = 'true'`

### Mistral verwenden:
- Toggle-Switch: **AUS** ❌
- localStorage: `website_use_gemini = 'false'`

---

## 📊 5. Technische Details

### API-Endpunkte:
- **Gemini Chat:** `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Modell-Info:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro`

### Verfügbare Modelle:
| Modell | Geschwindigkeit | Intelligenz | Kosten (1M Tokens) |
|--------|----------------|-------------|-------------------|
| gemini-1.5-flash | ⚡⚡⚡ Sehr schnell | 🧠🧠 Gut | €0.35 |
| gemini-1.5-pro | ⚡⚡ Schnell | 🧠🧠🧠 Sehr gut | €7.00 |
| gemini-pro | ⚡ Normal | 🧠 Okay | Kostenlos |

### Kalender-Integration:
- Gemini erkennt Kalender-Anfragen automatisch
- Format: `CALENDAR_REQUEST: [Zeitraum]`
- Unterstützte Zeiträume: `heute`, `morgen`, `nächste Woche`, `diese Woche`

### Dateizugriff:
- Gemini erhält automatisch Zugriff auf hochgeladene Dateien
- Unterstützte Formate: `.txt`, `.csv`, `.json`, `.md`, `.pdf` (als Text)
- Max. Dateigröße pro Datei: 8000 Zeichen im Prompt

---

## ⚠️ 6. Fehlerbehebung

### ❌ "Ungültiger API-Schlüssel"
**Lösung:**
- Prüfe ob der API-Key mit `AIza` beginnt
- Erstelle einen neuen Key auf https://aistudio.google.com/app/apikey
- Prüfe ob das Google-Konto aktiviert ist

### ❌ "Service tier capacity exceeded"
**Problem:** Mistral Free Tier überschritten
**Lösung:**
- Aktiviere Gemini (15 Anfragen/Minute kostenlos)
- Oder upgrade Mistral API auf Pay-as-you-go

### ❌ "Keine Antwort vom Bot"
**Lösung:**
1. Öffne Browser-Konsole (F12)
2. Prüfe ob Fehler angezeigt werden
3. Validiere den API-Key erneut
4. Prüfe ob Toggle aktiviert ist

### ❌ "Kalender-Anfragen funktionieren nicht"
**Lösung:**
1. Stelle sicher, dass Google Calendar API verbunden ist
2. Klicke auf "Mit Google Calendar verbinden"
3. Erlaube die OAuth-Berechtigung
4. Teste mit: "Welche Termine habe ich heute?"

---

## 🎯 7. Best Practices

### Für Handwerker-Websites:
```javascript
// Bot-Persönlichkeit:
"Du bist ein freundlicher Handwerker-Assistent. 
Beantworte Fragen zu Terminen, Leistungen und Preisen. 
Sei höflich und professionell."

// Wissensbasis hochladen:
- Preisliste.pdf
- Leistungskatalog.txt
- FAQ.md
```

### Für Arztpraxen:
```javascript
// Bot-Persönlichkeit:
"Du bist ein medizinischer Praxis-Assistent.
Beantworte Fragen zu Sprechzeiten, Terminvereinbarung und allgemeinen Infos.
WICHTIG: Gib keine medizinischen Diagnosen!"

// Wissensbasis hochladen:
- Sprechzeiten.txt
- Anfahrt.md
- Leistungen.pdf
```

---

## 💡 8. Kosten-Vergleich

| Szenario | Anfragen/Tag | Mistral Kosten | Gemini Kosten |
|----------|-------------|----------------|---------------|
| Kleiner Bot | 100 | €0.10 | **€0.00** ✅ |
| Mittelgroßer Bot | 1000 | €1.00 | €0.15 |
| Großer Bot | 10000 | €10.00 | €1.50 |

**Empfehlung:** Starte mit Gemini Free Tier!

---

## 🔐 9. Datenschutz (DSGVO)

### Gemini DSGVO-Konformität:
✅ **Ja**, Google Gemini ist DSGVO-konform, wenn:
1. EU-Server verwendet werden (automatisch)
2. Datenverarbeitungsvertrag (DPA) mit Google abgeschlossen wird
3. Nutzer über KI-Verwendung informiert werden

### Datenschutzerklärung-Hinweis:
```
"Diese Website verwendet Google Gemini AI zur Beantwortung von Anfragen.
Ihre Nachrichten werden an Google-Server in der EU übertragen.
Weitere Infos: [Link zur Datenschutzerklärung]"
```

---

## 📚 10. Weitere Ressourcen

- **Google AI Studio:** https://aistudio.google.com/
- **Gemini API Docs:** https://ai.google.dev/docs
- **Gemini Preise:** https://ai.google.dev/pricing
- **DSGVO-Infos:** https://cloud.google.com/terms/data-processing-addendum

---

## 🆘 Support

Bei Problemen:
1. Prüfe Browser-Konsole (F12 → Console)
2. Lese Fehlermeldungen genau
3. Teste mit Beispiel-Anfragen
4. Hard Refresh: **Strg+Shift+F5**

---

**Viel Erfolg mit Google Gemini AI! 🚀**

*Erstellt: 4. November 2025*
