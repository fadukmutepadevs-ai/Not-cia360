import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  noticias, 
  CATEGORIAS, 
  type Noticia, 
  type CategoriaType 
} from './data/noticias';
import {
  Menu,
  X,
  Clock,
  Search,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Wifi,
  WifiOff,
  Type,
  ArrowUp,
  Info,
  Mail,
  Shield,
  CheckCircle2,
  Calendar,
  RotateCw
} from 'lucide-react';

// Helper component for bulletproof, fast image loading with category fallback
function ArticleImage({
  src,
  alt,
  category,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
}: {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`w-full h-full min-h-[160px] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white ${className}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 px-2 py-0.5 rounded mb-1 text-white">
          {category || 'Notícia360'}
        </span>
        <p className="text-xs text-slate-300 text-center font-medium line-clamp-2 px-2">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoriaType>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<Noticia | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<'sobre' | 'contacto' | 'privacidade' | null>(null);
  
  // Performance and Accessibility settings stored in localStorage
  const [dataSaver, setDataSaver] = useState<boolean>(() => {
    try {
      return localStorage.getItem('n360_datasaver') === 'true';
    } catch {
      return false;
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('n360_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fast page refresh (recarregar a página inteira de forma rápida)
  const handleFastPageRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 60);
  }, [isRefreshing]);

  // Sync Data Saver with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('n360_datasaver', String(dataSaver));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  }, [dataSaver]);

  // Sync Bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('n360_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  }, [bookmarks]);

  // Toggle bookmark
  const toggleBookmark = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Filtered news calculation (instant client-side filtering)
  const filteredNoticias = useMemo(() => {
    return noticias.filter((noticia) => {
      // Category filter
      const matchesCat = selectedCategory === 'Todas' || noticia.categoria === selectedCategory;
      
      // Bookmark filter
      const matchesBookmark = !showOnlyBookmarks || bookmarks.includes(noticia.id);
      
      // Search filter
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        !q || 
        noticia.titulo.toLowerCase().includes(q) || 
        noticia.resumo.toLowerCase().includes(q) ||
        noticia.categoria.toLowerCase().includes(q) ||
        noticia.tags.some(tag => tag.toLowerCase().includes(q));

      return matchesCat && matchesBookmark && matchesSearch;
    });
  }, [selectedCategory, searchQuery, showOnlyBookmarks, bookmarks]);

  // Destaque principal
  const destaque = useMemo(() => {
    return noticias.find((n) => n.destaque) || noticias[0];
  }, []);

  // Secondary latest news (excluding hero when on "Todas" with no search, to avoid repetition)
  const ultimasNoticias = useMemo(() => {
    if (selectedCategory === 'Todas' && !searchQuery && !showOnlyBookmarks) {
      return filteredNoticias.filter((n) => !n.destaque);
    }
    return filteredNoticias;
  }, [filteredNoticias, selectedCategory, searchQuery, showOnlyBookmarks]);

  // Share handler
  const handleShare = useCallback((article: Noticia, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.titulo,
        text: article.resumo,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${article.titulo} - Notícia360: ${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveArticle(null);
        setInfoModal(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* 1. TOP UTILITY BAR (Optimized for speed & mobile data indicator) */}
      <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              TEMPO REAL
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              28 de Setembro de 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Data Saver Mode Toggle */}
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                dataSaver 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'text-slate-300 hover:text-white'
              }`}
              title={dataSaver ? 'Poupança de dados ativada (Imagens ocultadas)' : 'Ativar poupança de dados móveis'}
            >
              {dataSaver ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {dataSaver ? 'Poupança de Dados: ON' : 'Poupança de Dados'}
              </span>
              <span className="sm:hidden">{dataSaver ? 'Dados ON' : 'Dados'}</span>
            </button>

            {/* Saved Articles Shortcut */}
            <button
              onClick={() => {
                setShowOnlyBookmarks(!showOnlyBookmarks);
                if (activeArticle) setActiveArticle(null);
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                showOnlyBookmarks
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Ver notícias guardadas"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Guardados ({bookmarks.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo & Fast Page Refresh Button - Prominent, larger, and interactive */}
          <button
            onClick={handleFastPageRefresh}
            disabled={isRefreshing}
            className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl p-1.5 hover:bg-blue-50/70 transition-all active:scale-95 cursor-pointer"
            title="Clique para actualizar as notícias rapidamente"
            aria-label="Notícia360 - Clique para actualizar"
          >
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-blue-900 group-hover:text-blue-950 transition-colors flex items-center">
                Notícia<span className="text-red-600">360</span>
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all shadow-xs ${
                isRefreshing 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-blue-50 text-blue-800 border-blue-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
              }`}>
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-white' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span className="hidden sm:inline">
                  {isRefreshing ? 'A Actualizar...' : 'Actualizar'}
                </span>
              </span>
            </div>
            <span className="hidden xl:inline-block text-xs font-semibold text-gray-500 border-l border-gray-300 pl-3">
              Informação rápida. O mundo em foco.
            </span>
          </button>

          {/* Search Bar - Instant Filter */}
          <div className="hidden sm:flex items-center relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-7 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Navegação principal">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowOnlyBookmarks(false);
                  setActiveArticle(null);
                }}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  selectedCategory === cat && !showOnlyBookmarks
                    ? 'text-blue-900 bg-blue-50 font-bold border-b-2 border-blue-900'
                    : 'text-gray-700 hover:text-blue-900 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Compact Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
            {/* Mobile Search */}
            <div className="sm:hidden mb-3 relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categorias</p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowOnlyBookmarks(false);
                    setActiveArticle(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedCategory === cat && !showOnlyBookmarks
                      ? 'bg-blue-900 text-white font-bold'
                      : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Slogan: Informação rápida. O mundo em foco.</span>
            </div>
          </div>
        )}

        {/* 3. CATEGORY CHIP STRIP (Fast non-reloading filter) */}
        <div className="border-t border-gray-100 bg-gray-50/80">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-gray-400 uppercase mr-1 hidden sm:inline">
              Filtro:
            </span>
            {CATEGORIAS.map((cat) => {
              const count = cat === 'Todas' 
                ? noticias.length 
                : noticias.filter((n) => n.categoria === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowOnlyBookmarks(false);
                    setActiveArticle(null);
                  }}
                  className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium transition-all ${
                    selectedCategory === cat && !showOnlyBookmarks
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {cat}
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat && !showOnlyBookmarks
                      ? 'bg-blue-800 text-blue-100' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Active Filter or Search Notice */}
        {(selectedCategory !== 'Todas' || searchQuery || showOnlyBookmarks) && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-900">
                {showOnlyBookmarks ? 'Artigos Guardados' : `Filtrando por: ${selectedCategory}`}
              </span>
              {searchQuery && (
                <span className="text-blue-700">
                  com o termo &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </span>
              )}
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                {filteredNoticias.length} resultado{filteredNoticias.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('Todas');
                setSearchQuery('');
                setShowOnlyBookmarks(false);
              }}
              className="text-xs text-blue-700 hover:text-blue-900 underline font-medium"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* 4. DESTAQUE PRINCIPAL (Only shown on 'Todas' when not searching or viewing bookmarks) */}
        {selectedCategory === 'Todas' && !searchQuery && !showOnlyBookmarks && (
          <section className="mb-8" aria-label="Notícia Principal em Destaque">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Hero Image (Compact on mobile, stylish, non-intrusive) */}
                <div className="lg:col-span-5 relative bg-slate-900 flex items-center justify-center overflow-hidden">
                  {!dataSaver ? (
                    <ArticleImage
                      src={destaque.imagem}
                      alt={destaque.imagemAlt}
                      category={destaque.categoria}
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-28 sm:h-36 md:h-44 lg:h-full lg:min-h-[220px]"
                    />
                  ) : (
                    <div className="w-full h-24 sm:h-28 flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-3 text-center">
                      <WifiOff className="w-5 h-5 mb-1 text-slate-400" />
                      <p className="text-xs font-medium">Modo Poupança de Dados Ativo</p>
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow uppercase tracking-wider">
                    Destaque
                  </span>
                </div>

                {/* Hero Text Content */}
                <div className="lg:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5">
                      <span className="font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                        {destaque.categoria}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {destaque.data} • {destaque.hora}
                      </span>
                    </div>

                    <h2 
                      onClick={() => setActiveArticle(destaque)}
                      className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 hover:text-blue-900 cursor-pointer leading-tight mb-3 transition-colors"
                    >
                      {destaque.titulo}
                    </h2>

                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 lg:line-clamp-4 mb-4">
                      {destaque.resumo}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveArticle(destaque)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      Ler notícia
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => toggleBookmark(destaque.id, e)}
                        className={`p-2 rounded-lg border transition-colors ${
                          bookmarks.includes(destaque.id)
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                        title={bookmarks.includes(destaque.id) ? 'Remover dos guardados' : 'Guardar notícia'}
                      >
                        {bookmarks.includes(destaque.id) ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => handleShare(destaque, e)}
                        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                        title="Partilhar notícia"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. SEÇÃO: ÚLTIMAS NOTÍCIAS */}
        <section aria-labelledby="section-ultimas">
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-blue-900">
            <h2 id="section-ultimas" className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-900"></span>
              {showOnlyBookmarks 
                ? 'Artigos Guardados' 
                : selectedCategory === 'Todas' && !searchQuery
                  ? 'Últimas Notícias' 
                  : `Notícias — ${selectedCategory}`}
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {ultimasNoticias.length} {ultimasNoticias.length === 1 ? 'notícia' : 'notícias'}
            </span>
          </div>

          {/* Empty State */}
          {ultimasNoticias.length === 0 ? (
            <div className="text-center py-16 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-base font-medium mb-2">
                Nenhuma notícia encontrada para estes critérios.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Todas');
                  setSearchQuery('');
                  setShowOnlyBookmarks(false);
                }}
                className="mt-2 text-sm text-blue-900 font-semibold underline"
              >
                Voltar a todas as notícias
              </button>
            </div>
          ) : (
            /* Fast News Grid/List */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ultimasNoticias.map((item) => {
                const isBookmarked = bookmarks.includes(item.id);
                return (
                  <article
                    key={item.id}
                    onClick={() => setActiveArticle(item)}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Compact thumbnail with native lazy loading & explicit aspect ratio to prevent CLS */}
                      {!dataSaver && (
                        <div className="relative aspect-video bg-gray-100 overflow-hidden">
                          <ArticleImage
                            src={item.imagem}
                            alt={item.imagemAlt}
                            category={item.categoria}
                            loading="lazy"
                            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 z-10 bg-blue-950/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            {item.categoria}
                          </span>
                        </div>
                      )}

                      <div className="p-4 sm:p-5">
                        {dataSaver && (
                          <div className="mb-2">
                            <span className="bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                              {item.categoria}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <time dateTime="2026-09-28">{item.data} • {item.hora}</time>
                        </div>

                        <h3 className="font-bold text-gray-900 group-hover:text-blue-900 text-base leading-snug mb-2 line-clamp-2">
                          {item.titulo}
                        </h3>

                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {item.resumo}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Metadata and Quick Actions */}
                    <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-blue-900 font-semibold group-hover:underline inline-flex items-center gap-1">
                        Ler notícia
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => toggleBookmark(item.id, e)}
                          className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
                            isBookmarked ? 'text-amber-600' : 'text-gray-400'
                          }`}
                          title={isBookmarked ? 'Guardado' : 'Guardar'}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 fill-amber-100" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleShare(item, e)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors"
                          title="Partilhar"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 6. INSTANT ARTICLE READER MODAL (Smooth, zero latency, offline friendly) */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveArticle(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reader Header Actions */}
            <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-900 text-white px-2.5 py-1 rounded">
                  {activeArticle.categoria}
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  {activeArticle.tempoLeitura}
                </span>
              </div>

              {/* Reader Controls: Font Size, Bookmark, Share, Close */}
              <div className="flex items-center gap-1.5">
                {/* Font Size Selector */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-0.5 rounded font-medium ${fontSize === 'normal' ? 'bg-gray-200 text-gray-900 font-bold' : 'text-gray-600'}`}
                    title="Tamanho de texto normal"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-0.5 rounded font-medium ${fontSize === 'large' ? 'bg-gray-200 text-gray-900 font-bold' : 'text-gray-600'}`}
                    title="Tamanho de texto grande"
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('huge')}
                    className={`px-2 py-0.5 rounded font-medium ${fontSize === 'huge' ? 'bg-gray-200 text-gray-900 font-bold' : 'text-gray-600'}`}
                    title="Tamanho de texto extra grande"
                  >
                    A++
                  </button>
                </div>

                {/* Bookmark in Reader */}
                <button
                  onClick={() => toggleBookmark(activeArticle.id)}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                    bookmarks.includes(activeArticle.id)
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'border-gray-200 text-gray-600 hover:bg-white'
                  }`}
                  title="Guardar artigo"
                >
                  {bookmarks.includes(activeArticle.id) ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {bookmarks.includes(activeArticle.id) ? 'Guardado' : 'Guardar'}
                  </span>
                </button>

                {/* Share in Reader */}
                <button
                  onClick={() => handleShare(activeArticle)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white text-xs font-medium flex items-center gap-1"
                  title="Partilhar notícia"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Partilhar</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg ml-1"
                  aria-label="Fechar notícia"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Scrollable Body */}
            <div className="p-5 sm:p-8 overflow-y-auto">
              <header className="mb-6">
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-gray-700">{activeArticle.autor}</span>
                  <span>•</span>
                  <time dateTime="2026-09-28">{activeArticle.data} às {activeArticle.hora}</time>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                  {activeArticle.titulo}
                </h1>

                <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed border-l-4 border-blue-900 pl-3 py-0.5">
                  {activeArticle.resumo}
                </p>
              </header>

              {/* Reader Image */}
              {!dataSaver && (
                <figure className="mb-6">
                  <ArticleImage
                    src={activeArticle.imagem}
                    alt={activeArticle.imagemAlt}
                    category={activeArticle.categoria}
                    loading="lazy"
                    className="w-full rounded-lg max-h-[360px] aspect-video"
                  />
                  <figcaption className="text-xs text-gray-400 mt-1.5 text-center">
                    {activeArticle.imagemAlt}
                  </figcaption>
                </figure>
              )}

              {/* Article Paragraphs */}
              <div className={`reader-content text-gray-800 ${
                fontSize === 'normal' ? 'text-base' : fontSize === 'large' ? 'text-lg' : 'text-xl'
              }`}>
                {activeArticle.conteudo.map((paragrafo, idx) => (
                  <p key={idx} className="mb-4 leading-relaxed">
                    {paragrafo}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Tags:</span>
                {activeArticle.tags.map((tag) => (
                  <span 
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setActiveArticle(null);
                    }}
                    className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-900 text-gray-700 px-2.5 py-1 rounded-full cursor-pointer transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Reader Footer: Copied Alert or Next Story */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>Notícia360 — Informação rápida. O mundo em foco.</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-3 py-1 bg-blue-900 text-white rounded font-medium hover:bg-blue-800"
              >
                Voltar à página
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODALS INFORMATIVOS: Sobre, Contacto, Política de Privacidade */}
      {infoModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInfoModal(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-gray-800 relative animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInfoModal(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {infoModal === 'sobre' && (
              <div>
                <div className="flex items-center gap-2 text-blue-900 mb-3">
                  <Info className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Sobre o Notícia360</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  O <strong>Notícia360</strong> é um portal editorial independente concebido com foco absoluto em velocidade, clareza jornalística e respeito ao consumo de dados móveis do leitor.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Nossa arquitetura prioriza o carregamento quase instantâneo, compatibilidade com qualquer celular ou plano de internet e navegação sem anúncios invasivos ou scripts desnecessários.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-950 font-medium">
                  Slogan oficial: &ldquo;Informação rápida. O mundo em foco.&rdquo;
                </div>
              </div>
            )}

            {infoModal === 'contacto' && (
              <div>
                <div className="flex items-center gap-2 text-blue-900 mb-3">
                  <Mail className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Contacto e Redacção</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Tem uma sugestão de pauta, correcção ou deseja anunciar no portal? Entre em contacto com a nossa equipa editorial:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">Redacção Notícia360</p>
                    <p className="text-gray-600 text-xs mt-0.5">redaccao@noticia360.mz</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">Maputo, Moçambique</p>
                    <p className="text-gray-600 text-xs mt-0.5">Av. 25 de Setembro • Edifício Notícias</p>
                  </div>
                </div>
              </div>
            )}

            {infoModal === 'privacidade' && (
              <div>
                <div className="flex items-center gap-2 text-blue-900 mb-3">
                  <Shield className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Política de Privacidade</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  No Notícia360, a privacidade é um princípio elementar. Não coletamos dados de rastreamento comercial nem compartilhamos informações com terceiros.
                </p>
                <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4 mb-4">
                  <li><strong>Armazenamento Local:</strong> Preferências (guardados e modo de poupança de dados) ficam exclusivamente no navegador do utilizador.</li>
                  <li><strong>Zero Bloqueios:</strong> Sem cookies intrusivos ou pop-ups de publicidade.</li>
                  <li><strong>Transparência Total:</strong> Código limpo, estático e de alta segurança.</li>
                </ul>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 text-right">
              <button
                onClick={() => setInfoModal(null)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800"
              >
                Compreendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast alert when link is copied */}
      {copiedLink && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Link copiado para a área de transferência!
        </div>
      )}

      {/* 8. RODAPÉ */}
      <footer className="bg-slate-900 text-slate-400 text-sm mt-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white tracking-tight">
                  Notícia<span className="text-red-500">360</span>
                </span>
                <span className="text-xs text-slate-400">
                  — Informação rápida. O mundo em foco.
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Portal de notícias ultra-leve, desenvolvido para máxima velocidade, responsividade e baixo consumo de dados móveis em qualquer dispositivo.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6 text-xs font-medium">
              <button
                onClick={() => setInfoModal('sobre')}
                className="text-slate-300 hover:text-white transition"
              >
                Sobre
              </button>
              <button
                onClick={() => setInfoModal('contacto')}
                className="text-slate-300 hover:text-white transition"
              >
                Contacto
              </button>
              <button
                onClick={() => setInfoModal('privacidade')}
                className="text-slate-300 hover:text-white transition"
              >
                Política de Privacidade
              </button>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition"
                title="Voltar ao topo"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                Topo
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>© 2026 Notícia360 — Todos os direitos reservados.</p>
            <p className="text-[11px] text-slate-600">
              Otimizado para baixa largura de banda • Sem carrosséis pesados • Sem rastreadores
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
