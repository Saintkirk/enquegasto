export type PlatformSeed = {
  name: string;
  slug: string;
  category: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  priceMonthly?: number | null;
  priceYearly?: number | null;
  priceFamily?: number | null;
};

/** Catálogo EnQuéGasto — categorías + precios referenciales CLP */
export const PLATFORMS: PlatformSeed[] = [
  // 🎬 Streaming
  { name: 'Netflix', slug: 'netflix', category: 'Streaming', websiteUrl: 'https://www.netflix.com', description: 'Series y películas', priceMonthly: 7990, priceFamily: 12990 },
  { name: 'Disney+', slug: 'disney-plus', category: 'Streaming', websiteUrl: 'https://www.disneyplus.com', description: 'Disney, Marvel, Star Wars', priceMonthly: 6990, priceFamily: 10990 },
  { name: 'Max', slug: 'max', category: 'Streaming', websiteUrl: 'https://www.max.com', description: 'HBO y Warner', priceMonthly: 7990, priceFamily: 11990 },
  { name: 'Amazon Prime Video', slug: 'prime-video', category: 'Streaming', websiteUrl: 'https://www.primevideo.com', description: 'Prime Video', priceMonthly: 4990 },
  { name: 'YouTube Premium', slug: 'youtube-premium', category: 'Streaming', websiteUrl: 'https://www.youtube.com/premium', description: 'Sin anuncios + Music', priceMonthly: 7990, priceFamily: 12990 },
  { name: 'Paramount+', slug: 'paramount-plus', category: 'Streaming', websiteUrl: 'https://www.paramountplus.com', description: 'CBS y Paramount', priceMonthly: 5990 },
  { name: 'Star+', slug: 'star-plus', category: 'Streaming', websiteUrl: 'https://www.starplus.com', description: 'ESPN y entretenimiento', priceMonthly: 7990 },
  { name: 'Apple TV+', slug: 'apple-tv-plus', category: 'Streaming', websiteUrl: 'https://tv.apple.com', description: 'Originales Apple', priceMonthly: 4990 },
  { name: 'Crunchyroll', slug: 'crunchyroll', category: 'Streaming', websiteUrl: 'https://www.crunchyroll.com', description: 'Anime', priceMonthly: 4990 },
  { name: 'Vix+', slug: 'vix-plus', category: 'Streaming', websiteUrl: 'https://vix.com', description: 'Contenido en español', priceMonthly: 3990 },
  { name: 'Directv Go', slug: 'directv-go', category: 'Streaming', websiteUrl: 'https://www.directvgo.com', description: 'TV en vivo', priceMonthly: 9990 },
  { name: 'Zapping', slug: 'zapping', category: 'Streaming', websiteUrl: 'https://www.zapping.com', description: 'TV online Chile', priceMonthly: 7990 },
  { name: 'Twitch Turbo', slug: 'twitch-turbo', category: 'Streaming', websiteUrl: 'https://www.twitch.tv', description: 'Sin anuncios', priceMonthly: 5990 },
  { name: 'Mubi', slug: 'mubi', category: 'Streaming', websiteUrl: 'https://mubi.com', description: 'Cine de autor', priceMonthly: 6990 },
  { name: 'Plex Pass', slug: 'plex-pass', category: 'Streaming', websiteUrl: 'https://www.plex.tv', description: 'Media server', priceMonthly: 4990, priceYearly: 39990 },
  { name: 'Pluto TV', slug: 'pluto-tv', category: 'Streaming', websiteUrl: 'https://pluto.tv', description: 'TV gratis con anuncios', priceMonthly: 0 },
  { name: 'Curiosity Stream', slug: 'curiosity-stream', category: 'Streaming', websiteUrl: 'https://curiositystream.com', description: 'Documentales', priceMonthly: 3990 },
  { name: 'Nebula', slug: 'nebula', category: 'Streaming', websiteUrl: 'https://nebula.tv', description: 'Creadores', priceMonthly: 5990 },

  // 🎮 Gaming
  { name: 'Xbox Game Pass', slug: 'xbox-game-pass', category: 'Gaming', websiteUrl: 'https://www.xbox.com/game-pass', description: 'Catálogo Xbox', priceMonthly: 9990 },
  { name: 'PlayStation Plus', slug: 'ps-plus', category: 'Gaming', websiteUrl: 'https://www.playstation.com/ps-plus', description: 'Online + juegos', priceMonthly: 7990, priceYearly: 49990 },
  { name: 'Nintendo Switch Online', slug: 'nintendo-online', category: 'Gaming', websiteUrl: 'https://www.nintendo.com', description: 'Online Switch', priceMonthly: 2990, priceYearly: 19990 },
  { name: 'EA Play', slug: 'ea-play', category: 'Gaming', websiteUrl: 'https://www.ea.com/ea-play', description: 'Juegos EA', priceMonthly: 4990 },
  { name: 'GeForce Now', slug: 'geforce-now', category: 'Gaming', websiteUrl: 'https://www.nvidia.com/geforce-now', description: 'Cloud gaming', priceMonthly: 9990 },
  { name: 'Apple Arcade', slug: 'apple-arcade', category: 'Gaming', websiteUrl: 'https://www.apple.com/apple-arcade', description: 'Juegos móviles', priceMonthly: 4990 },
  { name: 'Steam', slug: 'steam', category: 'Gaming', websiteUrl: 'https://store.steampowered.com', description: 'Juegos PC (compras)', priceMonthly: null },
  { name: 'Epic Games', slug: 'epic-games', category: 'Gaming', websiteUrl: 'https://store.epicgames.com', description: 'Store + free games', priceMonthly: 0 },
  { name: 'Ubisoft+', slug: 'ubisoft-plus', category: 'Gaming', websiteUrl: 'https://plus.ubisoft.com', description: 'Catálogo Ubisoft', priceMonthly: 14990 },
  { name: 'Humble Choice', slug: 'humble-choice', category: 'Gaming', websiteUrl: 'https://www.humblebundle.com', description: 'Juegos mensuales', priceMonthly: 11990 },
  { name: 'Google Play Pass', slug: 'play-pass', category: 'Gaming', websiteUrl: 'https://play.google.com/about/pass', description: 'Juegos Android', priceMonthly: 2990 },
  { name: 'Roblox Premium', slug: 'roblox-premium', category: 'Gaming', websiteUrl: 'https://www.roblox.com', description: 'Robux y beneficios', priceMonthly: 4990 },

  // 🎵 Música
  { name: 'Spotify', slug: 'spotify', category: 'Música', websiteUrl: 'https://www.spotify.com', description: 'Música y podcasts', priceMonthly: 4990, priceFamily: 7990 },
  { name: 'Apple Music', slug: 'apple-music', category: 'Música', websiteUrl: 'https://music.apple.com', description: 'Catálogo Apple', priceMonthly: 4990, priceFamily: 7990 },
  { name: 'YouTube Music', slug: 'youtube-music', category: 'Música', websiteUrl: 'https://music.youtube.com', description: 'Música de YouTube', priceMonthly: 4990 },
  { name: 'Deezer', slug: 'deezer', category: 'Música', websiteUrl: 'https://www.deezer.com', description: 'Música', priceMonthly: 4990, priceFamily: 7990 },
  { name: 'Tidal', slug: 'tidal', category: 'Música', websiteUrl: 'https://tidal.com', description: 'HiFi', priceMonthly: 9990 },
  { name: 'SoundCloud Go', slug: 'soundcloud-go', category: 'Música', websiteUrl: 'https://soundcloud.com', description: 'Música indie', priceMonthly: 4990 },
  { name: 'Amazon Music Unlimited', slug: 'amazon-music', category: 'Música', websiteUrl: 'https://music.amazon.com', description: 'Música Amazon', priceMonthly: 4990 },

  // ⚽ Deportes / Salud
  { name: 'Strava', slug: 'strava', category: 'Deportes', websiteUrl: 'https://www.strava.com', description: 'Running y ciclismo', priceMonthly: 7990 },
  { name: 'Headspace', slug: 'headspace', category: 'Deportes', websiteUrl: 'https://www.headspace.com', description: 'Meditación', priceMonthly: 9990 },
  { name: 'Calm', slug: 'calm', category: 'Deportes', websiteUrl: 'https://www.calm.com', description: 'Sueño y meditación', priceMonthly: 9990 },
  { name: 'MyFitnessPal', slug: 'myfitnesspal', category: 'Deportes', websiteUrl: 'https://www.myfitnesspal.com', description: 'Nutrición', priceMonthly: 4990 },
  { name: 'Peloton', slug: 'peloton', category: 'Deportes', websiteUrl: 'https://www.onepeloton.com', description: 'Entrenamientos', priceMonthly: 12990 },
  { name: 'Fitbit Premium', slug: 'fitbit-premium', category: 'Deportes', websiteUrl: 'https://www.fitbit.com', description: 'Wearables', priceMonthly: 7990 },
  { name: 'Whoop', slug: 'whoop', category: 'Deportes', websiteUrl: 'https://www.whoop.com', description: 'Recovery', priceMonthly: 29990 },
  { name: 'ESPN', slug: 'espn', category: 'Deportes', websiteUrl: 'https://www.espn.com', description: 'Deportes en vivo', priceMonthly: 9990 },

  // 💼 Productividad
  { name: 'Microsoft 365', slug: 'microsoft-365', category: 'Productividad', websiteUrl: 'https://www.microsoft.com/microsoft-365', description: 'Office + OneDrive', priceMonthly: 6990, priceYearly: 69900, priceFamily: 9990 },
  { name: 'Google One', slug: 'google-one', category: 'Productividad', websiteUrl: 'https://one.google.com', description: 'Almacenamiento Google', priceMonthly: 1990, priceYearly: 19900 },
  { name: 'Notion', slug: 'notion', category: 'Productividad', websiteUrl: 'https://www.notion.so', description: 'Notas y wikis', priceMonthly: 9990 },
  { name: 'iCloud+', slug: 'icloud-plus', category: 'Productividad', websiteUrl: 'https://www.apple.com/icloud', description: 'Almacenamiento Apple', priceMonthly: 990 },
  { name: 'Dropbox', slug: 'dropbox', category: 'Productividad', websiteUrl: 'https://www.dropbox.com', description: 'Nube', priceMonthly: 9990 },
  { name: 'Slack', slug: 'slack', category: 'Productividad', websiteUrl: 'https://slack.com', description: 'Chat de equipos', priceMonthly: 7990 },
  { name: 'Zoom Pro', slug: 'zoom-pro', category: 'Productividad', websiteUrl: 'https://zoom.us', description: 'Videollamadas', priceMonthly: 14990 },
  { name: 'LinkedIn Premium', slug: 'linkedin-premium', category: 'Productividad', websiteUrl: 'https://www.linkedin.com/premium', description: 'Networking', priceMonthly: 29990 },
  { name: 'Todoist', slug: 'todoist', category: 'Productividad', websiteUrl: 'https://todoist.com', description: 'Tareas', priceMonthly: 4990 },
  { name: 'Evernote', slug: 'evernote', category: 'Productividad', websiteUrl: 'https://evernote.com', description: 'Notas', priceMonthly: 7990 },
  { name: 'Grammarly Premium', slug: 'grammarly', category: 'Productividad', websiteUrl: 'https://www.grammarly.com', description: 'Escritura', priceMonthly: 11990 },
  { name: 'Trello Premium', slug: 'trello', category: 'Productividad', websiteUrl: 'https://trello.com', description: 'Tableros', priceMonthly: 5990 },
  { name: 'Asana', slug: 'asana', category: 'Productividad', websiteUrl: 'https://asana.com', description: 'Proyectos', priceMonthly: 10990 },
  { name: 'ClickUp', slug: 'clickup', category: 'Productividad', websiteUrl: 'https://clickup.com', description: 'Productividad', priceMonthly: 5990 },

  // 🔐 Seguridad
  { name: 'NordVPN', slug: 'nordvpn', category: 'Seguridad', websiteUrl: 'https://nordvpn.com', description: 'VPN', priceMonthly: 7990, priceYearly: 39990 },
  { name: 'ExpressVPN', slug: 'expressvpn', category: 'Seguridad', websiteUrl: 'https://www.expressvpn.com', description: 'VPN', priceMonthly: 9990 },
  { name: 'Surfshark', slug: 'surfshark', category: 'Seguridad', websiteUrl: 'https://surfshark.com', description: 'VPN', priceMonthly: 4990 },
  { name: '1Password', slug: '1password', category: 'Seguridad', websiteUrl: 'https://1password.com', description: 'Contraseñas', priceMonthly: 3990 },
  { name: 'Bitwarden Premium', slug: 'bitwarden', category: 'Seguridad', websiteUrl: 'https://bitwarden.com', description: 'Contraseñas', priceMonthly: 990 },
  { name: 'LastPass', slug: 'lastpass', category: 'Seguridad', websiteUrl: 'https://www.lastpass.com', description: 'Contraseñas', priceMonthly: 2990 },
  { name: 'Norton 360', slug: 'norton-360', category: 'Seguridad', websiteUrl: 'https://cl.norton.com', description: 'Antivirus', priceMonthly: 4990 },
  { name: 'Dashlane', slug: 'dashlane', category: 'Seguridad', websiteUrl: 'https://www.dashlane.com', description: 'Contraseñas', priceMonthly: 4990 },

  // 🤖 IA
  { name: 'ChatGPT Plus', slug: 'chatgpt-plus', category: 'IA', websiteUrl: 'https://chatgpt.com', description: 'GPT-4 y más', priceMonthly: 19990 },
  { name: 'Claude Pro', slug: 'claude-pro', category: 'IA', websiteUrl: 'https://claude.ai', description: 'Anthropic Claude', priceMonthly: 19990 },
  { name: 'GitHub Copilot', slug: 'github-copilot', category: 'IA', websiteUrl: 'https://github.com/features/copilot', description: 'IA para código', priceMonthly: 9990 },
  { name: 'Midjourney', slug: 'midjourney', category: 'IA', websiteUrl: 'https://www.midjourney.com', description: 'Imágenes con IA', priceMonthly: 9990 },
  { name: 'Cursor', slug: 'cursor', category: 'IA', websiteUrl: 'https://cursor.com', description: 'Editor con IA', priceMonthly: 19990 },
  { name: 'Perplexity Pro', slug: 'perplexity-pro', category: 'IA', websiteUrl: 'https://www.perplexity.ai', description: 'Búsqueda con IA', priceMonthly: 19990 },
  { name: 'Notion AI', slug: 'notion-ai', category: 'IA', websiteUrl: 'https://www.notion.so/product/ai', description: 'IA en Notion', priceMonthly: 9990 },
  { name: 'Runway', slug: 'runway', category: 'IA', websiteUrl: 'https://runwayml.com', description: 'Video IA', priceMonthly: 14990 },
  { name: 'ElevenLabs', slug: 'elevenlabs', category: 'IA', websiteUrl: 'https://elevenlabs.io', description: 'Voz IA', priceMonthly: 4990 },
  { name: 'Gemini Advanced', slug: 'gemini-advanced', category: 'IA', websiteUrl: 'https://gemini.google.com', description: 'Google AI', priceMonthly: 19990 },

  // 🎨 Diseño
  { name: 'Canva Pro', slug: 'canva-pro', category: 'Diseño', websiteUrl: 'https://www.canva.com', description: 'Diseño gráfico', priceMonthly: 9990, priceYearly: 99900 },
  { name: 'Adobe Creative Cloud', slug: 'adobe-cc', category: 'Diseño', websiteUrl: 'https://www.adobe.com', description: 'Photoshop, Premiere…', priceMonthly: 34990 },
  { name: 'Adobe Express', slug: 'adobe-express', category: 'Diseño', websiteUrl: 'https://www.adobe.com/express', description: 'Diseño rápido', priceMonthly: 9990 },
  { name: 'Figma', slug: 'figma', category: 'Diseño', websiteUrl: 'https://www.figma.com', description: 'UI/UX', priceMonthly: 14990 },
  { name: 'CapCut Pro', slug: 'capcut-pro', category: 'Diseño', websiteUrl: 'https://www.capcut.com', description: 'Edición de video', priceMonthly: 7990 },
  { name: 'Envato Elements', slug: 'envato', category: 'Diseño', websiteUrl: 'https://elements.envato.com', description: 'Assets creativos', priceMonthly: 16990 },
  { name: 'Shutterstock', slug: 'shutterstock', category: 'Diseño', websiteUrl: 'https://www.shutterstock.com', description: 'Stock photos', priceMonthly: 24990 },
  { name: 'Unsplash+', slug: 'unsplash-plus', category: 'Diseño', websiteUrl: 'https://unsplash.com/plus', description: 'Fotos premium', priceMonthly: 9990 },

  // 📚 Educación
  { name: 'Duolingo Super', slug: 'duolingo-super', category: 'Educación', websiteUrl: 'https://www.duolingo.com', description: 'Idiomas', priceMonthly: 7990 },
  { name: 'Coursera Plus', slug: 'coursera-plus', category: 'Educación', websiteUrl: 'https://www.coursera.org', description: 'Cursos online', priceMonthly: 39990 },
  { name: 'Domestika', slug: 'domestika', category: 'Educación', websiteUrl: 'https://www.domestika.org', description: 'Cursos creativos', priceMonthly: 9990 },
  { name: 'Skillshare', slug: 'skillshare', category: 'Educación', websiteUrl: 'https://www.skillshare.com', description: 'Cursos creativos', priceMonthly: 9990 },
  { name: 'MasterClass', slug: 'masterclass', category: 'Educación', websiteUrl: 'https://www.masterclass.com', description: 'Clases de expertos', priceMonthly: 14990 },
  { name: 'Udemy', slug: 'udemy', category: 'Educación', websiteUrl: 'https://www.udemy.com', description: 'Cursos (compras)', priceMonthly: null },
  { name: 'Babbel', slug: 'babbel', category: 'Educación', websiteUrl: 'https://www.babbel.com', description: 'Idiomas', priceMonthly: 7990 },
  { name: 'Brilliant', slug: 'brilliant', category: 'Educación', websiteUrl: 'https://brilliant.org', description: 'STEM', priceMonthly: 14990 },

  // 📰 Noticias
  { name: 'El Mercurio Digital', slug: 'el-mercurio', category: 'Noticias', websiteUrl: 'https://digital.elmercurio.com', description: 'Diario chileno', priceMonthly: 9990 },
  { name: 'La Tercera', slug: 'la-tercera', category: 'Noticias', websiteUrl: 'https://www.latercera.com', description: 'Noticias Chile', priceMonthly: 4990 },
  { name: 'Emol', slug: 'emol', category: 'Noticias', websiteUrl: 'https://www.emol.com', description: 'Noticias', priceMonthly: 3990 },
  { name: 'The New York Times', slug: 'nytimes', category: 'Noticias', websiteUrl: 'https://www.nytimes.com', description: 'Noticias', priceMonthly: 4990 },
  { name: 'Washington Post', slug: 'washington-post', category: 'Noticias', websiteUrl: 'https://www.washingtonpost.com', description: 'Noticias', priceMonthly: 4990 },
  { name: 'The Economist', slug: 'the-economist', category: 'Noticias', websiteUrl: 'https://www.economist.com', description: 'Análisis global', priceMonthly: 19990 },
  { name: 'Bloomberg', slug: 'bloomberg', category: 'Noticias', websiteUrl: 'https://www.bloomberg.com', description: 'Finanzas', priceMonthly: 34990 },
  { name: 'Medium', slug: 'medium', category: 'Noticias', websiteUrl: 'https://medium.com', description: 'Artículos', priceMonthly: 4990 },

  // 💰 Finanzas
  { name: 'Fintual', slug: 'fintual', category: 'Finanzas', websiteUrl: 'https://fintual.cl', description: 'Inversiones', priceMonthly: 0 },
  { name: 'Racional', slug: 'racional', category: 'Finanzas', websiteUrl: 'https://racional.cl', description: 'Inversiones', priceMonthly: 0 },
  { name: 'Tenpo', slug: 'tenpo', category: 'Finanzas', websiteUrl: 'https://www.tenpo.cl', description: 'Cuenta digital', priceMonthly: 0 },
  { name: 'MACH', slug: 'mach', category: 'Finanzas', websiteUrl: 'https://www.mach.cl', description: 'Billetera digital', priceMonthly: 0 },
  { name: 'Mercado Pago', slug: 'mercado-pago', category: 'Finanzas', websiteUrl: 'https://www.mercadopago.cl', description: 'Pagos', priceMonthly: 0 },
  { name: 'Binance', slug: 'binance', category: 'Finanzas', websiteUrl: 'https://www.binance.com', description: 'Cripto', priceMonthly: 0 },
  { name: 'Crypto.com', slug: 'crypto-com', category: 'Finanzas', websiteUrl: 'https://crypto.com', description: 'Cripto', priceMonthly: null },

  // 🚗 Delivery / Transporte
  { name: 'Uber One', slug: 'uber-one', category: 'Delivery', websiteUrl: 'https://www.uber.com', description: 'Envíos y viajes', priceMonthly: 4990 },
  { name: 'Rappi Prime', slug: 'rappi-prime', category: 'Delivery', websiteUrl: 'https://www.rappi.cl', description: 'Delivery', priceMonthly: 4990 },
  { name: 'PedidosYa Plus', slug: 'pedidosya-plus', category: 'Delivery', websiteUrl: 'https://www.pedidosya.cl', description: 'Delivery', priceMonthly: 3990 },
  { name: 'Cornershop by Uber', slug: 'cornershop', category: 'Delivery', websiteUrl: 'https://cornershopapp.com', description: 'Supermercado', priceMonthly: null },
  { name: 'Cabify', slug: 'cabify', category: 'Delivery', websiteUrl: 'https://cabify.com', description: 'Viajes', priceMonthly: null },
  { name: 'Didi Club', slug: 'didi-club', category: 'Delivery', websiteUrl: 'https://www.didiglobal.com', description: 'Viajes', priceMonthly: 2990 },

  // 💻 Desarrollo
  { name: 'GitHub Pro', slug: 'github-pro', category: 'Desarrollo', websiteUrl: 'https://github.com', description: 'Repos avanzadas', priceMonthly: 3990 },
  { name: 'Vercel Pro', slug: 'vercel-pro', category: 'Desarrollo', websiteUrl: 'https://vercel.com', description: 'Hosting frontend', priceMonthly: 19990 },
  { name: 'Render', slug: 'render', category: 'Desarrollo', websiteUrl: 'https://render.com', description: 'Hosting backend', priceMonthly: 7000 },
  { name: 'Supabase Pro', slug: 'supabase-pro', category: 'Desarrollo', websiteUrl: 'https://supabase.com', description: 'Backend y DB', priceMonthly: 24990 },
  { name: 'DigitalOcean', slug: 'digitalocean', category: 'Desarrollo', websiteUrl: 'https://www.digitalocean.com', description: 'Cloud VPS', priceMonthly: 6000 },
  { name: 'JetBrains', slug: 'jetbrains', category: 'Desarrollo', websiteUrl: 'https://www.jetbrains.com', description: 'IDEs', priceMonthly: 19990 },
  { name: 'Linear', slug: 'linear', category: 'Desarrollo', websiteUrl: 'https://linear.app', description: 'Issues', priceMonthly: 8000 },
  { name: 'AWS', slug: 'aws', category: 'Desarrollo', websiteUrl: 'https://aws.amazon.com', description: 'Cloud (variable)', priceMonthly: null },

  // 💕 Citas
  { name: 'Tinder Gold', slug: 'tinder-gold', category: 'Citas', websiteUrl: 'https://tinder.com', description: 'Citas premium', priceMonthly: 14990 },
  { name: 'Bumble Premium', slug: 'bumble-premium', category: 'Citas', websiteUrl: 'https://bumble.com', description: 'Citas', priceMonthly: 12990 },
  { name: 'Hinge+', slug: 'hinge-plus', category: 'Citas', websiteUrl: 'https://hinge.co', description: 'Citas', priceMonthly: 14990 },
  { name: 'Badoo Premium', slug: 'badoo-premium', category: 'Citas', websiteUrl: 'https://badoo.com', description: 'Citas', priceMonthly: 9990 },

  // 📡 Telecom Chile
  { name: 'Movistar Fibra', slug: 'movistar-fibra', category: 'Telecom', websiteUrl: 'https://www.movistar.cl', description: 'Internet hogar', priceMonthly: 24990 },
  { name: 'Entel Hogar', slug: 'entel-hogar', category: 'Telecom', websiteUrl: 'https://www.entel.cl', description: 'Internet / TV', priceMonthly: 22990 },
  { name: 'VTR', slug: 'vtr', category: 'Telecom', websiteUrl: 'https://www.vtr.com', description: 'Internet y cable', priceMonthly: 25990 },
  { name: 'WOM Plan', slug: 'wom-plan', category: 'Telecom', websiteUrl: 'https://www.wom.cl', description: 'Plan móvil', priceMonthly: 9990 },
  { name: 'Claro Plan', slug: 'claro-plan', category: 'Telecom', websiteUrl: 'https://www.clarochile.cl', description: 'Plan móvil', priceMonthly: 10990 },
  { name: 'Mundo Pacífico', slug: 'mundo-pacifico', category: 'Telecom', websiteUrl: 'https://www.mundopacifico.cl', description: 'Internet', priceMonthly: 19990 },

  // 📖 Lectura
  { name: 'Kindle Unlimited', slug: 'kindle-unlimited', category: 'Lectura', websiteUrl: 'https://www.amazon.com/kindle-unlimited', description: 'Libros digitales', priceMonthly: 9990 },
  { name: 'Audible', slug: 'audible', category: 'Lectura', websiteUrl: 'https://www.audible.com', description: 'Audiolibros', priceMonthly: 14990 },
  { name: 'Scribd', slug: 'scribd', category: 'Lectura', websiteUrl: 'https://www.scribd.com', description: 'Libros y docs', priceMonthly: 9990 },
  { name: 'Blinkist', slug: 'blinkist', category: 'Lectura', websiteUrl: 'https://www.blinkist.com', description: 'Resúmenes', priceMonthly: 9990 },

  // 📦 Otros
  { name: 'Discord Nitro', slug: 'discord-nitro', category: 'Otros', websiteUrl: 'https://discord.com', description: 'Boost y emotes', priceMonthly: 4990 },
  { name: 'X Premium', slug: 'x-premium', category: 'Otros', websiteUrl: 'https://x.com', description: 'Twitter Blue', priceMonthly: 8990 },
  { name: 'Telegram Premium', slug: 'telegram-premium', category: 'Otros', websiteUrl: 'https://telegram.org', description: 'Chat premium', priceMonthly: 3990 },
  { name: 'Meta Verified', slug: 'meta-verified', category: 'Otros', websiteUrl: 'https://www.meta.com', description: 'Instagram / Facebook', priceMonthly: 7990 },
  { name: 'Snapchat+', slug: 'snapchat-plus', category: 'Otros', websiteUrl: 'https://www.snapchat.com', description: 'Snapchat premium', priceMonthly: 3990 },
  { name: 'Patreon', slug: 'patreon', category: 'Otros', websiteUrl: 'https://www.patreon.com', description: 'Creadores', priceMonthly: null },
  { name: 'Otra (personalizada)', slug: 'otra-personalizada', category: 'Otros', description: 'Suscripción no listada', priceMonthly: null },
];
