// Mistral AI Debug & Test Script
// Fügen Sie dieses Script in die Browser-Konsole ein, um die API zu testen

console.log("🔧 Mistral AI Debug-Modus aktiviert");

// Test-Funktion für Mistral AI
async function testMistralConnection(apiKey, message = "Hallo, bist du online?") {
    console.log("📡 Teste Mistral AI Verbindung...");
    console.log("🔑 API-Key:", apiKey ? "✓ Vorhanden" : "✗ Fehlt");
    
    if (!apiKey) {
        console.error("❌ Kein API-Key angegeben!");
        return;
    }
    
    try {
        const startTime = Date.now();
        
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`⏱️ Antwortzeit: ${duration}ms`);
        console.log(`📊 Status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const error = await response.json();
            console.error("❌ API-Fehler:", error);
            return { success: false, error };
        }
        
        const data = await response.json();
        console.log("✅ Erfolgreiche Antwort!");
        console.log("📄 Vollständige Antwort:", data);
        console.log("💬 Bot-Nachricht:", data.choices[0].message.content);
        
        return { success: true, data };
        
    } catch (error) {
        console.error("❌ Verbindungsfehler:", error);
        return { success: false, error: error.message };
    }
}

// Schnelltest mit gespeichertem API-Key
async function quickTest() {
    const apiKey = localStorage.getItem("mistral_api_key");
    if (!apiKey) {
        console.error("❌ Kein API-Key im localStorage gefunden!");
        console.log("💡 Tipp: Geben Sie Ihren API-Key in der UI ein und klicken Sie auf 'Speichern'");
        return;
    }
    
    console.log("🚀 Starte Schnelltest...");
    await testMistralConnection(apiKey);
}

// API-Key Validierung
async function validateMistralKey(apiKey) {
    console.log("🔍 Validiere API-Key...");
    
    try {
        const response = await fetch("https://api.mistral.ai/v1/models", {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("✅ API-Key ist gültig!");
            console.log(`📋 Verfügbare Modelle: ${data.data.length}`);
            console.log("Modelle:", data.data.map(m => m.id).join(", "));
            return true;
        } else {
            console.error("❌ API-Key ist ungültig!");
            const error = await response.json();
            console.error("Fehler:", error);
            return false;
        }
    } catch (error) {
        console.error("❌ Validierungsfehler:", error);
        return false;
    }
}

// Debugging-Informationen anzeigen
function showDebugInfo() {
    console.log("=== 🔍 MISTRAL AI DEBUG INFO ===");
    console.log("API-Key (localStorage):", localStorage.getItem("mistral_api_key") ? "✓ Gesetzt" : "✗ Nicht gesetzt");
    console.log("Website Model:", mistralManager?.websiteModel || "nicht gefunden");
    console.log("WhatsApp Model:", mistralManager?.whatsappModel || "nicht gefunden");
    console.log("ChatManager vorhanden:", typeof mistralManager?.chatManager !== 'undefined' ? "✓" : "✗");
    console.log("================================");
}

// Hilfsfunktionen
console.log(`
📝 Verfügbare Test-Funktionen:

1. testMistralConnection(apiKey, nachricht)
   Beispiel: testMistralConnection("dein-api-key", "Hallo Welt")

2. quickTest()
   Führt einen Schnelltest mit dem gespeicherten API-Key durch

3. validateMistralKey(apiKey)
   Überprüft, ob ein API-Key gültig ist

4. showDebugInfo()
   Zeigt aktuelle Konfiguration an

💡 Tipp: Drücken Sie F12 um diese Konsole zu öffnen
`);

// Auto-Start Debug Info
setTimeout(showDebugInfo, 1000);
