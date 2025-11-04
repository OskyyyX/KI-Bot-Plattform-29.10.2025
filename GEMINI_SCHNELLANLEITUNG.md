# 🚀 Gemini Integration - Schnellanleitung

## ✅ Was wurde vereinfacht?

**ALLES in EINEM Dropdown!** Keine extra Bereiche mehr.

---

## 📝 So verwendest du Mistral ODER Gemini:

### 1️⃣ Modell auswählen

Im Dropdown **"KI-Modell auswählen"** siehst du jetzt:

```
🔵 Mistral AI Modelle
  - Mistral Large
  - Mistral Medium
  - Mistral Small
  - Open Mistral 7B
  - Open Mixtral 8x7B
  - Open Mixtral 8x22B

🟢 Google Gemini Modelle (Kostenlos)
  - Gemini 1.5 Flash ⚡ (Schnell - €0.35/1M)
  - Gemini 1.5 Pro 🧠 (Intelligent - €7/1M)
  - Gemini Pro (Standard)
```

### 2️⃣ API-Schlüssel eingeben

**DAS LABEL ÄNDERT SICH AUTOMATISCH!**

- Wählst du **Mistral** → Label: "Mistral AI API-Schlüssel"
- Wählst du **Gemini** → Label: "Google Gemini API-Schlüssel"

### 3️⃣ Validieren & Speichern

Klicke auf **"Validieren"** - das System erkennt automatisch:
- ✅ Mistral API → testet mit `api.mistral.ai`
- ✅ Gemini API → testet mit `generativelanguage.googleapis.com`

---

## 💡 Beispiel-Workflow

### Für Mistral:
1. Wähle **"Mistral Large"** im Dropdown
2. Gib deinen Mistral API-Key ein
3. Klicke **"Validieren"**
4. Klicke **"Speichern"**
5. ✅ **FERTIG!**

### Für Gemini:
1. Wähle **"Gemini 1.5 Flash"** im Dropdown
2. Gib deinen Gemini API-Key ein (beginnt mit `AIza...`)
3. Klicke **"Validieren"**
4. Klicke **"Speichern"**
5. ✅ **FERTIG!**

---

## 🔄 Zwischen Mistral und Gemini wechseln

**SO EINFACH:**

1. Wähle ein anderes Modell im Dropdown
2. Gib den passenden API-Key ein
3. Klicke "Validieren"
4. ✅ **System wechselt automatisch!**

---

## 🎯 Vorteile der neuen Integration

| Feature | Status |
|---------|--------|
| Ein Dropdown für alle Modelle | ✅ |
| Automatische API-Erkennung | ✅ |
| Gespeicherte API-Keys laden | ✅ |
| Label ändert sich automatisch | ✅ |
| Keine extra Bereiche | ✅ |
| 100% funktionsfähig | ✅ |

---

## 🔐 API-Keys erhalten

### Mistral AI:
1. Gehe zu: https://console.mistral.ai/
2. Registriere dich
3. Erstelle API-Key
4. Kopiere Key (beginnt mit `...`)

### Google Gemini:
1. Gehe zu: https://aistudio.google.com/app/apikey
2. Melde dich mit Google an
3. Klicke "Create API Key"
4. Kopiere Key (beginnt mit `AIza...`)

---

## ⚙️ Technische Details

### Automatische Erkennung:
```javascript
const isGemini = selectedModel.startsWith('gemini');
```

### Gespeicherte Daten:
- `website_use_gemini` → "true" oder "false"
- `website_gemini_api_key` → Gemini API-Key
- `website_mistral_api_key` → Mistral API-Key
- `website_gemini_model` → z.B. "gemini-1.5-flash"
- `website_model` → z.B. "mistral-large-latest"

### Validierung:
- **Mistral:** `https://api.mistral.ai/v1/models`
- **Gemini:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro?key={key}`

---

## 🆘 Fehlerbehebung

### ❌ "Ungültiger Schlüssel"
**Lösung:**
- Prüfe ob der Key zum gewählten Modell passt
- Mistral-Keys beginnen NICHT mit "AIza"
- Gemini-Keys beginnen MIT "AIza"

### ❌ "Label ändert sich nicht"
**Lösung:**
- Hard Refresh: **Strg+Shift+F5**
- Cache leeren

### ❌ "API-Key wird nicht geladen"
**Lösung:**
1. Öffne Browser-Konsole (F12)
2. Gehe zu "Application" → "Local Storage"
3. Prüfe ob Keys gespeichert sind
4. Ggf. neu eingeben

---

## 📊 Kosten-Vergleich

| Modell | Kosten (1M Tokens) | Geschwindigkeit | Empfehlung |
|--------|-------------------|-----------------|------------|
| Gemini 1.5 Flash | €0.35 | ⚡⚡⚡ | ⭐ START HIER |
| Gemini 1.5 Pro | €7.00 | ⚡⚡ | Für komplexe Aufgaben |
| Mistral Small | €1.00 | ⚡⚡ | Günstig & gut |
| Mistral Large | €8.00 | ⚡ | Für höchste Qualität |

**Empfehlung:** Starte mit **Gemini 1.5 Flash** (kostenlos, schnell, DSGVO)!

---

**Viel Erfolg! 🎉**

*Erstellt: 4. November 2025*
