# 📚 Wissensbasis & Datei-Integration - Anleitung

## 🎯 Übersicht

Ihre KI-Bots können jetzt **direkt mit hochgeladenen Dateien arbeiten**! Die Bots analysieren die Dateien automatisch und beantworten Fragen basierend auf dem Inhalt.

---

## ✨ Funktionen

### 🤖 Automatische Wissensbasis-Integration
- ✅ **Alle hochgeladenen Dateien** werden automatisch in den Chat-Kontext eingebunden
- ✅ Der Bot **liest und versteht** den Inhalt Ihrer Dokumente
- ✅ **Intelligente Antworten** basierend auf den Dateiinhalten
- ✅ **Mehrere Dateien gleichzeitig** werden unterstützt

### 📊 Unterstützte Dateitypen
- 📄 **PDF-Dokumente** (Text wird extrahiert)
- 📝 **Textdateien** (.txt, .md, .csv)
- 📊 **Excel/CSV** (Daten und Termine)
- 📋 **Word-Dokumente** (.doc, .docx)
- 🔧 **JSON/XML** (Strukturierte Daten)

---

## 🚀 So funktioniert es

### 1️⃣ Dateien hochladen

**Schritt 1:** Gehen Sie zu "Meine Bots" → Wählen Sie einen Bot (Website oder WhatsApp)

**Schritt 2:** Scrollen Sie zum Bereich **"Wissensbasis"**

**Schritt 3:** Klicken Sie auf die **Drag & Drop Zone** oder ziehen Sie Dateien direkt hinein

**Schritt 4:** Warten Sie, bis alle Dateien hochgeladen sind (⚡ sehr schnell dank paralleler Verarbeitung!)

```
📁 Beispiel: termine.csv hochladen
✅ Datei wird sofort gelesen und gespeichert
✅ Inhalt wird für den Bot verfügbar gemacht
```

---

### 2️⃣ Bot mit Dateien testen

**Nach dem Upload sehen Sie:**
- 🟣 **Lila Banner** über dem Chat: "Bot hat Zugriff auf: termine.csv"
- 📊 Anzahl der verfügbaren Dateien
- 📝 Liste aller Dateinamen

**Jetzt können Sie Fragen stellen wie:**

#### Beispiel mit termine.csv:
```
👤 Du: "Welche Termine habe ich am 10. Oktober?"
🤖 Bot: "Am 10. Oktober 2025 haben Sie einen Termin:
        - 09:00-10:30: Vorstandssitzung
        - Ort: Konferenzraum A
        - Teilnehmer: Hans Müller, Anna Schmidt, Peter Weber
        - Status: Bestätigt"

👤 Du: "Zeige mir alle Termine dieser Woche"
🤖 Bot: [Listet alle Termine auf basierend auf der CSV-Datei]

👤 Du: "Wer nimmt am Sprint Planning teil?"
🤖 Bot: "Am Sprint Planning am 21. Oktober nehmen teil:
        - Scrum Team
        - Product Owner"
```

#### Beispiel mit Produktdokument (PDF):
```
👤 Du: "Was kostet unser Premium-Paket?"
🤖 Bot: [Zitiert aus dem PDF-Dokument]

👤 Du: "Welche Features sind im Basic-Plan enthalten?"
🤖 Bot: [Liste aus dem Dokument]
```

#### Beispiel mit Kundendaten (CSV):
```
👤 Du: "Wie viele Kunden haben wir in Berlin?"
🤖 Bot: [Analysiert die CSV und gibt Anzahl zurück]

👤 Du: "Zeige mir die Top 5 Kunden nach Umsatz"
🤖 Bot: [Sortiert und listet auf]
```

---

### 3️⃣ Dateien verwalten

**Analyse durchführen:**
- Klicken Sie auf **"Mit AI analysieren"** neben einer Datei
- Der Bot fasst den Inhalt automatisch zusammen
- Die Analyse wird unter der Datei angezeigt

**Dateien löschen:**
- Klicken Sie auf den **Papierkorb-Button** 🗑️
- Die Datei wird sofort entfernt
- Das Banner im Chat wird automatisch aktualisiert

---

## 🔧 Technische Details

### Wie der Bot die Dateien nutzt

1. **Upload**: Datei wird gelesen und Inhalt extrahiert
2. **Speicherung**: Inhalt wird im Browser gespeichert (localStorage)
3. **Integration**: Bei jeder Chat-Anfrage wird der Dateiinhalt an Mistral AI gesendet
4. **Kontext**: Der Bot erhält folgenden Prompt:

```
Du bist ein [Persönlichkeit des Bots].

📁 VERFÜGBARE WISSENSBASIS:
Du hast Zugriff auf folgende Dokumente und Dateien:

--- DOKUMENT 1: termine.csv ---
Dateityp: text/csv
Inhalt:
Datum,Uhrzeit,Termin,Beschreibung...
[Vollständiger Dateiinhalt]

💡 WICHTIG: Beantworte Fragen basierend auf diesen Dokumenten.
```

### Vorteile dieser Methode

✅ **Echtzeit-Zugriff**: Bot arbeitet immer mit aktuellen Daten
✅ **Mehrere Quellen**: Kombiniert Infos aus verschiedenen Dateien
✅ **Intelligente Suche**: Mistral AI findet relevante Informationen
✅ **Kontext-Bewusstsein**: Bot versteht Zusammenhänge zwischen Dateien

---

## 💡 Best Practices

### 📌 Dateiorganisation

**Empfohlen:**
- ✅ Separate Dateien für verschiedene Themen
- ✅ Klare Dateinamen (z.B. "Preisliste_2025.pdf", "FAQ_Deutsch.txt")
- ✅ Aktuelle Versionen verwenden
- ✅ Nicht zu viele Dateien gleichzeitig (max. 5-10 für beste Performance)

**Vermeiden:**
- ❌ Sehr große Dateien (über 5 MB)
- ❌ Duplikate
- ❌ Veraltete Informationen

### 🎯 Effektive Fragen stellen

**Gute Fragen:**
```
✅ "Welche Termine habe ich nächste Woche?"
✅ "Was steht in Abschnitt 3 des Dokuments?"
✅ "Fasse die wichtigsten Punkte zusammen"
✅ "Vergleiche Produkt A und Produkt B"
```

**Weniger effektiv:**
```
❌ "Erzähl mir alles" (zu allgemein)
❌ Fragen zu Infos, die nicht in den Dateien sind
```

### ⚡ Performance-Tipps

1. **Dateianzahl**: 3-5 Dateien sind ideal
2. **Dateigröße**: Unter 1 MB pro Datei für schnellste Antworten
3. **Format**: TXT und CSV sind am schnellsten zu verarbeiten
4. **Aktualisierung**: Löschen Sie alte Dateien, bevor Sie neue hochladen

---

## 🧪 Beispiel-Szenarien

### 📅 Szenario 1: Terminverwaltung
**Dateien:**
- `termine.csv` - Alle Termine
- `urlaubsplan.csv` - Urlaubszeiten

**Mögliche Fragen:**
- "Habe ich diese Woche Urlaub?"
- "Wann ist das nächste Team-Meeting?"
- "Zeige mir alle Termine im Oktober"

---

### 🛍️ Szenario 2: E-Commerce Support
**Dateien:**
- `produkte.csv` - Produktliste mit Preisen
- `versand.txt` - Versandbedingungen
- `faq.txt` - Häufige Fragen

**Mögliche Fragen:**
- "Was kostet das Produkt XYZ?"
- "Wie lange dauert der Versand nach Deutschland?"
- "Welche Zahlungsmethoden werden akzeptiert?"

---

### 📚 Szenario 3: Wissensdatenbank
**Dateien:**
- `handbuch.pdf` - Produkthandbuch
- `troubleshooting.txt` - Fehlerbehebung
- `updates.txt` - Changelog

**Mögliche Fragen:**
- "Wie installiere ich das Produkt?"
- "Was bedeutet Fehlercode 404?"
- "Was ist neu in Version 2.0?"

---

## 🎨 Visuelles Feedback

### Banner-Anzeige
```
┌─────────────────────────────────────────────┐
│ 🗄️  2 Dateien  Bot hat Zugriff auf: ...    │
└─────────────────────────────────────────────┘
```

**Bedeutung der Farben:**
- 🟣 **Lila Gradient**: Dateien sind aktiv und werden verwendet
- ⚪ **Kein Banner**: Keine Dateien hochgeladen
- 🟢 **Grüner Hintergrund**: Datei erfolgreich hochgeladen

---

## 🔍 Troubleshooting

### ❓ "Bot antwortet nicht auf meine Fragen zur Datei"

**Lösung:**
1. Überprüfen Sie, ob das Banner im Chat angezeigt wird
2. Öffnen Sie die Browser-Konsole (F12)
3. Sehen Sie: `📁 Bot verwendet X Datei(en): ...`?
4. Falls nicht: Datei erneut hochladen

### ❓ "Datei wird nicht hochgeladen"

**Lösung:**
- Überprüfen Sie die Dateigröße (max. 10 MB empfohlen)
- Unterstütztes Format? (txt, csv, pdf, json, xml)
- Browser-Konsole für Fehlermeldungen prüfen

### ❓ "Bot findet die Information nicht"

**Lösung:**
- Formulieren Sie die Frage konkreter
- Verwenden Sie Schlüsselwörter aus dem Dokument
- Fragen Sie: "Was steht in der Datei [Dateiname]?"

### ❓ "Zu langsame Antworten"

**Lösung:**
- Reduzieren Sie die Anzahl der Dateien
- Verwenden Sie kleinere Dateien
- Wählen Sie ein schnelleres Modell (Mistral Small)

---

## 📊 Kosten-Optimierung

### Token-Nutzung
Jede Datei wird bei **jeder Anfrage** an Mistral AI gesendet!

**Beispiel:**
- Kleine Datei (1 KB): ~250 Tokens
- Mittlere Datei (10 KB): ~2,500 Tokens
- Große Datei (100 KB): ~25,000 Tokens

**Tipp:** Nutzen Sie **Mistral Small** für Datei-basierte Chats (günstiger, immer noch sehr gut!)

---

## ✅ Checkliste

Bevor Sie mit Dateien arbeiten:

- [ ] ✅ Mistral AI API-Key eingegeben und validiert
- [ ] ✅ Bot-Persönlichkeit definiert
- [ ] ✅ Dateien hochgeladen (max. 5-10 Dateien)
- [ ] ✅ Banner im Chat wird angezeigt
- [ ] ✅ Test-Frage gestellt und Antwort erhalten
- [ ] ✅ Dateiinhalt ist relevant und aktuell

---

## 🎉 Beispiel: Vollständiger Workflow

### Schritt-für-Schritt mit termine.csv

1. **Upload**
   ```
   📁 Drag & Drop: termine.csv
   ⏱️ Upload: 0.5 Sekunden
   ✅ Erfolg: Datei bereit
   ```

2. **Überprüfung**
   ```
   Chat-Banner zeigt: "1 Datei - Bot hat Zugriff auf: termine.csv"
   ```

3. **Erste Frage**
   ```
   👤 "Welche Termine habe ich heute?"
   🤖 "Heute, am 28. Oktober 2025, haben Sie keine Termine laut der Datei."
   ```

4. **Detaillierte Frage**
   ```
   👤 "Was ist am 10. Oktober geplant?"
   🤖 "Am 10. Oktober 2025 um 09:00-10:30 haben Sie eine Vorstandssitzung..."
   ```

5. **Komplexe Analyse**
   ```
   👤 "Wie viele Meetings habe ich insgesamt im Oktober?"
   🤖 "Sie haben insgesamt 10 Termine im Oktober 2025."
   ```

---

## 🚀 Fortgeschrittene Nutzung

### Mehrere Dateien kombinieren

**Beispiel:**
```
Dateien:
- produkte.csv (Produktliste)
- lager.csv (Lagerbestand)

Frage: "Welche Produkte sind auf Lager und kosten unter 50€?"
Bot: Kombiniert Daten aus beiden Dateien!
```

### Datenanalyse

**Beispiel mit Verkaufsdaten:**
```
👤 "Berechne den Durchschnittsumsatz pro Kunde"
🤖 [Analysiert CSV und berechnet]

👤 "Zeige mir Trends der letzten 3 Monate"
🤖 [Interpretiert Zeitreihendaten]
```

---

## 📞 Support

**Bei Problemen:**
1. Überprüfen Sie die Browser-Konsole (F12)
2. Testen Sie mit einer kleineren Datei
3. Validieren Sie Ihren API-Key erneut
4. Prüfen Sie die Dokumentation: `README_MISTRAL.md`

**Weitere Hilfe:**
- `ANLEITUNG_PERSOENLICHKEIT.md` - Bot-Verhalten anpassen
- `DATEI_UPLOAD_INFO.md` - Upload-Optimierung
- `MODELLAUSWAHL_INFO.md` - Bestes Modell wählen

---

## 🎯 Zusammenfassung

✅ **Einfach**: Dateien hochladen → Bot kann sie nutzen
✅ **Automatisch**: Keine manuelle Konfiguration nötig
✅ **Intelligent**: Mistral AI versteht den Kontext
✅ **Flexibel**: Mehrere Dateien, verschiedene Formate
✅ **Schnell**: Parallele Verarbeitung, sofortige Antworten

**Ihr Bot ist jetzt ein vollwertiger Wissensassistent! 🤖📚**
