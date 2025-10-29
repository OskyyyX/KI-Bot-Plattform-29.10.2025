// API-Key aus localStorage holen (wenn vorhanden)
const storedApiKey = localStorage.getItem("mistral_api_key");
if (!storedApiKey) {
    console.warn("⚠️ Kein Mistral AI API-Key im localStorage gefunden. Bitte manuell eingeben!");
}

// Page Navigation
document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding page
        const pageId = link.dataset.page;
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    });
});

// Bot Creation
document.querySelector('.quick-actions .primary').addEventListener('click', () => {
    openModal('createBotModal');
});

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Form Submission
document.getElementById('createBotForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    // For now, we'll just close the modal
    closeModal();
});

// File Upload Handling
class FileManager {
    constructor() {
        this.files = {
            website: [],
            whatsapp: []
        };
        this.initializeFileUploads();
    }

    initializeFileUploads() {
        ['website', 'whatsapp'].forEach(botType => {
            const uploadBox = document.getElementById(`${botType}UploadBox`);
            const fileInput = document.getElementById(`${botType}FileUpload`);

            // Click to upload
            uploadBox.addEventListener('click', () => {
                fileInput.click();
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                this.handleFiles(Array.from(e.target.files), botType);
            });

            // Drag and drop
            uploadBox.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadBox.classList.add('dragover');
            });

            uploadBox.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadBox.classList.remove('dragover');
            });

            uploadBox.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadBox.classList.remove('dragover');
                const files = Array.from(e.dataTransfer.files);
                this.handleFiles(files, botType);
            });
        });
    }

    async handleFiles(files, botType) {
        // Verarbeite alle Dateien parallel für schnelleres Hochladen
        const uploadPromises = Array.from(files).map(file => this.handleFile(file, botType));
        await Promise.all(uploadPromises);
    }

    async handleFile(file, botType) {
        try {
            const fileData = {
                id: crypto.randomUUID(),
                name: file.name,
                type: file.type,
                size: file.size,
                uploadDate: new Date(),
                status: 'complete', // Direkt als komplett markieren
                content: null
            };

            // Füge die Datei zur Liste hinzu
            this.files[botType].push(fileData);
            this.updateFileList(botType);

            // Lese Dateiinhalt asynchron (ohne zu warten)
            this.readFileContent(file).then(content => {
                fileData.content = content;
                console.log(`✅ Datei "${file.name}" erfolgreich geladen (${this.formatFileSize(file.size)})`);
            }).catch(error => {
                console.error(`❌ Fehler beim Lesen von "${file.name}":`, error);
                fileData.error = error.message;
                this.updateFileList(botType);
            });

        } catch (error) {
            console.error('Fehler beim Verarbeiten der Datei:', error);
            this.showError(file.name, error.message);
        }
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error("Fehler beim Lesen der Datei"));
            
            // Alle Dateien als Text lesen
            reader.readAsText(file);
        });
    }

    updateFileList(botType) {
        const fileList = document.getElementById(`${botType}FileList`);
        fileList.innerHTML = this.files[botType].map(file => `
            <div class="file-item ${file.status}" data-file-id="${file.id}">
                <div class="file-info">
                    <i class="file-icon fas ${this.getFileIcon(file.type)}"></i>
                    <div class="file-details">
                        <span class="file-name">${file.name}</span>
                        <span class="file-meta">${this.formatFileSize(file.size)} • ${this.formatDate(file.uploadDate)}</span>
                        ${file.error ? 
                            `<div class="file-error">⚠️ ${file.error}</div>` : ''}
                        ${file.analysis ? 
                            `<div class="file-analysis">
                                <h4>Mistral AI Analyse:</h4>
                                <p>${file.analysis}</p>
                             </div>` : ''}
                    </div>
                </div>
                <div class="file-actions">
                    ${file.status === 'uploading' ? 
                        '<div class="upload-spinner"></div>' :
                        `<div class="action-buttons">
                            <button class="btn primary" onclick="fileManager.analyzeFile('${file.id}', '${botType}')" 
                                    ${file.status === 'processing' ? 'disabled' : ''} 
                                    title="Mit Mistral AI analysieren">
                                <i class="fas fa-robot"></i> ${file.analysis ? 'Neu analysieren' : 'Mit AI analysieren'}
                            </button>
                            <button class="btn secondary" onclick="fileManager.deleteFile('${file.id}', '${botType}')" title="Datei löschen">
                                <i class="fas fa-trash"></i>
                            </button>
                         </div>`
                    }
                </div>
            </div>
        `).join('');
        
        // Aktualisiere das File Context Banner im Chat
        this.updateFileContextBanner(botType);
    }

    updateFileContextBanner(botType) {
        const banner = document.getElementById(`${botType}FileContext`);
        if (!banner) return;
        
        const files = this.files[botType];
        
        if (files.length === 0) {
            banner.style.display = 'none';
        } else {
            banner.style.display = 'flex';
            const fileNames = files.map(f => f.name).join(', ');
            banner.innerHTML = `
                <i class="fas fa-database"></i>
                <span class="file-count">${files.length} ${files.length === 1 ? 'Datei' : 'Dateien'}</span>
                <span class="file-names">Bot hat Zugriff auf: ${fileNames}</span>
            `;
        }
    }

    getFileIcon(fileType) {
        if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('csv')) return 'fa-file-excel';
        if (fileType.includes('pdf')) return 'fa-file-pdf';
        if (fileType.includes('word') || fileType.includes('document')) return 'fa-file-word';
        if (fileType.includes('text')) return 'fa-file-alt';
        if (fileType.includes('json') || fileType.includes('xml')) return 'fa-file-code';
        return 'fa-file';
    }

    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    showError(fileName, message) {
        // Hier können Sie eine Fehlerbenachrichtigung anzeigen
        console.error(`Fehler bei ${fileName}: ${message}`);
    }

    deleteFile(fileId, botType) {
        this.files[botType] = this.files[botType].filter(file => file.id !== fileId);
        this.updateFileList(botType);
    }

    async analyzeFile(fileId, botType) {
        const file = this.files[botType].find(f => f.id === fileId);
        if (!file) return;

        // API-Key holen
        const apiKeyInput = document.getElementById(botType === 'whatsapp' ? 'whatsappMistralKey' : 'apiKeyInput');
        const currentApiKey = apiKeyInput?.value?.trim() || '';
        
        if (!currentApiKey || currentApiKey.length === 0) {
            alert('⚠️ Bitte geben Sie zuerst einen Mistral AI API-Schlüssel ein!');
            return;
        }

        // Status auf "processing" setzen
        file.status = 'processing';
        this.updateFileList(botType);

        try {
            // Stelle sicher, dass der Inhalt geladen ist
            if (!file.content) {
                throw new Error('Dateiinhalt wurde noch nicht geladen');
            }

            // Kürze den Content für die Analyse (max 8000 Zeichen)
            const contentPreview = file.content.substring(0, 8000);
            
            // Sende an Mistral AI
            const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentApiKey}`
                },
                body: JSON.stringify({
                    model: "mistral-small-latest", // Schnelleres Modell für Analyse
                    messages: [
                        { 
                            role: "system", 
                            content: "Analysiere den folgenden Dokumentinhalt und erstelle eine kurze Zusammenfassung (max 3 Sätze)." 
                        },
                        { 
                            role: "user", 
                            content: contentPreview
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API-Fehler: ${response.status}`);
            }

            const data = await response.json();
            file.analysis = data.choices[0]?.message?.content || "Keine Analyse verfügbar";
            file.status = 'complete';
            
            console.log('✅ Datei analysiert:', file.name);
            
        } catch (error) {
            file.status = 'error';
            file.error = error.message;
            console.error('❌ Fehler bei der Analyse:', error);
        }

        this.updateFileList(botType);
    }
}

// Toggle Switch Handling
document.querySelectorAll('.switch input').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
        const botCard = e.target.closest('.bot-card');
        const botName = botCard.querySelector('h3').textContent;
        const isActive = e.target.checked;
        
        // Here you would typically update the backend
        console.log(`Bot "${botName}" is now ${isActive ? 'active' : 'inactive'}`);
    });
});

// API Key Management
class APIKeyManager {
    constructor() {
        this.keys = {};
    }

    async validateAPIKey(key, provider) {
        // Implement API key validation logic
        return true;
    }

    async updateAPIKey(provider, key) {
        if (await this.validateAPIKey(key, provider)) {
            this.keys[provider] = key;
            return true;
        }
        return false;
    }
}

// Bot Configuration Manager
class BotConfigManager {
    constructor() {
        this.configs = new Map();
    }

    createBot(config) {
        const botId = crypto.randomUUID();
        this.configs.set(botId, {
            id: botId,
            ...config,
            createdAt: new Date(),
            isActive: false
        });
        return botId;
    }

    updateBotConfig(botId, config) {
        if (this.configs.has(botId)) {
            this.configs.set(botId, {
                ...this.configs.get(botId),
                ...config,
                updatedAt: new Date()
            });
            return true;
        }
        return false;
    }

    deleteBot(botId) {
        return this.configs.delete(botId);
    }
}

// Agent System - Google Calendar Integration
class AgentSystem {
    constructor() {
        this.agents = {
            website: {
                googleCalendar: {
                    enabled: false,
                    clientId: '',
                    clientSecret: '',
                    redirectUri: '',
                    accessToken: null,
                    refreshToken: null,
                    tokenExpiry: null
                }
            },
            whatsapp: {
                googleCalendar: {
                    enabled: false,
                    clientId: '',
                    clientSecret: '',
                    redirectUri: '',
                    accessToken: null,
                    refreshToken: null,
                    tokenExpiry: null
                }
            }
        };
        this.SCOPES = 'https://www.googleapis.com/auth/calendar';
        this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
        this.tokenClient = null;
        
        this.loadAgentConfigs();
        this.initializeAgentToggles();
        this.detectRedirectUri();
        this.handleOAuthCallback();
    }

    // Erkenne automatisch die Redirect URI
    detectRedirectUri() {
        const redirectUri = `${window.location.origin}${window.location.pathname}`;
        
        // Setze in beiden Bot-Typen
        ['website', 'whatsapp'].forEach(botType => {
            this.agents[botType].googleCalendar.redirectUri = redirectUri;
            
            // Zeige in UI
            const input = document.getElementById(`${botType}GoogleRedirectUri`);
            if (input) {
                input.value = redirectUri;
            }
        });
        
        console.log('📍 Redirect URI erkannt:', redirectUri);
    }

    // Behandle OAuth-Callback (wenn von Google zurückgekehrt)
    handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        // Prüfe auf OAuth-Fehler
        if (error) {
            console.error('❌ OAuth Fehler:', error);
            alert(`Google Autorisierung fehlgeschlagen: ${error}`);
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }
        
        if (code && state) {
            console.log('🔄 OAuth Callback erkannt, tausche Code gegen Token...');
            
            // Parse State um botType zu erhalten
            let botType;
            try {
                const stateData = JSON.parse(decodeURIComponent(state));
                botType = stateData.botType;
            } catch (e) {
                console.error('❌ Fehler beim Parsen von State:', e);
                alert('OAuth State konnte nicht gelesen werden');
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
            }
            
            // Lade temporäre Credentials aus localStorage
            const clientId = localStorage.getItem(`${botType}_temp_client_id`);
            const clientSecretEncoded = localStorage.getItem(`${botType}_temp_client_secret`);
            
            if (!clientId || !clientSecretEncoded) {
                console.error('❌ Client ID oder Secret nicht gefunden in localStorage!');
                alert('❌ OAuth-Daten nicht gefunden. Bitte versuchen Sie erneut, sich zu verbinden.');
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
            }
            
            const clientSecret = atob(clientSecretEncoded); // Base64 dekodieren
            
            console.log('✅ Client ID aus localStorage geladen');
            
            // Setze die Credentials im Agent-System
            this.agents[botType].googleCalendar.clientId = clientId;
            this.agents[botType].googleCalendar.clientSecret = clientSecret;
            
            // Tausche Authorization Code gegen Access Token
            this.exchangeCodeForToken(botType, code);
            
            // Bereinige URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Tausche Authorization Code gegen Access & Refresh Token
    async exchangeCodeForToken(botType, code) {
        const config = this.agents[botType].googleCalendar;
        
        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    code: code,
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    redirect_uri: config.redirectUri,
                    grant_type: 'authorization_code'
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error_description || data.error);
            }

            // Speichere Tokens
            config.accessToken = data.access_token;
            config.refreshToken = data.refresh_token;
            config.tokenExpiry = Date.now() + (data.expires_in * 1000);

            console.log('✅ Access Token & Refresh Token erhalten!');

            // Speichere in localStorage
            this.saveAgentConfig(botType, 'google', { silent: true });

            // Bereinige URL (entferne code & state Parameter)
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);

            // Zeige Erfolg
            const statusDiv = document.getElementById(`${botType}GoogleStatus`);
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #22c55e;"><i class="fas fa-check-circle"></i> ✅ Erfolgreich mit Google Calendar verbunden!</span>';
            }

            alert('✅ Google Calendar erfolgreich verbunden!\n\nDu kannst jetzt den Bot nach deinen Terminen fragen.');

        } catch (error) {
            console.error('❌ Token Exchange Fehler:', error);
            alert('❌ Fehler beim Token-Austausch:\n\n' + error.message);
        }
    }

    loadAgentConfigs() {
        // Lade gespeicherte Agent-Konfigurationen
        ['website', 'whatsapp'].forEach(botType => {
            const saved = localStorage.getItem(`${botType}_agent_google`);
            if (saved) {
                try {
                    const config = JSON.parse(saved);
                    // Dekodiere Client Secret
                    if (config.clientSecret) {
                        config.clientSecret = atob(config.clientSecret);
                    }
                    this.agents[botType].googleCalendar = {
                        ...this.agents[botType].googleCalendar,
                        ...config
                    };
                    
                    // Fülle UI-Felder
                    if (config.clientId) {
                        const clientIdInput = document.getElementById(`${botType}GoogleClientId`);
                        if (clientIdInput) clientIdInput.value = config.clientId;
                    }
                    if (config.clientSecret) {
                        const clientSecretInput = document.getElementById(`${botType}GoogleClientSecret`);
                        if (clientSecretInput) clientSecretInput.value = config.clientSecret;
                    }
                } catch (e) {
                    console.error('Fehler beim Laden der Agent-Konfiguration:', e);
                }
            }
        });
    }

    initializeAgentToggles() {
        ['website', 'whatsapp'].forEach(botType => {
            const toggle = document.getElementById(`${botType}GoogleCalendarEnabled`);
            const configDiv = document.getElementById(`${botType}GoogleCalendarConfig`);
            
            if (toggle && configDiv) {
                // Setze gespeicherten Zustand
                toggle.checked = this.agents[botType].googleCalendar.enabled;
                configDiv.style.display = toggle.checked ? 'block' : 'none';
                
                // Lade gespeicherte Werte
                const clientIdInput = document.getElementById(`${botType}GoogleClientId`);
                const apiKeyInput = document.getElementById(`${botType}GoogleApiKey`);
                
                if (clientIdInput) clientIdInput.value = this.agents[botType].googleCalendar.clientId || '';
                if (apiKeyInput) apiKeyInput.value = this.agents[botType].googleCalendar.apiKey || '';
                
                // Toggle Event
                toggle.addEventListener('change', (e) => {
                    configDiv.style.display = e.target.checked ? 'block' : 'none';
                    this.agents[botType].googleCalendar.enabled = e.target.checked;
                    this.saveAgentConfig(botType, 'google');
                });
            }
        });
    }

    async initializeGoogleAuth(botType) {
        const clientId = document.getElementById(`${botType}GoogleClientId`)?.value?.trim();
        const clientSecret = document.getElementById(`${botType}GoogleClientSecret`)?.value?.trim();
        
        // Validierung
        if (!clientId) {
            alert('❌ Bitte Client-ID eingeben!');
            return;
        }

        if (!clientSecret) {
            alert('❌ Bitte Clientschlüssel (Client Secret) eingeben!');
            return;
        }

        // WICHTIG: Speichere Credentials in localStorage VOR dem OAuth-Flow
        // (wird später im Callback benötigt)
        this.agents[botType].googleCalendar.clientId = clientId;
        this.agents[botType].googleCalendar.clientSecret = clientSecret;
        
        // Speichere temporär für OAuth Callback
        localStorage.setItem(`${botType}_temp_client_id`, clientId);
        localStorage.setItem(`${botType}_temp_client_secret`, btoa(clientSecret)); // Base64 verschlüsselt

        const redirectUri = this.agents[botType].googleCalendar.redirectUri;

        console.log('🔐 Starte OAuth 2.0 Authorization Code Flow...');
        console.log('📌 Client ID:', clientId.substring(0, 20) + '...');
        console.log('📌 Redirect URI:', redirectUri);

        const statusDiv = document.getElementById(`${botType}GoogleStatus`);
        if (statusDiv) {
            statusDiv.innerHTML = '<span style="color: #3b82f6;"><i class="fas fa-spinner fa-spin"></i> Leite zu Google weiter...</span>';
        }

        // Baue Authorization URL mit State-Parameter
        const stateData = JSON.stringify({
            botType: botType,
            timestamp: Date.now()
        });

        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('redirect_uri', redirectUri);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', this.SCOPES);
        authUrl.searchParams.append('access_type', 'offline'); // Für Refresh Token
        authUrl.searchParams.append('prompt', 'consent'); // Zeige immer Consent Screen
        authUrl.searchParams.append('state', encodeURIComponent(stateData)); // State mit botType

        console.log('🚀 Redirect zu Google OAuth...');

        // Redirect zu Google OAuth
        window.location.href = authUrl.toString();
    }

    saveAgentConfig(botType, apiType, options = {}) {
        const { silent = false } = options;
        
        if (apiType === 'google') {
            const config = this.agents[botType].googleCalendar;

            // Speichere Konfiguration (Client Secret wird verschlüsselt)
            const configToSave = {
                enabled: config.enabled,
                clientId: config.clientId,
                clientSecret: config.clientSecret ? btoa(config.clientSecret) : '', // Base64 Kodierung
                redirectUri: config.redirectUri,
                accessToken: config.accessToken,
                refreshToken: config.refreshToken,
                tokenExpiry: config.tokenExpiry
            };
            
            localStorage.setItem(`${botType}_agent_google`, JSON.stringify(configToSave));
            
            // Status anzeigen
            if (!silent) {
                const statusDiv = document.getElementById(`${botType}GoogleStatus`);
                if (statusDiv) {
                    statusDiv.style.background = '#d4edda';
                    statusDiv.style.color = '#155724';
                    statusDiv.style.border = '1px solid #c3e6cb';
                    statusDiv.innerHTML = '<strong><i class="fas fa-check-circle"></i> ✅ Konfiguration gespeichert!</strong>';
                    setTimeout(() => {
                        statusDiv.innerHTML = '';
                        statusDiv.style.background = '';
                        statusDiv.style.border = '';
                    }, 3000);
                }
            }
            
            console.log('✅ Google Calendar Konfiguration gespeichert:', botType);
        }
    }

    isTokenValid(botType) {
        const config = this.agents[botType].googleCalendar;
        if (!config.accessToken || !config.tokenExpiry) {
            return false;
        }
        // Token ist gültig, wenn noch mind. 5 Minuten übrig
        return Date.now() < (config.tokenExpiry - 300000);
    }

    async createCalendarEvent(botType, eventData) {
        const config = this.agents[botType].googleCalendar;
        
        if (!config.enabled) {
            return {
                success: false,
                message: '📅 Google Calendar ist nicht aktiviert.\n\n' +
                        '✅ So aktivieren Sie es:\n' +
                        '1. Scrollen Sie nach oben zu "Agent-Funktionen"\n' +
                        '2. Schalten Sie "Google Calendar API" EIN\n' +
                        '3. Geben Sie Ihre Client ID und Client Secret ein\n' +
                        '4. Klicken Sie auf "Mit Google verbinden"\n' +
                        '5. Klicken Sie auf "Speichern"'
            };
        }
        
        if (!this.isTokenValid(botType)) {
            return {
                success: false,
                message: '🔐 Sie sind nicht mit Google angemeldet!\n\n' +
                        '✅ So melden Sie sich an:\n' +
                        '1. Scrollen Sie nach oben zu "Agent-Funktionen"\n' +
                        '2. Öffnen Sie "Google Calendar API"\n' +
                        '3. Klicken Sie auf "🔗 Mit Google verbinden"\n' +
                        '4. Erlauben Sie den Zugriff\n' +
                        '5. Klicken Sie auf "💾 Speichern"\n\n' +
                        'Danach können Sie Termine buchen! 📆'
            };
        }

        try {
            const event = {
                summary: eventData.title || eventData.summary,
                description: eventData.description || '',
                start: {
                    dateTime: eventData.startTime,
                    timeZone: eventData.timeZone || 'Europe/Berlin'
                },
                end: {
                    dateTime: eventData.endTime,
                    timeZone: eventData.timeZone || 'Europe/Berlin'
                },
                attendees: eventData.attendees || [],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 }
                    ]
                }
            };

            // REST API Aufruf mit Access Token
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error.message || 'API Fehler');
            }

            const result = await response.json();
            console.log('✅ Google Calendar Event erstellt:', result);
            
            return {
                success: true,
                eventId: result.id,
                htmlLink: result.htmlLink,
                message: `Termin erfolgreich erstellt: ${result.summary}`
            };

        } catch (error) {
            console.error('❌ Fehler beim Erstellen des Calendar Events:', error);
            return {
                success: false,
                message: `⚠️ Fehler: ${error.result?.error?.message || error.message || 'Unbekannter Fehler beim Erstellen des Termins'}`
            };
        }
    }

    async listCalendarEvents(botType, timeMin, timeMax) {
        const config = this.agents[botType].googleCalendar;
        
        if (!config.enabled) {
            return {
                success: false,
                message: '📅 Google Calendar ist nicht aktiviert.\n\n' +
                        '✅ So aktivieren Sie es:\n' +
                        '1. Scrollen Sie nach oben zu "Agent-Funktionen"\n' +
                        '2. Schalten Sie "Google Calendar API" EIN\n' +
                        '3. Geben Sie Ihre Client ID und Client Secret ein\n' +
                        '4. Klicken Sie auf "Mit Google verbinden"\n' +
                        '5. Klicken Sie auf "Speichern"'
            };
        }
        
        if (!this.isTokenValid(botType)) {
            return {
                success: false,
                message: '🔐 Sie sind nicht mit Google angemeldet!\n\n' +
                        '✅ So melden Sie sich an:\n' +
                        '1. Scrollen Sie nach oben zu "Agent-Funktionen"\n' +
                        '2. Öffnen Sie "Google Calendar API"\n' +
                        '3. Klicken Sie auf "🔗 Mit Google verbinden"\n' +
                        '4. Erlauben Sie den Zugriff\n' +
                        '5. Klicken Sie auf "💾 Speichern"\n\n' +
                        'Danach können Sie Ihre Termine abrufen! 📆'
            };
        }

        try {
            // Validiere und normalisiere Zeitstempel
            let startDate, endDate;
            
            try {
                startDate = new Date(timeMin);
                endDate = new Date(timeMax);
                
                // Prüfe ob die Daten gültig sind
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error('Ungültige Zeitangaben');
                }
            } catch (e) {
                console.error('❌ Fehler beim Parsen der Zeitangaben:', e);
                return {
                    success: false,
                    message: '⚠️ Ungültige Zeitangaben. Bitte verwenden Sie ISO 8601 Format (z.B. 2025-10-30T00:00:00Z)'
                };
            }

            // REST API Aufruf mit Access Token
            const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
            url.searchParams.append('timeMin', startDate.toISOString());
            url.searchParams.append('timeMax', endDate.toISOString());
            url.searchParams.append('showDeleted', 'false');
            url.searchParams.append('singleEvents', 'true');
            url.searchParams.append('maxResults', '50');
            url.searchParams.append('orderBy', 'startTime');

            console.log('📅 Rufe Calendar Events ab:', {
                timeMin: startDate.toISOString(),
                timeMax: endDate.toISOString()
            });

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${config.accessToken}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Google Calendar API Fehler:', errorText);
                
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error?.message || errorText;
                } catch (e) {
                    errorMessage = errorText;
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const events = data.items || [];
            
            console.log(`✅ ${events.length} Termine gefunden`);
            
            return {
                success: true,
                events: events,
                message: events.length > 0 
                    ? `${events.length} Termin(e) gefunden` 
                    : 'Keine Termine im angegebenen Zeitraum'
            };

        } catch (error) {
            console.error('❌ Fehler beim Abrufen der Calendar Events:', error);
            return {
                success: false,
                message: `⚠️ Fehler beim Abrufen der Termine: ${error.message || 'Unbekannter Fehler'}`
            };
        }
    }

    // Agent-Funktionen als Tools für Mistral AI
    getAvailableTools(botType) {
        const tools = [];
        
        if (this.agents[botType].googleCalendar.enabled) {
            tools.push({
                type: 'function',
                function: {
                    name: 'create_calendar_event',
                    description: 'Erstellt einen neuen Termin im Google Calendar des Benutzers',
                    parameters: {
                        type: 'object',
                        properties: {
                            title: {
                                type: 'string',
                                description: 'Titel/Betreff des Termins'
                            },
                            description: {
                                type: 'string',
                                description: 'Beschreibung/Details zum Termin'
                            },
                            startTime: {
                                type: 'string',
                                description: 'Start-Zeit im ISO 8601 Format (z.B. 2025-10-30T14:00:00)'
                            },
                            endTime: {
                                type: 'string',
                                description: 'End-Zeit im ISO 8601 Format'
                            },
                            attendees: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string' }
                                    }
                                },
                                description: 'Liste der Teilnehmer (E-Mail-Adressen)'
                            }
                        },
                        required: ['title', 'startTime', 'endTime']
                    }
                }
            });

            tools.push({
                type: 'function',
                function: {
                    name: 'list_calendar_events',
                    description: 'Listet alle Termine in einem bestimmten Zeitraum auf. WICHTIG: Beachte das heutige Datum aus dem System-Prompt!',
                    parameters: {
                        type: 'object',
                        properties: {
                            timeMin: {
                                type: 'string',
                                description: 'Start des Zeitraums im ISO 8601 Format (z.B. "2025-10-30T00:00:00Z" oder "2025-10-30T00:00:00"). WICHTIG: Verwende das korrekte Jahr aus dem System-Prompt!'
                            },
                            timeMax: {
                                type: 'string',
                                description: 'Ende des Zeitraums im ISO 8601 Format (z.B. "2025-10-30T23:59:59Z" oder "2025-10-30T23:59:59"). WICHTIG: Verwende das korrekte Jahr aus dem System-Prompt!'
                            }
                        },
                        required: ['timeMin', 'timeMax']
                    }
                }
            });
        }
        
        return tools;
    }

    async executeTool(botType, toolName, args) {
        switch (toolName) {
            case 'create_calendar_event':
                return await this.createCalendarEvent(botType, args);
            
            case 'list_calendar_events':
                return await this.listCalendarEvents(botType, args.timeMin, args.timeMax);
            
            default:
                throw new Error(`Unbekanntes Tool: ${toolName}`);
        }
    }
}

// Mistral AI API Management
class ChatManager {
    constructor(mistralManager) {
        this.mistralManager = mistralManager;
        this.conversations = {
            website: [],
            whatsapp: []
        };
        this.personalities = {
            website: '',
            whatsapp: ''
        };
        // Lade gespeicherte Persönlichkeiten
        this.loadPersonalities();
        // Statische Termindaten direkt einbinden
        this.appointmentData = [
            {
                "Date": "2025-10-10",
                "Time": "09:00-10:30",
                "Event": "Board Meeting",
                "Description": "Quarterly planning and budget discussion",
                "Location": "Conference Room A",
                "Participants": "Hans Müller, Anna Schmidt, Peter Weber",
                "Status": "Confirmed"
            },
            {
                "Date": "2025-10-11",
                "Time": "14:00-15:00",
                "Event": "AI Bot Project Meeting",
                "Description": "Status update on AI Bot project",
                "Location": "Online (Teams)",
                "Participants": "Sarah Klein, Tim Meyer",
                "Status": "Confirmed"
            },
            {
                "Date": "2025-10-14",
                "Time": "10:00-11:30",
                "Event": "Customer Workshop",
                "Description": "Product presentation for XYZ GmbH",
                "Location": "Customer Center",
                "Participants": "Maria Garcia, Thomas Wolf, Customer (3 persons)",
                "Status": "Confirmed"
            },
            {
                "Date": "2025-10-15",
                "Time": "13:00-14:00",
                "Event": "Team Lunch",
                "Description": "Team lunch with development team",
                "Location": "Cafeteria",
                "Participants": "Entire Development Team",
                "Status": "Planned"
            },
            {
                "Date": "2025-10-16",
                "Time": "11:00-12:00",
                "Event": "Tech Review",
                "Description": "Code review and architecture discussion",
                "Location": "Meeting Room 2",
                "Participants": "Development Team, Tech Lead",
                "Status": "Confirmed"
            },
            {
                "Date": "2025-10-17",
                "Time": "15:00-16:30",
                "Event": "Training",
                "Description": "AI Development Best Practices",
                "Location": "Training Room",
                "Participants": "Development Team, External Trainers",
                "Status": "Planned"
            },
            {
                "Date": "2025-10-21",
                "Time": "09:30-10:30",
                "Event": "Sprint Planning",
                "Description": "Planning next sprint",
                "Location": "Scrum Room",
                "Participants": "Scrum Team, Product Owner",
                "Status": "Confirmed"
            },
            {
                "Date": "2025-10-22",
                "Time": "16:00-17:00",
                "Event": "Retrospective",
                "Description": "Sprint retrospective",
                "Location": "Online (Zoom)",
                "Participants": "Development Team, Scrum Master",
                "Status": "Planned"
            },
            {
                "Date": "2025-10-23",
                "Time": "10:00-11:00",
                "Event": "Sales Meeting",
                "Description": "Alignment with sales",
                "Location": "Conference Room B",
                "Participants": "Sales Team, Product Management",
                "Status": "Confirmed"
            },
            {
                "Date": "2025-10-24",
                "Time": "14:00-15:30",
                "Event": "Strategy Meeting",
                "Description": "Q4 2025 Planning",
                "Location": "Executive Floor",
                "Participants": "Management Team, Department Heads",
                "Status": "Confirmed"
            }
        ];
        this.initializeChat();
    }

    async loadAppointmentData() {
        try {
            // Suche nach der appointments.csv in den hochgeladenen Dateien
            const appointmentFile = fileManager.files.website.find(file => 
                file.name === 'appointments.csv' && file.status === 'complete'
            );

            if (!appointmentFile || !appointmentFile.content) {
                console.warn('Keine Termindaten gefunden. Bitte laden Sie die appointments.csv Datei hoch.');
                return null;
            }

            this.appointmentData = this.parseCSV(appointmentFile.content);
            console.log('Termine erfolgreich geladen:', this.appointmentData);
        } catch (error) {
            console.error('Fehler beim Laden der Termine:', error);
        }
    }

    parseCSV(text) {
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const appointments = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(',');
            const appointment = {};
            headers.forEach((header, index) => {
                appointment[header.trim()] = values[index].trim();
            });
            appointments.push(appointment);
        }

        return appointments;
    }

    initializeChat() {
        ['website', 'whatsapp'].forEach(botType => {
            const chatInput = document.getElementById(`${botType}BotPrompt`);
            if (chatInput) {
                chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendBotInstruction(botType);
                    }
                });
            }
            
            // Lade gespeicherte Persönlichkeit in das Textfeld
            const personalityInput = document.getElementById(`${botType}BotPersonality`);
            if (personalityInput && this.personalities[botType]) {
                personalityInput.value = this.personalities[botType];
            }
        });
    }

    loadPersonalities() {
        ['website', 'whatsapp'].forEach(botType => {
            const saved = localStorage.getItem(`${botType}_bot_personality`);
            if (saved) {
                this.personalities[botType] = saved;
            }
        });
    }

    setPersonality(botType, personality) {
        this.personalities[botType] = personality;
        console.log(`✅ Persönlichkeit für ${botType} gesetzt:`, personality.substring(0, 50) + '...');
    }

    addMessage(botType, message, isUser = true) {
        const chat = document.getElementById(`${botType}BotChat`);
        if (!chat) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        messageDiv.textContent = message;
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;

        this.conversations[botType].push({
            role: isUser ? 'user' : 'assistant',
            content: message
        });
    }

    async sendBotInstruction(botType) {
        const input = document.getElementById(`${botType}BotPrompt`);
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        input.value = '';

        this.addMessage(botType, message, true);

        // API-Key direkt aus dem Input-Feld holen und validieren
        const apiKeyInput = document.getElementById(botType === 'whatsapp' ? 'whatsappMistralKey' : 'apiKeyInput');
        const currentApiKey = apiKeyInput?.value?.trim() || '';
        
        if (!currentApiKey || currentApiKey.length === 0) {
            this.addMessage(botType, "⚠️ Bitte geben Sie zuerst einen Mistral AI API-Schlüssel ein und validieren Sie ihn.", false);
            return;
        }

        // Zeige Info über verfügbare Dateien
        const uploadedFiles = fileManager.files[botType] || [];
        if (uploadedFiles.length > 0) {
            const fileNames = uploadedFiles.map(f => f.name).join(', ');
            console.log(`📁 Bot verwendet ${uploadedFiles.length} Datei(en): ${fileNames}`);
        } else {
            console.log('ℹ️ Bot arbeitet ohne Dateien (keine Wissensbasis hochgeladen)');
        }

        // API-Key abrufen
        const apiKey = currentApiKey || localStorage.getItem("mistral_api_key");
        if (!apiKey) {
            this.addMessage(botType, "⚠️ Kein Mistral AI API-Key gefunden. Bitte zuerst eingeben.", false);
            return;
        }

        // Zeige Lade-Indikator
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'chat-message bot';
        loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Denke nach...';
        const chat = document.getElementById(`${botType}BotChat`);
        chat.appendChild(loadingMsg);
        chat.scrollTop = chat.scrollHeight;

        try {
            // Erstelle Nachrichten-Array
            const messages = [];
            
            // 🆕 AKTUELLES DATUM AUTOMATISCH HINZUFÜGEN
            const heute = new Date();
            const datumString = heute.toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const zeitString = heute.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Baue System-Prompt mit DATUM als erstes (höchste Priorität!)
            let systemPrompt = `📅 **WICHTIGES KONTEXT-WISSEN:**\n`;
            systemPrompt += `Heute ist ${datumString}, ${zeitString} Uhr.\n`;
            systemPrompt += `Aktuelles Jahr: ${heute.getFullYear()}\n`;
            systemPrompt += `Aktueller Monat: ${heute.toLocaleDateString('de-DE', { month: 'long' })}\n\n`;
            
            // Füge Persönlichkeit hinzu
            systemPrompt += this.personalities[botType] || "Du bist ein hilfsbereiter Assistent.";
            
            // Füge Agent-Fähigkeiten zum System-Prompt hinzu
            const availableTools = agentSystem.getAvailableTools(botType);
            if (availableTools.length > 0) {
                systemPrompt += "\n\n🤖 **AGENT-FÄHIGKEITEN:**\n";
                systemPrompt += "Du bist ein intelligenter Agent und kannst folgende Aktionen ausführen:\n";
                availableTools.forEach(tool => {
                    systemPrompt += `- ${tool.function.name}: ${tool.function.description}\n`;
                });
                systemPrompt += "\nWenn der Benutzer eine Aktion wünscht (z.B. 'Buche einen Termin' oder 'Zeig mir meine Termine'), nutze die verfügbaren Tools!";
                systemPrompt += "\n⚠️ WICHTIG: Beachte das heutige Datum (siehe oben) bei relativen Zeitangaben wie 'morgen', 'nächste Woche', etc.";
            }
            
            // Füge hochgeladene Dateien als Kontext hinzu
            const uploadedFiles = fileManager.files[botType] || [];
            if (uploadedFiles.length > 0) {
                systemPrompt += "\n\n📁 **VERFÜGBARE WISSENSBASIS:**\n";
                systemPrompt += "Du hast Zugriff auf folgende Dokumente und Dateien. Nutze diese Informationen, um Fragen zu beantworten:\n\n";
                
                uploadedFiles.forEach((file, index) => {
                    systemPrompt += `--- DOKUMENT ${index + 1}: ${file.name} ---\n`;
                    systemPrompt += `Dateityp: ${file.type}\n`;
                    systemPrompt += `Inhalt:\n${file.content}\n\n`;
                });
                
                systemPrompt += "\n💡 **WICHTIG:** Beantworte Fragen basierend auf diesen Dokumenten UND beachte das heutige Datum (siehe oben). Wenn die Antwort in den Dokumenten steht, zitiere relevante Teile. Wenn die Information nicht in den Dokumenten ist, sage das ehrlich.";
            }
            
            messages.push({
                role: "system",
                content: systemPrompt
            });
            
            // Füge User-Nachricht hinzu
            messages.push({
                role: "user",
                content: message
            });
            
            // Bereite API-Request vor
            const requestBody = {
                model: this.mistralManager[`${botType}Model`] || "mistral-large-latest",
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000
            };

            // Füge Tools hinzu, falls verfügbar (Mistral AI Function Calling)
            if (availableTools.length > 0) {
                requestBody.tools = availableTools;
                requestBody.tool_choice = 'auto';
            }
            
            // Anfrage an Mistral AI-API senden
            const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            // Entferne Lade-Indikator
            chat.removeChild(loadingMsg);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = `API-Fehler (${response.status}): `;
                
                if (response.status === 401) {
                    errorMessage += "Ungültiger API-Schlüssel. Bitte überprüfen Sie Ihren Mistral AI API-Key.";
                } else if (response.status === 429) {
                    errorMessage += "Rate Limit erreicht. Bitte warten Sie einen Moment.";
                } else if (response.status === 400) {
                    errorMessage += errorData.message || "Ungültige Anfrage. Überprüfen Sie die Parameter.";
                } else {
                    errorMessage += errorData.message || response.statusText || "Unbekannter Fehler";
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error("Ungültige Antwortstruktur von der API");
            }

            const assistantMessage = data.choices[0].message;

            // Prüfe, ob der Bot Tool-Calls verwenden möchte
            if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
                console.log('🔧 Bot möchte Tools verwenden:', assistantMessage.tool_calls);
                
                // Führe alle Tool-Calls aus
                for (const toolCall of assistantMessage.tool_calls) {
                    const toolName = toolCall.function.name;
                    const toolArgs = JSON.parse(toolCall.function.arguments);
                    
                    this.addMessage(botType, `🤖 Führe Aktion aus: ${toolName}...`, false);
                    
                    try {
                        const toolResult = await agentSystem.executeTool(botType, toolName, toolArgs);
                        
                        // Zeige Erfolg
                        if (toolResult.success) {
                            this.addMessage(botType, `✅ ${toolResult.message || 'Aktion erfolgreich ausgeführt!'}`, false);
                            
                            // Zeige Google Calendar Link falls vorhanden
                            if (toolResult.htmlLink) {
                                this.addMessage(botType, `🔗 Link: ${toolResult.htmlLink}`, false);
                            }
                            
                            // Zeige Event-Liste falls vorhanden
                            if (toolResult.events && toolResult.events.length > 0) {
                                let eventList = '📅 **Ihre Termine:**\n\n';
                                toolResult.events.forEach((event, index) => {
                                    const startDate = new Date(event.start.dateTime || event.start.date);
                                    const endDate = new Date(event.end.dateTime || event.end.date);
                                    eventList += `${index + 1}. **${event.summary || 'Kein Titel'}**\n`;
                                    eventList += `   🕐 ${startDate.toLocaleString('de-DE')} - ${endDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}\n`;
                                    if (event.description) {
                                        eventList += `   📝 ${event.description}\n`;
                                    }
                                    if (event.location) {
                                        eventList += `   📍 ${event.location}\n`;
                                    }
                                    eventList += '\n';
                                });
                                this.addMessage(botType, eventList, false);
                            }
                        } else {
                            this.addMessage(botType, `${toolResult.message || 'Aktion konnte nicht ausgeführt werden'}`, false);
                        }
                        
                    } catch (toolError) {
                        console.error('❌ Tool-Fehler:', toolError);
                        this.addMessage(botType, `⚠️ Fehler bei der Ausführung: ${toolError.message}`, false);
                    }
                }
            } else {
                // Normale Text-Antwort
                const reply = assistantMessage.content || "❌ Keine Antwort erhalten.";
                this.addMessage(botType, reply, false);
            }

            console.log("✅ Mistral AI Antwort erfolgreich erhalten");
            
        } catch (err) {
            // Entferne Lade-Indikator falls noch vorhanden
            if (chat.contains(loadingMsg)) {
                chat.removeChild(loadingMsg);
            }
            
            console.error("❌ Fehler bei Mistral AI API:", err);
            this.addMessage(botType, `⚠️ ${err.message}`, false);
        }
    }
}

class MistralManager {
    constructor() {
        this.apiKey = null;
        // Lade gespeicherte Modelle oder verwende Standardwerte
        this.websiteModel = localStorage.getItem('website_model') || 'mistral-large-latest';
        this.whatsappModel = localStorage.getItem('whatsapp_model') || 'mistral-large-latest';
        this.chatManager = new ChatManager(this);
        this.initializeListeners();
    }

    initializeListeners() {
        // Website Bot API Key Validation
        const validateBtn = document.querySelector('.validate-api-btn');
        if (validateBtn) {
            validateBtn.addEventListener('click', () => this.validateApiKey('website'));
        }

        // WhatsApp Bot API Key Validation
        const whatsappValidateBtn = document.querySelector('#whatsappMistralKey + .validate-api-btn');
        if (whatsappValidateBtn) {
            whatsappValidateBtn.addEventListener('click', () => this.validateApiKey('whatsapp'));
        }

        // Model Selection mit Speicherung
        ['website', 'whatsapp'].forEach(botType => {
            const modelSelectId = botType === 'website' ? 'modelSelect' : 'whatsappModelSelect';
            const modelSelect = document.getElementById(modelSelectId);
            
            if (modelSelect) {
                // Setze das gespeicherte Modell in der Auswahl
                modelSelect.value = this[`${botType}Model`];
                
                modelSelect.addEventListener('change', (e) => {
                    const selectedModel = e.target.value;
                    // Speichere das ausgewählte Modell
                    this[`${botType}Model`] = selectedModel;
                    // Speichere im localStorage für Persistenz
                    localStorage.setItem(`${botType}_model`, selectedModel);
                    
                    console.log(`✅ ${botType} Modell geändert zu: ${selectedModel}`);
                    
                    // Visuelle Bestätigung
                    const originalBg = modelSelect.style.backgroundColor;
                    modelSelect.style.backgroundColor = '#d4edda';
                    setTimeout(() => {
                        modelSelect.style.backgroundColor = originalBg;
                    }, 500);
                });
            }
        });

        // Tab Switching
        this.initializeTabSwitching();
    }

    initializeTabSwitching() {
        window.switchTab = (section, tab) => {
            // Remove active class from all buttons and contents
            const buttons = document.querySelectorAll(`.api-tabs .tab-btn`);
            const contents = document.querySelectorAll(`.api-tabs .tab-content`);
            
            buttons.forEach(btn => btn.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected button and content
            const selectedBtn = document.querySelector(`.api-tabs .tab-btn[onclick*="${tab}"]`);
            const selectedContent = document.getElementById(`${tab}Tab`);
            
            if (selectedBtn && selectedContent) {
                selectedBtn.classList.add('active');
                selectedContent.classList.add('active');
            }
        };
    }

    initializeBehaviorListeners() {
        // Role & Personality
        const roleInput = document.getElementById('botRole');
        if (roleInput) {
            roleInput.addEventListener('change', (e) => {
                this.botConfig.role = e.target.value;
            });
        }

        // Welcome Message
        const welcomeInput = document.getElementById('welcomeMessage');
        if (welcomeInput) {
            welcomeInput.addEventListener('change', (e) => {
                this.botConfig.welcomeMessage = e.target.value;
            });
        }

        // Knowledge Restrictions
        const restrictionsInput = document.getElementById('knowledgeRestrictions');
        if (restrictionsInput) {
            restrictionsInput.addEventListener('change', (e) => {
                this.botConfig.knowledgeRestrictions = e.target.value;
            });
        }
    }

    initializeKeywordListeners() {
        // Add Keyword Button
        const addKeywordBtn = document.querySelector('.add-keyword-btn');
        if (addKeywordBtn) {
            addKeywordBtn.addEventListener('click', () => this.addKeywordResponse());
        }

        // Initial Keyword Response Row
        this.addKeywordResponse();
    }

    addKeywordResponse() {
        const keywordResponses = document.querySelector('.keyword-responses');
        if (!keywordResponses) return;

        const newResponse = document.createElement('div');
        newResponse.className = 'keyword-response';
        newResponse.innerHTML = `
            <input type="text" placeholder="Schlüsselwort" class="keyword-input">
            <textarea placeholder="Spezifische Antwort für dieses Schlüsselwort" class="response-input" rows="2"></textarea>
            <button class="btn secondary remove-keyword">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add event listeners
        const removeBtn = newResponse.querySelector('.remove-keyword');
        removeBtn.addEventListener('click', () => {
            newResponse.remove();
            this.updateKeywordResponses();
        });

        const inputs = newResponse.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.updateKeywordResponses());
        });

        keywordResponses.appendChild(newResponse);
    }

    updateKeywordResponses() {
        const responses = [];
        document.querySelectorAll('.keyword-response').forEach(response => {
            const keyword = response.querySelector('.keyword-input').value.trim();
            const answer = response.querySelector('.response-input').value.trim();
            if (keyword && answer) {
                responses.push({ keyword, answer });
            }
        });
        this.botConfig.keywordResponses = responses;
    }

    async testApiKey(apiKey) {
        try {
            const response = await fetch("https://api.mistral.ai/v1/models", {
                headers: { "Authorization": `Bearer ${apiKey}` }
            });
            return response.ok;
        } catch (e) {
            return false;
        }
    }

    async validateApiKey(botType) {
        const apiKeyInput = document.getElementById(botType === 'whatsapp' ? 'whatsappMistralKey' : 'apiKeyInput');
        const statusDiv = document.getElementById(botType === 'whatsapp' ? 'whatsappApiStatus' : 'websiteApiStatus');
        
        if (!apiKeyInput || !statusDiv) return;

        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            this.showApiStatus(botType, false, 'Mistral AI API-Schlüssel ist erforderlich');
            return;
        }

        try {
            statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Überprüfe Mistral AI API-Schlüssel...';
            
            const isValid = await this.testApiKey(apiKey);
            
            if (isValid) {
                this[`${botType}ApiKey`] = apiKey;
                localStorage.setItem("mistral_api_key", apiKey);
                this.showApiStatus(botType, true, 'Mistral AI API-Schlüssel ist gültig');
            } else {
                this.showApiStatus(botType, false, 'Ungültiger Mistral AI API-Schlüssel');
            }
        } catch (error) {
            this.showApiStatus(botType, false, 'Fehler bei der Validierung: ' + error.message);
        }
    }

    createModelConfirmButton(botType) {
        const button = document.createElement('button');
        button.id = `${botType}ModelConfirm`;
        button.className = 'btn primary';
        button.innerHTML = '<i class="fas fa-check"></i> Bestätigen';
        button.disabled = true; // Initial deaktiviert
        
        button.addEventListener('click', () => {
            const modelSelect = document.getElementById(`${botType}ModelSelect`);
            if (modelSelect) {
                this.setModel(botType, modelSelect.value);
                button.disabled = true; // Deaktiviere nach Bestätigung
            }
        });
        
        return button;
    }

    setModel(botType, model) {
        this[`${botType}Model`] = model;
        this.updateStatusMessage(botType, `Modell geändert zu: ${model}`, false);
        console.log(`${botType} Model set to:`, model);
    }

    showApiStatus(botType, isValid, message) {
        const statusDiv = document.getElementById(
            botType === 'whatsapp' ? 'whatsappApiStatus' : 'websiteApiStatus'
        );
        if (!statusDiv) return;

        statusDiv.className = 'api-status ' + (isValid ? 'valid' : 'invalid');
        statusDiv.innerHTML = `
            <i class="fas fa-${isValid ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
    }

    updateParameterDisplay(param, value) {
        const valueDisplay = document.querySelector(`#${param}`).nextElementSibling;
        if (valueDisplay) {
            valueDisplay.textContent = parseFloat(value).toFixed(1);
        }
    }

    getConfig() {
        return {
            apiKey: this.apiKey,
            model: this.model,
            ...this.parameters
        };
    }
}

// Analytics Data
class AnalyticsManager {
    constructor() {
        this.data = {
            conversations: 0,
            messages: 0,
            apiCalls: 0,
            costs: 0
        };
    }

    updateStats(stats) {
        Object.assign(this.data, stats);
        this.updateUI();
    }

    updateUI() {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const key = stat.parentElement.querySelector('h3').textContent.toLowerCase().replace(/ /g, '_');
            if (this.data[key] !== undefined) {
                stat.textContent = this.formatStat(key, this.data[key]);
            }
        });
    }

    formatStat(key, value) {
        switch(key) {
            case 'costs':
                return `€${value.toFixed(2)}`;
            case 'api_calls':
                return value.toLocaleString();
            default:
                return value;
        }
    }
}

// Initialize all managers after class definitions
const apiKeyManager = new APIKeyManager();
const botConfigManager = new BotConfigManager();
const fileManager = new FileManager();
const agentSystem = new AgentSystem(); // WICHTIG: Agent System initialisieren
const mistralManager = new MistralManager();
const analyticsManager = new AnalyticsManager();

// Global functions for inline onclick handlers
window.sendBotInstruction = function(botType) {
    mistralManager.chatManager.sendBotInstruction(botType);
};

window.validateApiKey = function() {
    mistralManager.validateApiKey('website');
};

window.validateWhatsappApiKey = function() {
    mistralManager.validateApiKey('whatsapp');
};

window.saveAgentConfig = function(botType, apiType) {
    agentSystem.saveAgentConfig(botType, apiType);
};

window.initializeGoogleAuth = function(botType) {
    agentSystem.initializeGoogleAuth(botType);
};

window.saveBotPersonality = function(botType) {
    const personalityInput = document.getElementById(`${botType}BotPersonality`);
    if (!personalityInput) return;
    
    const personality = personalityInput.value.trim();
    
    if (!personality) {
        alert('⚠️ Bitte geben Sie eine Bot-Persönlichkeit ein!');
        return;
    }
    
    // Speichere im localStorage
    localStorage.setItem(`${botType}_bot_personality`, personality);
    
    // Speichere im MistralManager
    if (mistralManager && mistralManager.chatManager) {
        mistralManager.chatManager.setPersonality(botType, personality);
    }
    
    // Visuelle Bestätigung
    const originalBg = personalityInput.style.backgroundColor;
    personalityInput.style.backgroundColor = '#d4edda';
    setTimeout(() => {
        personalityInput.style.backgroundColor = originalBg;
    }, 500);
    
    alert(`✅ Bot-Persönlichkeit für ${botType === 'website' ? 'Website Bot' : 'WhatsApp Bot'} gespeichert!`);
};

window.loadPersonalityTemplate = function(botType, template) {
    const templates = {
        // Website Bot Templates
        professional: "Du bist ein professioneller Business-Assistent. Du sprichst deine Kunden immer mit 'Sie' an und verwendest eine formelle Sprache. Du bist höflich, präzise und kompetent. Du gibst strukturierte und gut durchdachte Antworten. Keine Emojis.",
        
        friendly: "Du bist ein freundlicher und hilfsbereiter Assistent. Du sprichst deine Nutzer mit 'Sie' an, aber in einem warmen und zugänglichen Ton. Du bist geduldig, verständnisvoll und gibst klare Antworten. Du darfst gelegentlich ein passendes Emoji verwenden.",
        
        technical: "Du bist ein technischer Support-Spezialist. Du beantwortest Fragen präzise und detailliert. Du erklärst technische Konzepte verständlich und gibst Schritt-für-Schritt-Anleitungen. Du verwendest Fachbegriffe korrekt und bietest bei Bedarf weiterführende Informationen an.",
        
        sales: "Du bist ein engagierter Verkaufsberater. Du bist enthusiastisch, überzeugend und kundenorientiert. Du stellst die Vorteile unserer Produkte hervor, gehst auf Kundenbedürfnisse ein und versuchst, Kaufinteresse zu wecken. Du bist freundlich aber bestimmt.",
        
        // WhatsApp Bot Templates
        casual: "Hey! 😊 Du bist ein lockerer WhatsApp-Bot. Du sprichst die Leute mit 'du' an und verwendest gerne Emojis. Du bist entspannt, freundlich und antwortest kurz und knackig. Du bist wie ein guter Kumpel - hilfsbereit aber nicht steif.",
        
        helpful: "Du bist ein super hilfsbereiter WhatsApp-Assistent! 🤝 Du antwortest schnell, präzise und freundlich. Du verwendest 'du' und ein paar Emojis. Du stellst Rückfragen wenn etwas unklar ist und gibst praktische Tipps.",
        
        fun: "Yo! 🎉 Du bist ein richtig lockerer und spaßiger Bot! Du verwendest viele Emojis 😄✨ und einen jugendlichen Ton. Du bist positiv, energetisch und machst auch mal einen Witz. Aber du hilfst natürlich trotzdem weiter!",
        
        support: "Du bist ein professioneller WhatsApp-Support-Bot. Du hilfst bei Problemen, beantwortest Fragen und bist immer freundlich. Du verwendest 'du' und ein paar passende Emojis. Du bist geduldig, verständnisvoll und lösungsorientiert. 💬"
    };
    
    const personalityInput = document.getElementById(`${botType}BotPersonality`);
    if (personalityInput && templates[template]) {
        personalityInput.value = templates[template];
        
        // Visuelles Feedback
        personalityInput.style.borderColor = '#4caf50';
        setTimeout(() => {
            personalityInput.style.borderColor = '';
        }, 1000);
    }
};

window.useSuggestion = function(botType, suggestionType) {
    const prompts = {
        personality: "Du bist ein freundlicher und professioneller Assistent. Antworte immer höflich und hilfsbereit.",
        greeting: "Begrüße neue Nutzer mit: 'Hallo! Wie kann ich Ihnen heute helfen?'",
        knowledge: "Beantworte nur Fragen zu den hochgeladenen Dokumenten. Bei anderen Themen antworte: 'Das liegt außerhalb meines Wissensbereichs.'",
        keywords: "Wenn jemand 'Termin' sagt, frage: 'Möchten Sie einen Termin vereinbaren oder Ihre Termine einsehen?'"
    };
    
    const input = document.getElementById(`${botType}BotPrompt`);
    if (input && prompts[suggestionType]) {
        input.value = prompts[suggestionType];
    }
};

// Update analytics every minute (simulated)
setInterval(() => {
    analyticsManager.updateStats({
        conversations: Math.floor(Math.random() * 100),
        messages: Math.floor(Math.random() * 1000),
        apiCalls: Math.floor(Math.random() * 5000),
        costs: Math.random() * 10
    });
}, 5000);