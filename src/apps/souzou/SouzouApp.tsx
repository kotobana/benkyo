import React, { useState, useEffect } from 'react';
import { SouzouHub } from './SouzouHub';
import { UiUxThemeDetail } from './uiux/UiUxThemeDetail';
import { MarpSlideDeck } from './uiux/MarpSlideDeck';
import { BurgerDemoSite } from './uiux/demos/BurgerDemoSite';
import { GameRegDemoSite } from './uiux/demos/GameRegDemoSite';
import { SchoolRenrakuDemoSite } from './uiux/demos/SchoolRenrakuDemoSite';
import { UiUxGame } from './uiux/UiUxGame';

interface SouzouAppProps {
  onBackToPortal: () => void;
}

type SubRoute = 
  | { view: 'hub' }
  | { view: 'theme-detail'; themeId: string }
  | { view: 'slides'; themeId: string }
  | { view: 'demo'; themeId: string; demoKey: 'burger' | 'game' | 'school'; mode: 'bad' | 'good' }
  | { view: 'game-all'; themeId: string };

function parseHash(hash: string): SubRoute {
  // e.g., #souzou/uiux/demo/burger?mode=good
  const clean = hash.replace(/^#/, '');
  const [path, queryString] = clean.split('?');
  const params = new URLSearchParams(queryString || '');
  const mode = (params.get('mode') === 'good' ? 'good' : 'bad') as 'bad' | 'good';

  const parts = path.split('/').filter(Boolean);
  // parts[0] === 'souzou'

  if (parts.length <= 1) {
    return { view: 'hub' };
  }

  const themeId = parts[1]; // 'uiux'

  if (parts.length === 2) {
    return { view: 'theme-detail', themeId };
  }

  if (parts[2] === 'slides') {
    return { view: 'slides', themeId };
  }

  if (parts[2] === 'game') {
    return { view: 'game-all', themeId };
  }

  if (parts[2] === 'demo') {
    const demoKey = (parts[3] || 'burger') as 'burger' | 'game' | 'school';
    return { view: 'demo', themeId, demoKey, mode };
  }

  return { view: 'theme-detail', themeId };
}

export const SouzouApp: React.FC<SouzouAppProps> = ({ onBackToPortal }) => {
  const [route, setRoute] = useState<SubRoute>(() => {
    if (window.location.hash.startsWith('#souzou')) {
      return parseHash(window.location.hash);
    }
    return { view: 'hub' };
  });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#souzou')) {
        setRoute(parseHash(window.location.hash));
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateSub = (newRoute: SubRoute) => {
    setRoute(newRoute);
    if (newRoute.view === 'hub') {
      window.location.hash = '#souzou';
    } else if (newRoute.view === 'theme-detail') {
      window.location.hash = `#souzou/${newRoute.themeId}`;
    } else if (newRoute.view === 'slides') {
      window.location.hash = `#souzou/${newRoute.themeId}/slides`;
    } else if (newRoute.view === 'game-all') {
      window.location.hash = `#souzou/${newRoute.themeId}/game`;
    } else if (newRoute.view === 'demo') {
      window.location.hash = `#souzou/${newRoute.themeId}/demo/${newRoute.demoKey}?mode=${newRoute.mode}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ROUTE 1: Standalone Demo Web Sites (Full Window, Real-world feel)
  if (route.view === 'demo') {
    if (route.demoKey === 'burger') {
      return (
        <BurgerDemoSite 
          initialMode={route.mode} 
          onBack={() => navigateSub({ view: 'theme-detail', themeId: route.themeId })}
        />
      );
    }
    if (route.demoKey === 'game') {
      return (
        <GameRegDemoSite 
          initialMode={route.mode}
          onBack={() => navigateSub({ view: 'theme-detail', themeId: route.themeId })}
        />
      );
    }
    if (route.demoKey === 'school') {
      return (
        <SchoolRenrakuDemoSite 
          initialMode={route.mode}
          onBack={() => navigateSub({ view: 'theme-detail', themeId: route.themeId })}
        />
      );
    }
  }

  // ROUTE 2: Marp Slide Deck
  if (route.view === 'slides') {
    return (
      <div className="space-content" style={{ maxWidth: '1100px', padding: '16px' }}>
        <MarpSlideDeck 
          onBack={() => navigateSub({ view: 'theme-detail', themeId: route.themeId })}
          onLaunchDemo={() => navigateSub({ view: 'demo', themeId: route.themeId, demoKey: 'burger', mode: 'bad' })}
        />
      </div>
    );
  }

  // ROUTE 3: All-in-one Game
  if (route.view === 'game-all') {
    return (
      <div className="space-content" style={{ maxWidth: '980px', padding: '16px' }}>
        <UiUxGame 
          onBack={() => navigateSub({ view: 'theme-detail', themeId: route.themeId })}
          onOpenSlides={() => navigateSub({ view: 'slides', themeId: route.themeId })}
        />
      </div>
    );
  }

  // ROUTE 4: Theme Detail (UI/UX Room)
  if (route.view === 'theme-detail') {
    return (
      <div className="space-content" style={{ maxWidth: '980px' }}>
        <UiUxThemeDetail 
          onBackToHub={() => navigateSub({ view: 'hub' })}
          onOpenSlides={() => navigateSub({ view: 'slides', themeId: route.themeId })}
          onOpenDemo={(demoKey, mode) => navigateSub({ view: 'demo', themeId: route.themeId, demoKey, mode })}
          onOpenAllInOneGame={() => navigateSub({ view: 'game-all', themeId: route.themeId })}
        />
      </div>
    );
  }

  // ROUTE 5: Theme Hub (Default level 1)
  return (
    <div className="space-content" style={{ maxWidth: '980px' }}>
      <SouzouHub 
        onBackToPortal={onBackToPortal}
        onSelectTheme={(themeId) => navigateSub({ view: 'theme-detail', themeId })}
        onQuickOpenSlides={() => navigateSub({ view: 'slides', themeId: 'uiux' })}
        onQuickOpenGame={() => navigateSub({ view: 'demo', themeId: 'uiux', demoKey: 'burger', mode: 'bad' })}
      />
    </div>
  );
};
