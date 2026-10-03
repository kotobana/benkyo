import React, { useState, useEffect } from 'react';
import { SouzouHub } from './SouzouHub';
import { UiUxThemeDetail } from './uiux/UiUxThemeDetail';
import { MarpSlideDeck } from './uiux/MarpSlideDeck';

interface SouzouAppProps {
  onBackToPortal: () => void;
}

type SubRoute = 
  | { view: 'hub' }
  | { view: 'theme-detail'; themeId: string }
  | { view: 'slides'; themeId: string };

function parseHash(hash: string): SubRoute {
  const clean = hash.replace(/^#/, '');
  const [path] = clean.split('?');
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

  // もし古いリンク等で飛んできた場合も安全にテーマ詳細にフォールバック
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
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ROUTE 1: Marp Slide Deck
  if (route.view === 'slides') {
    return (
      <div className="space-content" style={{ maxWidth: '1100px', padding: '16px' }}>
        <MarpSlideDeck 
          onBack={() => navigateSub({ view: 'theme-detail', themeId: route.themeId })}
        />
      </div>
    );
  }

  // ROUTE 2: Theme Detail (UI/UX Room)
  if (route.view === 'theme-detail') {
    return (
      <div className="space-content" style={{ maxWidth: '980px' }}>
        <UiUxThemeDetail 
          onBackToHub={() => navigateSub({ view: 'hub' })}
          onOpenSlides={() => navigateSub({ view: 'slides', themeId: route.themeId })}
        />
      </div>
    );
  }

  // ROUTE 3: Theme Hub (Default level 1)
  return (
    <div className="space-content" style={{ maxWidth: '980px' }}>
      <SouzouHub 
        onBackToPortal={onBackToPortal}
        onSelectTheme={(themeId) => navigateSub({ view: 'theme-detail', themeId })}
        onQuickOpenSlides={() => navigateSub({ view: 'slides', themeId: 'uiux' })}
        onQuickOpenGame={() => {
          // 独立デモサイト（バーガー・クソUI版）を新しいタブで直接開く
          window.open('/demos/burger-bad/', '_blank');
        }}
      />
    </div>
  );
};
