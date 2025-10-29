# Mistral AI Integration - Anleitung

## ✅ Erfolgreich implementiert!

Ihre KI-Bot-Plattform nutzt jetzt die **Mistral AI API** anstelle von OpenAI.

## 🔑 API-Schlüssel erhalten

1. Besuchen Sie: https://console.mistral.ai/
2. Erstellen Sie ein kostenloses Konto
3. Gehen Sie zu "API Keys" im Dashboard
4. Erstellen Sie einen neuen API-Schlüssel
5. Kopieren Sie den Schlüssel (beginnt normalerweise mit einem langen String)

## 🚀 Verwendung

### Schritt 1: API-Schlüssel eingeben
1. Öffnen Sie `index.html` in Ihrem Browser
2. Navigieren Sie zu "Meine Bots"
3. Bei "Website Bot" oder "WhatsApp Bot":
   - Geben Sie Ihren Mistral AI API-Schlüssel in das Eingabefeld ein
   - Klicken Sie auf "Speichern"
   - Klicken Sie auf "Validieren" um den Schlüssel zu testen

### Schritt 2: Modell auswählen
Verfügbare Mistral AI Modelle:
- **mistral-large-latest** - Beste Qualität, höchste Kosten
- **mistral-medium-latest** - Gutes Gleichgewicht
- **mistral-small-latest** - Schnell und kostengünstig
- **open-mistral-7b** - Kostenlos, Open Source
- **open-mixtral-8x7b** - Leistungsstark, Open Source
- **open-mixtral-8x22b** - Sehr leistungsstark, Open Source

### Schritt 3: Bot testen
1. Geben Sie eine Nachricht in das Chat-Fenster ein
2. Klicken Sie auf den Senden-Button
3. Der Bot antwortet mit Mistral AI!

## 🔧 Wichtige Änderungen

### API-Endpunkte
- ✅ Chat: `https://api.mistral.ai/v1/chat/completions`
- ✅ Models: `https://api.mistral.ai/v1/models`

### Fehlerbehandlung
Die Anwendung zeigt jetzt detaillierte Fehlermeldungen:
- **401**: Ungültiger API-Schlüssel
- **429**: Rate Limit erreicht
- **400**: Ungültige Anfrage

### Gespeicherte Daten
- API-Keys werden in `localStorage` unter dem Schlüssel `mistral_api_key` gespeichert
- Modellauswahl wird automatisch gespeichert

## 💡 Tipps

1. **API-Kosten**: Mistral AI bietet verschiedene Preismodelle. Prüfen Sie die Kosten unter https://mistral.ai/pricing/

2. **Rate Limits**: Beachten Sie die API-Limits Ihres Plans

3. **Modellauswahl**: 
   - Für Tests: `open-mistral-7b` oder `mistral-small-latest`
   - Für Produktion: `mistral-large-latest`

4. **Debugging**: Öffnen Sie die Browser-Konsole (F12) für detaillierte Logs

## 🐛 Fehlerbehebung

### "Ungültiger API-Schlüssel"
- Überprüfen Sie, ob der API-Key korrekt kopiert wurde
- Stellen Sie sicher, dass keine Leerzeichen am Anfang/Ende sind
- Prüfen Sie auf console.mistral.ai ob der Key noch aktiv ist

### "Fehler bei der API-Abfrage"
- Prüfen Sie Ihre Internetverbindung
- Öffnen Sie die Browser-Konsole für Details
- Stellen Sie sicher, dass Sie ein gültiges Modell ausgewählt haben

### Keine Antwort
- Warten Sie einen Moment (API kann 2-5 Sekunden brauchen)
- Prüfen Sie die Browser-Konsole auf Fehler
- Validieren Sie den API-Key erneut

## 📊 API-Anfrage Beispiel

```javascript
{
  "model": "mistral-large-latest",
  "messages": [
    {
      "role": "user",
      "content": "Hallo, wie geht es dir?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

## 🎯 Funktionen

- ✅ Chat-Interface mit Mistral AI
- ✅ API-Key Validierung
- ✅ Modellauswahl
- ✅ Fehlerbehandlung
- ✅ Lade-Indikatoren
- ✅ LocalStorage Persistenz
- ✅ Datei-Upload und Analyse (mit Mistral AI)
- ✅ WhatsApp Bot Integration
- ✅ Website Bot Integration

## 📝 Support

Bei Problemen:
1. Überprüfen Sie die Browser-Konsole (F12)
2. Stellen Sie sicher, dass Ihr API-Key gültig ist
3. Prüfen Sie Ihre Internetverbindung
4. Versuchen Sie ein anderes Modell

Viel Erfolg mit Ihrer Mistral AI Bot-Plattform! 🚀
