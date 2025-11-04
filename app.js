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
            
            // Bereinige OAuth-Pending Flag bei Fehler
            ['website', 'whatsapp'].forEach(botType => {
                localStorage.removeItem(`${botType}_oauth_pending`);
                localStorage.removeItem(`${botType}_temp_client_id`);
                localStorage.removeItem(`${botType}_temp_client_secret`);
            });
            
            alert(`Google Autorisierung fehlgeschlagen: ${error}`);
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }
        
        if (code && state) {
            console.log('🔄 OAuth Callback erkannt, tausche Code gegen Token...');
            
            // Parse State um botType zu erhalten
            let botType;
            try {
                // Versuche zuerst direktes Parsen (URLSearchParams hat bereits korrekt dekodiert)
                let stateData;
                try {
                    stateData = JSON.parse(state);
                } catch (innerErr) {
                    // Fallback: decodeURIComponent falls es noch kodiert ist
                    stateData = JSON.parse(decodeURIComponent(state));
                }
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
            
            // Bereinige OAuth-Pending Flag
            localStorage.removeItem(`${botType}_oauth_pending`);
            
            // Bereinige temporäre Credentials
            localStorage.removeItem(`${botType}_temp_client_id`);
            localStorage.removeItem(`${botType}_temp_client_secret`);

            // Bereinige URL (entferne code & state Parameter)
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);

            // Zeige Erfolg
            const statusDiv = document.getElementById(`${botType}GoogleStatus`);
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #22c55e;"><i class="fas fa-check-circle"></i> ✅ Erfolgreich mit Google Calendar verbunden!</span>';
            }

            alert('✅ Google Calendar erfolgreich verbunden!\n\nDu kannst jetzt den Bot nach deinen Terminen fragen.');
            
            // Lade die Seite neu, damit die API-Liste aktualisiert wird
            window.location.reload();

        } catch (error) {
            console.error('❌ Token Exchange Fehler:', error);
            
            // Bereinige OAuth-Pending Flag im Fehlerfall
            localStorage.removeItem(`${botType}_oauth_pending`);
            localStorage.removeItem(`${botType}_temp_client_id`);
            localStorage.removeItem(`${botType}_temp_client_secret`);
            
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
                    
                    // NICHT die UI-Felder Client ID und Client Secret automatisch füllen
                    // Diese sollen immer leer sein - Der Benutzer muss sie selbst eingeben
                    
                    // ABER: Redirect URI kann angezeigt werden (nicht sicherheitsrelevant)
                    const redirectUriInput = document.getElementById(`${botType}GoogleRedirectUri`);
                    if (redirectUriInput && config.redirectUri) {
                        redirectUriInput.value = config.redirectUri;
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
                
                // NICHT die UI-Felder automatisch füllen
                // Client ID und Client Secret sollen immer leer bleiben
                // Der Benutzer muss sie bei jedem Mal selbst eingeben
                
                // Aber: Event Listener für Redirect URI hinzufügen (wird gespeichert)
                const redirectUriInput = document.getElementById(`${botType}GoogleRedirectUri`);
                if (redirectUriInput) {
                    redirectUriInput.addEventListener('input', (e) => {
                        this.agents[botType].googleCalendar.redirectUri = e.target.value.trim();
                        this.saveAgentConfig(botType, 'google');
                    });
                }
                
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
        // Versuche zuerst gespeicherte Config zu laden
        const savedConfig = localStorage.getItem(`${botType}_google_config`);
        let clientId, clientSecret;
        
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                clientId = config.clientId;
                clientSecret = config.clientSecret;
                console.log('✅ Verwende gespeicherte Google Calendar Konfiguration');
            } catch (e) {
                console.error('Fehler beim Laden gespeicherter Config:', e);
            }
        }
        
        // Falls nicht gespeichert, versuche aus Input-Feldern zu lesen
        if (!clientId || !clientSecret) {
            clientId = document.getElementById(`${botType}GoogleClientId`)?.value?.trim();
            clientSecret = document.getElementById(`${botType}GoogleClientSecret`)?.value?.trim();
        }
        
        // Validierung
        if (!clientId) {
            alert('❌ Bitte Client-ID eingeben oder zuerst speichern!');
            return;
        }

        if (!clientSecret) {
            alert('❌ Bitte Clientschlüssel (Client Secret) eingeben oder zuerst speichern!');
            return;
        }

        // WICHTIG: Speichere Credentials in localStorage VOR dem OAuth-Flow
        // (wird später im Callback benötigt)
        this.agents[botType].googleCalendar.clientId = clientId;
        this.agents[botType].googleCalendar.clientSecret = clientSecret;
        
        // WICHTIG: Setze Flag dass OAuth läuft - wird nach erfolgreichem Login verwendet
        localStorage.setItem(`${botType}_oauth_pending`, 'google-calendar');
        
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
        // Füge State unverändert hinzu; URLSearchParams kümmert sich um Encoding.
        authUrl.searchParams.append('state', stateData); // State mit botType

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

// Google Gemini AI API Management
class GeminiManager {
    constructor(agentSystem) {
        this.agentSystem = agentSystem;
        this.apiKey = null;
        this.websiteModel = localStorage.getItem('website_gemini_model') || 'gemini-1.5-flash';
        this.whatsappModel = localStorage.getItem('whatsapp_gemini_model') || 'gemini-1.5-flash';
    }

    async callGemini(botType, userMessage, uploadedFiles = []) {
        const apiKey = localStorage.getItem(`${botType}_gemini_api_key`) || localStorage.getItem('gemini_api_key');
        
        if (!apiKey) {
            throw new Error('❌ Kein Gemini API Key konfiguriert! Bitte API-Schlüssel eingeben.');
        }

        const model = this[`${botType}Model`];
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // System Prompt erstellen
        const systemPrompt = this.buildSystemPrompt(botType, uploadedFiles);
        
        // Gemini API Request
        const requestBody = {
            contents: [{
                parts: [
                    { text: systemPrompt },
                    { text: userMessage }
                ]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000
            }
        };

        console.log('🔷 Gemini Request:', model);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Ungültige Gemini API Antwort');
        }

        const responseText = data.candidates[0].content.parts[0].text;
        
        // Prüfe ob Calendar-Anfrage
        if (responseText.includes('CALENDAR_REQUEST:')) {
            return await this.handleCalendarRequest(botType, responseText, userMessage);
        }

        return responseText;
    }

    buildSystemPrompt(botType, uploadedFiles) {
        const heute = new Date();
        const datumString = heute.toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let prompt = `📅 WICHTIG: Heute ist ${datumString}. Beachte dieses Datum bei allen zeitlichen Anfragen!\n\n`;
        
        // Bot Persönlichkeit
        const personality = localStorage.getItem(`${botType}_bot_personality`) || 
            'Du bist ein freundlicher und hilfsbereiter deutscher Assistent. Antworte immer auf Deutsch.';
        prompt += personality + '\n\n';

        // Agent-Fähigkeiten (Calendar)
        const googleCalendarEnabled = this.agentSystem.agents[botType].googleCalendar.enabled;
        
        if (googleCalendarEnabled) {
            prompt += '🤖 **AGENT-FÄHIGKEITEN - Google Calendar:**\n';
            prompt += 'Du hast Zugriff auf den Google Kalender des Benutzers!\n\n';
            prompt += 'Wenn der Benutzer nach Terminen fragt, antworte EXAKT so:\n';
            prompt += 'CALENDAR_REQUEST: [Zeitraum]\n\n';
            prompt += 'Beispiele:\n';
            prompt += '- "Welche Termine habe ich morgen?" → CALENDAR_REQUEST: morgen\n';
            prompt += '- "Was steht nächste Woche an?" → CALENDAR_REQUEST: nächste Woche\n';
            prompt += '- "Zeig mir meine Termine heute" → CALENDAR_REQUEST: heute\n\n';
        }

        // Hochgeladene Dateien (Wissensbasis)
        if (uploadedFiles.length > 0) {
            prompt += '📁 **WISSENSBASIS:**\n';
            prompt += 'Du hast Zugriff auf folgende hochgeladene Dokumente:\n\n';
            uploadedFiles.forEach((file, index) => {
                prompt += `--- DOKUMENT ${index + 1}: ${file.name} ---\n`;
                prompt += `Dateityp: ${file.type}\n`;
                prompt += `Inhalt:\n${file.content.substring(0, 8000)}\n\n`;
            });
            prompt += '\n💡 **WICHTIG:** Beantworte Fragen basierend auf diesen Dokumenten. Wenn die Antwort in den Dokumenten steht, zitiere relevante Teile.\n\n';
        }

        return prompt;
    }

    async handleCalendarRequest(botType, response, originalMessage) {
        try {
            // Parse Zeitraum aus Response
            const zeitraumMatch = response.match(/CALENDAR_REQUEST:\s*(.+)/i);
            if (!zeitraumMatch) {
                return response.replace(/CALENDAR_REQUEST:.+/i, '');
            }

            const zeitraum = zeitraumMatch[1].trim();
            console.log('📅 Calendar Request erkannt:', zeitraum);

            // Berechne Start/End Datum
            const { start, end } = this.parseZeitraum(zeitraum);

            // Rufe Google Calendar API ab
            const result = await this.agentSystem.listCalendarEvents(
                botType, 
                start.toISOString(), 
                end.toISOString()
            );

            if (result.success && result.events) {
                let eventText = `📅 **Deine Termine (${zeitraum}):**\n\n`;
                
                if (result.events.length === 0) {
                    eventText = `✅ Du hast keine Termine ${zeitraum}.`;
                } else {
                    result.events.forEach((event, i) => {
                        const startDate = new Date(event.start.dateTime || event.start.date);
                        eventText += `${i + 1}. **${event.summary || 'Kein Titel'}**\n`;
                        eventText += `   🕐 ${startDate.toLocaleString('de-DE')}\n`;
                        if (event.location) eventText += `   📍 ${event.location}\n`;
                        if (event.description) eventText += `   📝 ${event.description.substring(0, 100)}\n`;
                        eventText += '\n';
                    });
                }
                
                return eventText;
            } else {
                return `⚠️ ${result.message || 'Fehler beim Abrufen der Termine. Bitte stelle sicher, dass Google Calendar verbunden ist.'}`;
            }

        } catch (error) {
            console.error('Calendar Request Error:', error);
            return `⚠️ Fehler beim Abrufen der Kalender-Daten: ${error.message}`;
        }
    }

    parseZeitraum(zeitraum) {
        const heute = new Date();
        let start = new Date(heute);
        let end = new Date(heute);

        const zeitraumLower = zeitraum.toLowerCase();

        if (zeitraumLower.includes('morgen')) {
            start.setDate(heute.getDate() + 1);
            start.setHours(0, 0, 0, 0);
            end.setDate(heute.getDate() + 1);
            end.setHours(23, 59, 59, 999);
        } else if (zeitraumLower.includes('nächste woche') || zeitraumLower.includes('naechste woche')) {
            // Nächster Montag
            const tagBisMonatg = (8 - heute.getDay()) % 7 || 7;
            start.setDate(heute.getDate() + tagBisMonatg);
            start.setHours(0, 0, 0, 0);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
        } else if (zeitraumLower.includes('diese woche')) {
            // Montag dieser Woche
            const tagBisMonatg = heute.getDay() === 0 ? -6 : 1 - heute.getDay();
            start.setDate(heute.getDate() + tagBisMonatg);
            start.setHours(0, 0, 0, 0);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
        } else {
            // Heute (Standard)
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }

        return { start, end };
    }
}

// Mistral AI API Management
class ChatManager {
    constructor(mistralManager, agentSystem) {
        this.mistralManager = mistralManager;
        this.agentSystem = agentSystem;
        this.geminiManager = new GeminiManager(agentSystem);
        
        // Mache GeminiManager global verfügbar
        window.geminiManager = this.geminiManager;
        
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

        // 🆕 Prüfe ob Gemini oder Mistral verwendet werden soll
        const useGemini = localStorage.getItem(`${botType}_use_gemini`) === 'true';
        
        if (useGemini) {
            return await this.sendGeminiMessage(botType, message);
        } else {
            return await this.sendMistralMessage(botType, message);
        }
    }

    async sendGeminiMessage(botType, message) {
        // Zeige Lade-Indikator
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'chat-message bot';
        loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Denke nach (Gemini)...';
        const chat = document.getElementById(`${botType}BotChat`);
        chat.appendChild(loadingMsg);
        chat.scrollTop = chat.scrollHeight;

        try {
            const uploadedFiles = fileManager.files[botType] || [];
            const response = await this.geminiManager.callGemini(botType, message, uploadedFiles);
            
            // Entferne Lade-Indikator
            chat.removeChild(loadingMsg);
            
            // Zeige Antwort
            this.addMessage(botType, response, false);
            
        } catch (error) {
            console.error('Gemini Error:', error);
            chat.removeChild(loadingMsg);
            this.addMessage(botType, `⚠️ Gemini Fehler: ${error.message}`, false);
        }
    }

    async sendMistralMessage(botType, message) {
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
            const availableTools = this.agentSystem.getAvailableTools(botType);
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
            
            // Verfügbare Modelle in Reihenfolge (vom besten zum günstigsten als Fallback)
            const availableModels = [
                this.mistralManager[`${botType}Model`] || "mistral-large-latest",
                "mistral-small-latest",
                "open-mistral-7b",
                "open-mixtral-8x7b"
            ];

            let response = null;
            let lastError = null;
            let usedModel = null;

            // Versuche Modelle in Reihenfolge bis eines funktioniert
            for (const model of availableModels) {
                try {
                    // Bereite API-Request vor
                    const requestBody = {
                        model: model,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 2000
                    };

                    // Füge Tools hinzu, falls verfügbar (Mistral AI Function Calling)
                    if (availableTools.length > 0) {
                        requestBody.tools = availableTools;
                        requestBody.tool_choice = 'auto';
                    }
                    
                    console.log(`🔄 Versuche Modell: ${model}`);
                    
                    // Anfrage an Mistral AI-API senden
                    response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`
                        },
                        body: JSON.stringify(requestBody)
                    });

                    // Wenn erfolgreich (Status 200), beende die Schleife
                    if (response.ok) {
                        usedModel = model;
                        console.log(`✅ Erfolgreich mit Modell: ${model}`);
                        break;
                    }

                    // Bei 503 (Service unavailable) oder 529 (capacity exceeded) - versuche nächstes Modell
                    const errorData = await response.json().catch(() => ({}));
                    if (response.status === 503 || response.status === 529 || 
                        (errorData.message && errorData.message.includes('capacity exceeded'))) {
                        console.warn(`⚠️ Modell ${model} überlastet, versuche nächstes...`);
                        lastError = `Modell ${model} überlastet`;
                        continue; // Versuche nächstes Modell
                    }

                    // Bei anderen Fehlern (401, 400, etc.) - sofort abbrechen
                    lastError = errorData.message || response.statusText;
                    break;

                } catch (fetchError) {
                    console.error(`❌ Fehler mit Modell ${model}:`, fetchError);
                    lastError = fetchError.message;
                    continue; // Versuche nächstes Modell
                }
            }

            // Entferne Lade-Indikator
            chat.removeChild(loadingMsg);

            if (!response || !response.ok) {
                let errorMessage = `API-Fehler: `;
                
                if (response && response.status === 401) {
                    errorMessage += "Ungültiger API-Schlüssel.\n\n";
                    errorMessage += "📋 So beheben Sie das Problem:\n";
                    errorMessage += "1. Geben Sie Ihren Mistral AI API-Key oben ein\n";
                    errorMessage += "2. Klicken Sie auf 'Validieren'\n";
                    errorMessage += "3. Warten Sie auf die grüne Bestätigung\n";
                    errorMessage += "4. Versuchen Sie es dann erneut\n\n";
                    errorMessage += "💡 Sie benötigen einen API-Key von: https://console.mistral.ai/";
                } else if (response && response.status === 429) {
                    errorMessage += "Rate Limit erreicht. Bitte warten Sie einen Moment.";
                } else if (response && response.status === 400) {
                    const errorData = await response.json().catch(() => ({}));
                    errorMessage += errorData.message || "Ungültige Anfrage. Überprüfen Sie die Parameter.";
                } else {
                    errorMessage += lastError || "Alle Modelle sind derzeit überlastet. Bitte versuchen Sie es später erneut.";
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Zeige verwendetes Modell an (falls Fallback verwendet wurde)
            if (usedModel !== (this.mistralManager[`${botType}Model`] || "mistral-large-latest")) {
                this.addMessage(botType, `ℹ️ Hinweis: Primäres Modell überlastet. Verwende ${usedModel} als Fallback.`, false);
            }
            
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
                        const toolResult = await this.agentSystem.executeTool(botType, toolName, toolArgs);
                        
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
    constructor(agentSystem) {
        this.apiKey = null;
        this.agentSystem = agentSystem;
        // Lade gespeicherte Modelle oder verwende Standardwerte
        this.websiteModel = localStorage.getItem('website_model') || 'mistral-large-latest';
        this.whatsappModel = localStorage.getItem('whatsapp_model') || 'mistral-large-latest';
        this.chatManager = new ChatManager(this, agentSystem);
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
const mistralManager = new MistralManager(agentSystem); // Pass agentSystem to MistralManager
const analyticsManager = new AnalyticsManager();

// Make agentSystem globally available
window.agentSystem = agentSystem;

// Global functions for inline onclick handlers
window.sendBotInstruction = function(botType) {
    mistralManager.chatManager.sendBotInstruction(botType);
};

// 🆕 UNIFIED API VALIDATION - KOMPLETT NEU - erkennt automatisch Mistral oder Gemini
window.validateApiKey = async function(botType) {
    console.log(`🔍 VALIDATION STARTED for ${botType}`);
    
    const keyInputId = botType === 'whatsapp' ? 'whatsappMistralKey' : 'apiKeyInput';
    const keyInput = document.getElementById(keyInputId);
    const statusDiv = document.getElementById(`${botType}ApiStatus`);
    
    const apiKey = keyInput.value.trim();
    
    if (!apiKey) {
        statusDiv.innerHTML = '<span style="color: #ef4444;">⚠️ Bitte API-Schlüssel eingeben!</span>';
        console.error('❌ Kein API-Key eingegeben!');
        return;
    }
    
    // Hole ausgewähltes Modell
    const modelSelectId = botType === 'whatsapp' ? 'whatsappModelSelect' : 'modelSelect';
    const modelSelect = document.getElementById(modelSelectId);
    const selectedModel = modelSelect.value;
    
    // Prüfe ob Gemini oder Mistral basierend auf Modell
    const isGemini = selectedModel.startsWith('gemini');
    const apiName = isGemini ? 'Google Gemini' : 'Mistral AI';
    
    console.log(`📊 Ausgewähltes Modell: ${selectedModel}`);
    console.log(`🔍 API Typ: ${apiName}`);
    console.log(`🔑 API Key (erste 10 Zeichen): ${apiKey.substring(0, 10)}...`);
    
    statusDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Validiere ${apiName}...`;
    
    try {
        if (isGemini) {
            console.log('🔵 Validiere GEMINI API...');
            // Validiere Gemini API
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro?key=${apiKey}`;
            console.log(`📡 Gemini URL: ${url.substring(0, 80)}...`);
            
            const response = await fetch(url);
            console.log(`📥 Gemini Response Status: ${response.status}`);
            
            if (response.ok) {
                statusDiv.innerHTML = '<span style="color: #10b981; font-weight: 600;">✅ Google Gemini API-Schlüssel gültig!</span>';
                localStorage.setItem(`${botType}_gemini_api_key`, apiKey);
                localStorage.setItem(`${botType}_use_gemini`, 'true');
                console.log('✅ GEMINI API-Key gültig und gespeichert!');
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || 'API-Schlüssel ungültig';
                statusDiv.innerHTML = `<span style="color: #ef4444; font-weight: 600;">❌ Ungültiger Google Gemini API-Schlüssel</span><br><small style="color: #64748b;">${errorMsg}</small>`;
                console.error(`❌ GEMINI Validierung fehlgeschlagen: ${errorMsg}`);
            }
        } else {
            console.log('🟠 Validiere MISTRAL API...');
            // Validiere Mistral API
            const response = await fetch("https://api.mistral.ai/v1/models", {
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            });
            console.log(`📥 Mistral Response Status: ${response.status}`);
            
            if (response.ok) {
                statusDiv.innerHTML = '<span style="color: #10b981; font-weight: 600;">✅ Mistral AI API-Schlüssel gültig!</span>';
                localStorage.setItem(`${botType}_mistral_api_key`, apiKey);
                if (botType === 'website') localStorage.setItem("mistral_api_key", apiKey);
                localStorage.setItem(`${botType}_use_gemini`, 'false');
                console.log('✅ MISTRAL API-Key gültig und gespeichert!');
            } else {
                statusDiv.innerHTML = '<span style="color: #ef4444; font-weight: 600;">❌ Ungültiger Mistral AI API-Schlüssel</span><br><small style="color: #64748b;">Bitte prüfen Sie Ihren API-Key</small>';
                console.error(`❌ MISTRAL Validierung fehlgeschlagen: ${response.status}`);
            }
        }
    } catch (error) {
        statusDiv.innerHTML = `<span style="color: #ef4444; font-weight: 600;">❌ ${apiName} Fehler</span><br><small style="color: #64748b;">${error.message}</small>`;
        console.error(`❌ FEHLER bei ${apiName} Validierung:`, error);
    }
};

// 🆕 HANDLE MODEL CHANGE - aktualisiert Label und Placeholder
window.handleModelChange = function(botType) {
    const modelSelectId = botType === 'whatsapp' ? 'whatsappModelSelect' : 'modelSelect';
    const modelSelect = document.getElementById(modelSelectId);
    const selectedModel = modelSelect.value;
    
    const isGemini = selectedModel.startsWith('gemini');
    
    console.log(`🔄 ${botType} Model gewechselt zu: ${selectedModel} (${isGemini ? 'Gemini' : 'Mistral'})`);
    
    // Update API-Key Label
    const labelId = `${botType}ApiKeyLabel`;
    const label = document.getElementById(labelId);
    if (label) {
        label.textContent = isGemini ? 'Google Gemini API-Schlüssel' : 'Mistral AI API-Schlüssel';
        console.log(`✓ Label aktualisiert: ${label.textContent}`);
    }
    
    // Update Placeholder
    const keyInputId = botType === 'whatsapp' ? 'whatsappMistralKey' : 'apiKeyInput';
    const keyInput = document.getElementById(keyInputId);
    if (keyInput) {
        keyInput.placeholder = isGemini 
            ? 'Google Gemini API-Schlüssel (AIza...)' 
            : 'Mistral AI API-Schlüssel eingeben...';
    }
    
    // Lade gespeicherten API-Key
    const savedKey = isGemini 
        ? localStorage.getItem(`${botType}_gemini_api_key`) 
        : localStorage.getItem(`${botType}_mistral_api_key`) || localStorage.getItem("mistral_api_key");
    
    if (keyInput) {
        if (savedKey) {
            keyInput.value = savedKey;
            console.log(`✓ Gespeicherter ${isGemini ? 'Gemini' : 'Mistral'} Key geladen`);
        } else {
            keyInput.value = '';
            console.log(`ℹ Kein gespeicherter ${isGemini ? 'Gemini' : 'Mistral'} Key gefunden`);
        }
    }
    
    // Speichere Modell-Auswahl und setze use_gemini Flag
    if (isGemini) {
        localStorage.setItem(`${botType}_gemini_model`, selectedModel);
        localStorage.setItem(`${botType}_use_gemini`, 'true');
        // Aktualisiere GeminiManager Modell
        if (window.geminiManager) {
            window.geminiManager[`${botType}Model`] = selectedModel;
            console.log(`✓ GeminiManager Model aktualisiert: ${selectedModel}`);
        }
    } else {
        localStorage.setItem(`${botType}_model`, selectedModel);
        localStorage.setItem(`${botType}_use_gemini`, 'false');
        mistralManager[`${botType}Model`] = selectedModel;
        console.log(`✓ MistralManager Model aktualisiert: ${selectedModel}`);
    }
    
    // Status zurücksetzen
    const statusDiv = document.getElementById(`${botType}ApiStatus`);
    if (statusDiv) {
        statusDiv.innerHTML = '';
    }
    
    console.log(`✓ use_gemini Flag gesetzt auf: ${localStorage.getItem(botType + '_use_gemini')}`);
};

// 🆕 SAVE API KEY - universal für beide APIs
window.saveApiKey = function(botType) {
    const keyInputId = botType === 'whatsapp' ? 'whatsappMistralKey' : 'apiKeyInput';
    const keyInput = document.getElementById(keyInputId);
    const apiKey = keyInput.value.trim();
    
    if (!apiKey) {
        alert('⚠️ Bitte API-Schlüssel eingeben!');
        return;
    }
    
    // Prüfe ob Gemini oder Mistral
    const modelSelectId = botType === 'whatsapp' ? 'whatsappModelSelect' : 'modelSelect';
    const modelSelect = document.getElementById(modelSelectId);
    const selectedModel = modelSelect.value;
    const isGemini = selectedModel.startsWith('gemini');
    
    console.log(`💾 Speichere ${isGemini ? 'Gemini' : 'Mistral'} API-Key für ${botType}...`);
    
    if (isGemini) {
        localStorage.setItem(`${botType}_gemini_api_key`, apiKey);
        localStorage.setItem(`${botType}_use_gemini`, 'true');
        console.log(`✅ Gemini Key gespeichert unter: ${botType}_gemini_api_key`);
        alert('✅ Gemini API-Schlüssel gespeichert!\n\n💡 Tipp: Klicken Sie auf "Validieren" um den Key zu testen.');
    } else {
        localStorage.setItem(`${botType}_mistral_api_key`, apiKey);
        if (botType === 'website') localStorage.setItem("mistral_api_key", apiKey);
        localStorage.setItem(`${botType}_use_gemini`, 'false');
        console.log(`✅ Mistral Key gespeichert unter: ${botType}_mistral_api_key`);
        alert('✅ Mistral AI API-Schlüssel gespeichert!\n\n💡 Tipp: Klicken Sie auf "Validieren" um den Key zu testen.');
    }
};

window.validateWhatsappApiKey = function() {
    validateApiKey('whatsapp');
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

// ============================================
// API MANAGEMENT SYSTEM - REDESIGNED
// ============================================

let currentBotType = null;
let currentDropdownButton = null;
const connectedApis = {
    website: [],
    whatsapp: []
};

// Open API Selection Dropdown
window.openApiModal = function(botType) {
    currentBotType = botType;
    const dropdown = document.getElementById('apiSelectionDropdown');
    const button = event.target.closest('.add-api-button');
    
    // Toggle dropdown
    if (dropdown.classList.contains('active')) {
        closeApiModal();
    } else {
        // Position dropdown below button
        const buttonRect = button.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = (buttonRect.bottom + 5) + 'px';
        dropdown.style.left = buttonRect.left + 'px';
        dropdown.classList.add('active');
        currentDropdownButton = button;
        
        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 100);
    }
};

// Handle click outside dropdown
function handleOutsideClick(e) {
    const dropdown = document.getElementById('apiSelectionDropdown');
    if (!dropdown.contains(e.target) && !e.target.closest('.add-api-button')) {
        closeApiModal();
    }
}

// Close API Selection Dropdown
window.closeApiModal = function() {
    const dropdown = document.getElementById('apiSelectionDropdown');
    dropdown.classList.remove('active');
    document.removeEventListener('click', handleOutsideClick);
    currentBotType = null;
    currentDropdownButton = null;
};

// Add API to bot
window.addApi = function(apiType) {
    if (!currentBotType) return;
    
    // Check if API already added
    if (connectedApis[currentBotType].includes(apiType)) {
        alert('✋ Diese API wurde bereits hinzugefügt!');
        return;
    }
    
    // Add to list
    connectedApis[currentBotType].push(apiType);
    
    // Render API item
    renderConnectedApi(currentBotType, apiType);
    
    // Update counter
    updateApiCounter(currentBotType);
    
    // Close modal
    closeApiModal();
};

// Remove API from bot
window.removeApi = function(botType, apiType) {
    if (!confirm('⚠️ Möchten Sie diese API-Verbindung wirklich entfernen?\n\nAlle Konfigurationsdaten gehen verloren.')) return;
    
    // Remove from list
    const index = connectedApis[botType].indexOf(apiType);
    if (index > -1) {
        connectedApis[botType].splice(index, 1);
    }
    
    // Remove from DOM
    const apiItem = document.getElementById(`${botType}-${apiType}-connected`);
    if (apiItem) {
        apiItem.remove();
    }
    
    // Update counter
    updateApiCounter(botType);
    
    // Clean up localStorage
    if (apiType === 'google-calendar') {
        localStorage.removeItem(`${botType}_agent_google`);
        localStorage.removeItem(`${botType}_temp_client_id`);
        localStorage.removeItem(`${botType}_temp_client_secret`);
    } else if (apiType === 'outlook-calendar') {
        localStorage.removeItem(`${botType}_agent_outlook`);
        localStorage.removeItem(`${botType}_temp_outlook_client_id`);
        localStorage.removeItem(`${botType}_temp_outlook_client_secret`);
    }
};

// Update API counter
function updateApiCounter(botType) {
    const count = connectedApis[botType].length;
    const counterEl = document.getElementById(`${botType}ApiCount`);
    const activeApisList = document.getElementById(`${botType}ActiveApis`);
    
    if (counterEl) {
        counterEl.textContent = `${count} ${count === 1 ? 'aktiv' : 'aktiv'}`;
    }
    
    // Show/hide empty state
    if (activeApisList) {
        const emptyState = activeApisList.querySelector('.empty-state');
        if (count === 0 && !emptyState) {
            activeApisList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Keine APIs verbunden</p>
                    <small>Klicken Sie auf "+ API hinzufügen", um zu starten</small>
                </div>
            `;
        } else if (count > 0 && emptyState) {
            emptyState.remove();
        }
    }
}

// Render Connected API in UI
function renderConnectedApi(botType, apiType) {
    const activeApisList = document.getElementById(`${botType}ActiveApis`);
    if (!activeApisList) return;
    
    // Remove empty state if exists
    const emptyState = activeApisList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    let apiHtml = '';
    let apiName = '';
    let apiDesc = '';
    let iconClass = '';
    let iconColor = '';
    
    // Check connection status
    let isConnected = false;
    if (apiType === 'google-calendar') {
        apiName = 'Google Calendar';
        apiDesc = 'Termine verwalten';
        iconClass = 'fab fa-google';
        iconColor = 'google';
        
        const config = localStorage.getItem(`${botType}_google_config`);
        if (config) {
            try {
                const parsedConfig = JSON.parse(config);
                isConnected = !!parsedConfig.accessToken;
            } catch (e) {}
        }
    } else if (apiType === 'outlook-calendar') {
        apiName = 'Outlook Calendar';
        apiDesc = 'Microsoft 365 Kalender';
        iconClass = 'fab fa-microsoft';
        iconColor = 'microsoft';
        
        const config = localStorage.getItem(`${botType}_outlook_config`);
        if (config) {
            try {
                const parsedConfig = JSON.parse(config);
                isConnected = !!parsedConfig.accessToken;
            } catch (e) {}
        }
    }
    
    // Status badge
    const statusBadge = isConnected 
        ? '<span class="api-status-badge connected">✓ Verbunden</span>' 
        : '<span class="api-status-badge configured">⚙ Konfiguriert</span>';
    
    apiHtml = `
        <div class="connected-api-item compact" id="${botType}-${apiType}-connected">
            <div class="connected-api-header" onclick="toggleApiConfig('${botType}', '${apiType}')">
                <div class="connected-api-title">
                    <div class="connected-api-icon ${iconColor}">
                        <i class="${iconClass}"></i>
                    </div>
                    <div>
                        <h4>${apiName} ${statusBadge}</h4>
                        <p>${apiDesc}</p>
                    </div>
                </div>
                <div class="connected-api-controls" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="toggleApiConfig('${botType}', '${apiType}')" title="Einstellungen">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="api-remove-btn" onclick="removeApi('${botType}', '${apiType}')" title="API entfernen">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="connected-api-config" id="${botType}${apiType.replace(/-/g, '')}Config" style="display: none;">
                ${getApiConfigHtml(botType, apiType)}
            </div>
        </div>
    `;
    
    activeApisList.insertAdjacentHTML('beforeend', apiHtml);
    
    // Auto-load saved config
    loadApiConfig(botType, apiType);
}

// Get API configuration HTML
function getApiConfigHtml(botType, apiType) {
    if (apiType === 'google-calendar') {
        return `
            <div class="input-group" style="margin-bottom: 1rem;">
                <label>Google Client ID</label>
                <input type="text" id="${botType}GoogleClientId" placeholder="Ihre Google OAuth 2.0 Client ID" style="font-family: monospace; font-size: 0.85rem;">
            </div>
            <div class="input-group" style="margin-bottom: 1rem;">
                <label>Google Client Secret</label>
                <input type="password" id="${botType}GoogleClientSecret" placeholder="Ihr Google OAuth 2.0 Client Secret" style="font-family: monospace; font-size: 0.85rem;">
            </div>
            <div class="input-group" style="margin-bottom: 1rem;">
                <label>Redirect URI (automatisch erkannt)</label>
                <input type="text" id="${botType}GoogleRedirectUri" readonly style="background-color: #f0f0f0; font-family: monospace; font-size: 0.85rem;">
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn secondary" onclick="saveApiConfig('${botType}', '${apiType}')" style="flex: 1;">
                    <i class="fas fa-save"></i> Speichern
                </button>
                <button class="btn primary" onclick="initializeGoogleAuth('${botType}')" style="flex: 1;">
                    <i class="fab fa-google"></i> Verbinden
                </button>
            </div>
            <div id="${botType}GoogleStatus" style="margin-top: 0.75rem; font-size: 0.875rem;"></div>
        `;
    } else if (apiType === 'outlook-calendar') {
        return `
            <div class="input-group" style="margin-bottom: 1rem;">
                <label>Microsoft Client ID</label>
                <input type="text" id="${botType}OutlookClientId" placeholder="Ihre Microsoft Azure Application ID" style="font-family: monospace; font-size: 0.85rem;">
            </div>
            <div class="input-group" style="margin-bottom: 1rem;">
                <label>Microsoft Client Secret</label>
                <input type="password" id="${botType}OutlookClientSecret" placeholder="Ihr Microsoft Azure Client Secret" style="font-family: monospace; font-size: 0.85rem;">
            </div>
            <div class="input-group" style="margin-bottom: 1rem;">
                <label>Redirect URI (automatisch erkannt)</label>
                <input type="text" id="${botType}OutlookRedirectUri" readonly style="background-color: #f0f0f0; font-family: monospace; font-size: 0.85rem;">
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn secondary" onclick="saveApiConfig('${botType}', '${apiType}')" style="flex: 1;">
                    <i class="fas fa-save"></i> Speichern
                </button>
                <button class="btn primary" onclick="initializeOutlookAuth('${botType}')" style="flex: 1;">
                    <i class="fab fa-microsoft"></i> Verbinden
                </button>
            </div>
            <div id="${botType}OutlookStatus" style="margin-top: 0.75rem; font-size: 0.875rem;"></div>
        `;
    }
    return '';
}

// Toggle API Configuration
window.toggleApiConfig = function(botType, apiType) {
    const configId = `${botType}${apiType.replace(/-/g, '')}Config`;
    const configDiv = document.getElementById(configId);
    const apiItem = document.getElementById(`${botType}-${apiType}-connected`);
    
    if (configDiv && apiItem) {
        const isOpen = configDiv.style.display === 'block';
        configDiv.style.display = isOpen ? 'none' : 'block';
        
        // Toggle compact class
        if (isOpen) {
            apiItem.classList.add('compact');
        } else {
            apiItem.classList.remove('compact');
        }
    }
};

// Initialize API toggles
function initializeApiToggles(botType, apiType) {
    // Initialize redirect URI automatically
    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    
    if (apiType === 'google-calendar') {
        const redirectUriInput = document.getElementById(`${botType}GoogleRedirectUri`);
        if (redirectUriInput) {
            redirectUriInput.value = redirectUri;
        }
        if (agentSystem) {
            agentSystem.detectRedirectUri();
        }
    } else if (apiType === 'outlook-calendar') {
        const redirectUriInput = document.getElementById(`${botType}OutlookRedirectUri`);
        if (redirectUriInput) {
            redirectUriInput.value = redirectUri;
        }
    }
}

// Save API Configuration
window.saveApiConfig = function(botType, apiType) {
    if (apiType === 'google-calendar') {
        const clientId = document.getElementById(`${botType}GoogleClientId`)?.value || '';
        const clientSecret = document.getElementById(`${botType}GoogleClientSecret`)?.value || '';
        const redirectUri = document.getElementById(`${botType}GoogleRedirectUri`)?.value || '';
        
        if (!clientId.trim() || !clientSecret.trim()) {
            alert('⚠️ Bitte füllen Sie Client ID und Client Secret aus!');
            return;
        }
        
        // Save to localStorage
        const config = {
            clientId: clientId,
            clientSecret: clientSecret,
            redirectUri: redirectUri,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`${botType}_google_config`, JSON.stringify(config));
        
        // WICHTIG: Auch im alten AgentSystem Format speichern (für Kompatibilität)
        if (window.agentSystem && window.agentSystem.agents[botType]) {
            window.agentSystem.agents[botType].googleCalendar.clientId = clientId;
            window.agentSystem.agents[botType].googleCalendar.clientSecret = clientSecret;
            window.agentSystem.agents[botType].googleCalendar.redirectUri = redirectUri;
            window.agentSystem.agents[botType].googleCalendar.enabled = true;
            window.agentSystem.saveAgentConfig(botType, 'google');
        }
        
        // Show success message
        const statusDiv = document.getElementById(`${botType}GoogleStatus`);
        if (statusDiv) {
            statusDiv.innerHTML = '<span style="color: #10b981;"><i class="fas fa-check-circle"></i> ✅ Gespeichert! Konfiguration eingeklappt.</span>';
        }
        
        alert('✅ Google Calendar Konfiguration gespeichert!');
        
        // Close the config panel automatically
        setTimeout(() => {
            toggleApiConfig(botType, apiType);
        }, 1000);
        
    } else if (apiType === 'outlook-calendar') {
        const clientId = document.getElementById(`${botType}OutlookClientId`)?.value || '';
        const clientSecret = document.getElementById(`${botType}OutlookClientSecret`)?.value || '';
        const redirectUri = document.getElementById(`${botType}OutlookRedirectUri`)?.value || '';
        
        if (!clientId.trim() || !clientSecret.trim()) {
            alert('⚠️ Bitte füllen Sie Client ID und Client Secret aus!');
            return;
        }
        
        // Save to localStorage
        const config = {
            clientId: clientId,
            clientSecret: clientSecret,
            redirectUri: redirectUri,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`${botType}_outlook_config`, JSON.stringify(config));
        
        // Show success message
        const statusDiv = document.getElementById(`${botType}OutlookStatus`);
        if (statusDiv) {
            statusDiv.innerHTML = '<span style="color: #10b981;"><i class="fas fa-check-circle"></i> ✅ Gespeichert! Konfiguration eingeklappt.</span>';
        }
        
        alert('✅ Outlook Calendar Konfiguration gespeichert!');
        
        // Close the config panel automatically
        setTimeout(() => {
            toggleApiConfig(botType, apiType);
        }, 1000);
    }
};

// Load API Configuration
function loadApiConfig(botType, apiType) {
    if (apiType === 'google-calendar') {
        const savedConfig = localStorage.getItem(`${botType}_google_config`);
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                
                // Fill in the fields
                const clientIdInput = document.getElementById(`${botType}GoogleClientId`);
                const clientSecretInput = document.getElementById(`${botType}GoogleClientSecret`);
                const redirectUriInput = document.getElementById(`${botType}GoogleRedirectUri`);
                
                if (clientIdInput) clientIdInput.value = config.clientId || '';
                if (clientSecretInput) clientSecretInput.value = config.clientSecret || '';
                if (redirectUriInput) redirectUriInput.value = config.redirectUri || '';
                
                // Show status
                const statusDiv = document.getElementById(`${botType}GoogleStatus`);
                if (statusDiv) {
                    statusDiv.innerHTML = '<span style="color: #64748b;"><i class="fas fa-info-circle"></i> Gespeicherte Konfiguration geladen</span>';
                }
            } catch (e) {
                console.error('Fehler beim Laden der Google Calendar Konfiguration:', e);
            }
        }
    } else if (apiType === 'outlook-calendar') {
        const savedConfig = localStorage.getItem(`${botType}_outlook_config`);
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                
                // Fill in the fields
                const clientIdInput = document.getElementById(`${botType}OutlookClientId`);
                const clientSecretInput = document.getElementById(`${botType}OutlookClientSecret`);
                const redirectUriInput = document.getElementById(`${botType}OutlookRedirectUri`);
                
                if (clientIdInput) clientIdInput.value = config.clientId || '';
                if (clientSecretInput) clientSecretInput.value = config.clientSecret || '';
                if (redirectUriInput) redirectUriInput.value = config.redirectUri || '';
                
                // Show status
                const statusDiv = document.getElementById(`${botType}OutlookStatus`);
                if (statusDiv) {
                    statusDiv.innerHTML = '<span style="color: #64748b;"><i class="fas fa-info-circle"></i> Gespeicherte Konfiguration geladen</span>';
                }
            } catch (e) {
                console.error('Fehler beim Laden der Outlook Calendar Konfiguration:', e);
            }
        }
    }
}

// Initialize Outlook OAuth (Placeholder)
window.initializeOutlookAuth = function(botType) {
    alert('📅 Outlook Calendar Integration\n\nDiese Funktion wird in einem zukünftigen Update verfügbar sein!\n\n✅ Geplante Features:\n• Microsoft 365 Kalender-Synchronisation\n• Termin-Erstellung\n• Verfügbarkeits-Prüfung');
};

// Initialize API Management System
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ API Management System initialized');
    
    // Load saved APIs from localStorage
    loadSavedApis();
    
    // Initialize counters
    updateApiCounter('website');
    updateApiCounter('whatsapp');
    
    // 🆕 Load saved model selections and API keys
    loadModelAndApiSettings();
});

// 🆕 Load Model and API Settings on Page Load
function loadModelAndApiSettings() {
    console.log('🔄 Lade gespeicherte Modell- und API-Einstellungen...');
    
    ['website', 'whatsapp'].forEach(botType => {
        const modelSelectId = botType === 'whatsapp' ? 'whatsappModelSelect' : 'modelSelect';
        const modelSelect = document.getElementById(modelSelectId);
        
        if (!modelSelect) {
            console.warn(`⚠️ Model Select für ${botType} nicht gefunden`);
            return;
        }
        
        // Prüfe ob Gemini verwendet werden soll
        const useGemini = localStorage.getItem(`${botType}_use_gemini`) === 'true';
        
        console.log(`📊 ${botType}: use_gemini = ${useGemini}`);
        
        if (useGemini) {
            // Lade Gemini-Modell
            const geminiModel = localStorage.getItem(`${botType}_gemini_model`) || 'gemini-1.5-flash';
            modelSelect.value = geminiModel;
            console.log(`✓ ${botType}: Gemini Modell geladen: ${geminiModel}`);
            
            // Lade Gemini API-Key
            const geminiKey = localStorage.getItem(`${botType}_gemini_api_key`);
            if (geminiKey) {
                const keyInputId = botType === 'whatsapp' ? 'whatsappMistralKey' : 'apiKeyInput';
                const keyInput = document.getElementById(keyInputId);
                if (keyInput) {
                    keyInput.value = geminiKey;
                    console.log(`✓ ${botType}: Gemini API-Key geladen (${geminiKey.substring(0, 10)}...)`);
                }
            }
        } else {
            // Lade Mistral-Modell
            const mistralModel = localStorage.getItem(`${botType}_model`) || 'mistral-large-latest';
            modelSelect.value = mistralModel;
            console.log(`✓ ${botType}: Mistral Modell geladen: ${mistralModel}`);
            
            // Lade Mistral API-Key
            const mistralKey = localStorage.getItem(`${botType}_mistral_api_key`) || 
                              (botType === 'website' ? localStorage.getItem("mistral_api_key") : null);
            if (mistralKey) {
                const keyInputId = botType === 'whatsapp' ? 'whatsappMistralKey' : 'apiKeyInput';
                const keyInput = document.getElementById(keyInputId);
                if (keyInput) {
                    keyInput.value = mistralKey;
                    console.log(`✓ ${botType}: Mistral API-Key geladen (${mistralKey.substring(0, 10)}...)`);
                }
            }
        }
        
        // Trigger handleModelChange um Labels zu aktualisieren
        handleModelChange(botType);
    });
    
    console.log('✅ Modell- und API-Einstellungen geladen');
}

// Load saved APIs on page load
function loadSavedApis() {
    ['website', 'whatsapp'].forEach(botType => {
        // Check for Google Calendar config in AgentSystem (alter Speicherort)
        const oldGoogleConfig = localStorage.getItem(`${botType}_agent_google`);
        if (oldGoogleConfig) {
            try {
                const config = JSON.parse(oldGoogleConfig);
                // Zeige API wenn credentials existieren
                if (config.clientId || config.accessToken) {
                    if (!connectedApis[botType].includes('google-calendar')) {
                        connectedApis[botType].push('google-calendar');
                        renderConnectedApi(botType, 'google-calendar');
                    }
                }
            } catch (e) {
                console.warn(`Failed to load Google Calendar config (agent) for ${botType}:`, e);
            }
        }
        
        // Check for Google Calendar config in new location
        const newGoogleConfig = localStorage.getItem(`${botType}_google_config`);
        if (newGoogleConfig) {
            try {
                const config = JSON.parse(newGoogleConfig);
                // Zeige API wenn Credentials ODER accessToken vorhanden
                if ((config.clientId && config.clientSecret) || config.accessToken) {
                    if (!connectedApis[botType].includes('google-calendar')) {
                        connectedApis[botType].push('google-calendar');
                        renderConnectedApi(botType, 'google-calendar');
                    }
                }
            } catch (e) {
                console.warn(`Failed to load Google Calendar config for ${botType}:`, e);
            }
        }
        
        // Check for Outlook Calendar config
        const outlookConfig = localStorage.getItem(`${botType}_outlook_config`);
        if (outlookConfig) {
            try {
                const config = JSON.parse(outlookConfig);
                // Zeige API wenn entweder credentials ODER accessToken existieren
                if ((config.clientId && config.clientSecret) || config.accessToken) {
                    if (!connectedApis[botType].includes('outlook-calendar')) {
                        connectedApis[botType].push('outlook-calendar');
                        renderConnectedApi(botType, 'outlook-calendar');
                    }
                }
            } catch (e) {
                console.warn(`Failed to load Outlook Calendar config for ${botType}:`, e);
            }
        }
        
        // Update counter after loading
        updateApiCounter(botType);
    });
    
    console.log('📋 Gespeicherte APIs geladen (konfiguriert oder verbunden):', connectedApis);
}


// ======================
// 🤖 CHAT SYSTEM
// ======================
// 🤖 CHAT SYSTEM MIT AGENT INTEGRATION
// ======================

// Chat-Funktion mit AgentSystem Integration
window.sendChatMessage = async function(botType) {
    const messageInput = document.getElementById(`${botType}ChatInput`);
    const messagesContainer = document.getElementById(`${botType}ChatMessages`);
    
    if (!messageInput || !messagesContainer) {
        console.error('Chat elements not found');
        return;
    }
    
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;
    
    // Zeige User-Nachricht
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user';
    userMsgDiv.textContent = userMessage;
    messagesContainer.appendChild(userMsgDiv);
    
    // Clear input
    messageInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Zeige "Bot schreibt..." Indikator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = '<i class="fas fa-circle"></i> <i class="fas fa-circle"></i> <i class="fas fa-circle"></i>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    try {
        // Hole API Key
        const apiKey = localStorage.getItem(`${botType}_mistral_api_key`) || localStorage.getItem('mistral_api_key');
        if (!apiKey) {
            throw new Error('Kein Mistral API Key konfiguriert. Bitte oben eingeben!');
        }
        
        // Hole Bot-Persönlichkeit
        const personality = localStorage.getItem(`${botType}_bot_personality`) || 
            'Du bist ein hilfsbereiter deutscher Assistent mit Zugriff auf Google Calendar.';
        
        // Baue System-Prompt mit aktuellem Datum
        const heute = new Date();
        const datumString = heute.toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let systemPrompt = `📅 WICHTIG: Heute ist ${datumString}.\n\n${personality}`;
        
        // Hole AgentSystem Tools (Google Calendar Integration)
        const availableTools = window.agentSystem.getAvailableTools(botType);
        
        if (availableTools.length > 0) {
            systemPrompt += '\n\n🤖 AGENT-FÄHIGKEITEN:\n';
            systemPrompt += 'Du kannst folgende Aktionen ausführen:\n';
            availableTools.forEach(tool => {
                systemPrompt += `- ${tool.function.name}: ${tool.function.description}\n`;
            });
            systemPrompt += '\nWenn der Benutzer nach Terminen fragt (z.B. "Habe ich morgen einen Termin?"), nutze SOFORT list_calendar_events!\n';
            systemPrompt += 'Beachte das heutige Datum oben für relative Zeitangaben wie "morgen", "übermorgen", etc.';
        }
        
        // Baue Mistral AI Request
        const requestBody = {
            model: 'mistral-large-latest',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 2000
        };
        
        // Füge Tools hinzu falls vorhanden
        if (availableTools.length > 0) {
            requestBody.tools = availableTools;
            requestBody.tool_choice = 'auto';
        }
        
        // Rufe Mistral AI auf
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Mistral API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const assistantMessage = data.choices[0].message;
        
        // Entferne Typing Indicator
        typingDiv.remove();
        
        // Prüfe ob Tool Calls vorhanden sind
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            console.log('🔧 Bot möchte Tools verwenden:', assistantMessage.tool_calls);
            
            // Führe alle Tool Calls aus
            for (const toolCall of assistantMessage.tool_calls) {
                const toolName = toolCall.function.name;
                const toolArgs = JSON.parse(toolCall.function.arguments);
                
                console.log(`🔧 Führe ${toolName} aus mit:`, toolArgs);
                
                const toolResult = await window.agentSystem.executeTool(botType, toolName, toolArgs);
                
                if (toolResult.success && toolResult.events) {
                    // Zeige Termine an
                    let eventText = `📅 **Deine Termine:**\n\n`;
                    
                    if (toolResult.events.length === 0) {
                        eventText = '✅ Du hast keine Termine im angefragten Zeitraum.';
                    } else {
                        toolResult.events.forEach((event, i) => {
                            const start = new Date(event.start.dateTime || event.start.date);
                            const end = new Date(event.end.dateTime || event.end.date);
                            
                            eventText += `${i + 1}. **${event.summary || 'Kein Titel'}**\n`;
                            eventText += `   🕐 ${start.toLocaleString('de-DE')}\n`;
                            if (event.location) eventText += `   📍 ${event.location}\n`;
                            if (event.description) eventText += `   📝 ${event.description}\n`;
                            eventText += '\n';
                        });
                    }
                    
                    const botMsgDiv = document.createElement('div');
                    botMsgDiv.className = 'chat-message bot';
                    botMsgDiv.style.whiteSpace = 'pre-wrap';
                    botMsgDiv.textContent = eventText;
                    messagesContainer.appendChild(botMsgDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    
                } else if (!toolResult.success) {
                    // Zeige Fehler
                    const errorMsgDiv = document.createElement('div');
                    errorMsgDiv.className = 'chat-message bot';
                    errorMsgDiv.style.color = '#ef4444';
                    errorMsgDiv.textContent = toolResult.message || 'Fehler beim Ausführen der Aktion';
                    messagesContainer.appendChild(errorMsgDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }
        } else {
            // Normale Textantwort
            const botResponse = assistantMessage.content || 'Keine Antwort erhalten.';
            const botMsgDiv = document.createElement('div');
            botMsgDiv.className = 'chat-message bot';
            botMsgDiv.textContent = botResponse;
            messagesContainer.appendChild(botMsgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
    } catch (error) {
        console.error('Chat error:', error);
        typingDiv.remove();
        
        const errorMsgDiv = document.createElement('div');
        errorMsgDiv.className = 'chat-message bot';
        errorMsgDiv.style.color = '#ef4444';
        errorMsgDiv.textContent = `⚠️ Fehler: ${error.message}`;
        messagesContainer.appendChild(errorMsgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

// Enter-Taste Support für Chat
document.addEventListener('DOMContentLoaded', () => {
    ['website', 'whatsapp'].forEach(botType => {
        const chatInput = document.getElementById(`${botType}ChatInput`);
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    window.sendChatMessage(botType);
                }
            });
        }
    });
});

