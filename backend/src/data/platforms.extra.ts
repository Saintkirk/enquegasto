import type { PlatformSeed } from './platforms.seed';

/** Servicios adicionales Chile / deportes / TV local — precios alineados a planes base */
export const EXTRA_PLATFORMS: PlatformSeed[] = [
  { name: 'HBO Max', slug: 'hbo-max', category: 'Streaming', websiteUrl: 'https://www.max.com', description: 'HBO / Max', priceMonthly: 7190, priceYearly: 59900, priceFamily: 11990 },
  { name: 'TNT Sports', slug: 'tnt-sports', category: 'Deportes', websiteUrl: 'https://www.tntsports.cl', description: 'Fútbol y deportes Chile', priceMonthly: 12990 },
  { name: 'DAZN', slug: 'dazn', category: 'Deportes', websiteUrl: 'https://www.dazn.com', description: 'Deportes en vivo', priceMonthly: 9990 },
  { name: 'NBA League Pass', slug: 'nba-league-pass', category: 'Deportes', websiteUrl: 'https://www.nba.com/league-pass', description: 'NBA', priceMonthly: 14990 },
  { name: 'Fanatiz', slug: 'fanatiz', category: 'Deportes', websiteUrl: 'https://www.fanatiz.com', description: 'Fútbol latino', priceMonthly: 7990 },
  { name: 'ESPN Premium', slug: 'espn-premium', category: 'Deportes', websiteUrl: 'https://www.espn.cl', description: 'Deportes (vía Star+)', priceMonthly: 9990 },
  { name: 'Mega Go', slug: 'mega-go', category: 'Streaming', websiteUrl: 'https://www.mega.cl', description: 'TV Mega Chile', priceMonthly: 3990 },
  { name: 'TVN Play', slug: 'tvn-play', category: 'Streaming', websiteUrl: 'https://www.tvn.cl', description: 'TVN streaming', priceMonthly: 2990 },
  { name: 'Canal 13 Go', slug: 'canal-13-go', category: 'Streaming', websiteUrl: 'https://www.13.cl', description: 'Canal 13', priceMonthly: 2990 },
  { name: 'SimpleTV', slug: 'simple-tv', category: 'Streaming', websiteUrl: 'https://www.simple.cl', description: 'TV IPTV Chile', priceMonthly: 9990 },
  { name: 'GTD Fibra', slug: 'gtd-fibra', category: 'Telecom', websiteUrl: 'https://www.gtd.cl', description: 'Internet fibra', priceMonthly: 21990 },
  { name: 'Telsur', slug: 'telsur', category: 'Telecom', websiteUrl: 'https://www.telsur.cl', description: 'Telecom sur', priceMonthly: 18990 },
  { name: 'Jumbo Prime', slug: 'jumbo-prime', category: 'Delivery', websiteUrl: 'https://www.jumbo.cl', description: 'Supermercado Cencosud', priceMonthly: 4990 },
  { name: 'Apple One', slug: 'apple-one', category: 'Productividad', websiteUrl: 'https://www.apple.com/apple-one', description: 'Bundle Apple', priceMonthly: 9990, priceFamily: 14990 },
  { name: 'Paramount+ Essential', slug: 'paramount-essential', category: 'Streaming', websiteUrl: 'https://www.paramountplus.com', description: 'Con anuncios', priceMonthly: 4990 },
  { name: 'Discovery+', slug: 'discovery-plus', category: 'Streaming', websiteUrl: 'https://www.discoveryplus.com', description: 'Documentales', priceMonthly: 4990 },
  { name: 'Acorn TV', slug: 'acorn-tv', category: 'Streaming', websiteUrl: 'https://acorn.tv', description: 'Series británicas', priceMonthly: 5990 },
  { name: 'Cinépolis Klic', slug: 'cinepolis-klic', category: 'Streaming', websiteUrl: 'https://klic.cinepolis.com', description: 'Cine VOD', priceMonthly: null },
  { name: 'Cinemark', slug: 'cinemark', category: 'Otros', websiteUrl: 'https://www.cinemark.cl', description: 'Cine (membresía)', priceMonthly: null },
  { name: 'Club La Tercera', slug: 'club-la-tercera', category: 'Noticias', websiteUrl: 'https://www.latercera.com', description: 'Suscripción diario', priceMonthly: 4990 },
];
