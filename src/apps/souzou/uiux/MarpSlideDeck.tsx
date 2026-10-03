import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  FileCode, 
  Copy, 
  Check, 
  ArrowLeft, 
  Gamepad2, 
  Sparkles,
  X
} from 'lucide-react';
import { UIUX_MARP_MARKDOWN, parseMarpSlides, type ParsedMarpSlide } from './slidesMarp';

interface MarpSlideDeckProps {
  onBack: () => void;
  onLaunchDemo?: (demoKey?: string) => void;
}

export const MarpSlideDeck: React.FC<MarpSlideDeckProps> = ({
  onBack,
  onLaunchDemo
}) => {
  const [slides] = useState<ParsedMarpSlide[]>(() => parseMarpSlides(UIUX_MARP_MARKDOWN));
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Keyboard navigation (Left, Right, Space, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSourceModal) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlideIndex(i => Math.min(i + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (isFullscreen) toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isFullscreen, showSourceModal]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(UIUX_MARP_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const slide = slides[currentSlideIndex];
  const progressPercent = ((currentSlideIndex + 1) / slides.length) * 100;

  return (
    <div className={`marp-deck-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Top Header Bar */}
      <div className="marp-top-bar">
        <div className="bar-left">
          <button className="marp-nav-btn" onClick={onBack}>
            <ArrowLeft size={16} /> テーマ詳細に戻る
          </button>
          <span className="marp-format-badge">Marp Markdown Presentation</span>
        </div>

        <div className="bar-center">
          <span className="marp-slide-counter">
            {currentSlideIndex + 1} <small>/ {slides.length}</small>
          </span>
        </div>

        <div className="bar-right">
          <button 
            className="marp-tool-btn"
            onClick={() => setShowSourceModal(true)}
            title="Marp Markdownソースコードを表示・コピー"
          >
            <FileCode size={15} /> Marpソース
          </button>
          <button 
            className="marp-tool-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? '全画面を解除' : '大画面プロジェクター表示 (F)'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="marp-progress-track">
        <div className="marp-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Main Slide Viewport */}
      <div className="marp-slide-viewport">
        <div className={`marp-slide-paper ${slide.isLead ? 'lead-slide' : ''}`}>
          {/* Slide Header */}
          <div className="slide-paper-header">
            <span>創造学習 第1回: UI/UXってなに？</span>
            <span>無料塾 benkyo</span>
          </div>

          {/* Slide Content rendering */}
          <div 
            className="slide-paper-body"
            dangerouslySetInnerHTML={{ __html: renderMarpContentToHtml(slide.content) }}
          />

          {/* Slide Footer */}
          <div className="slide-paper-footer">
            <span>スライド {currentSlideIndex + 1}</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="marp-bottom-bar">
        <div className="nav-shortcuts-hint">
          <kbd>←</kbd> <kbd>→</kbd> または <kbd>スペース</kbd> で移動 / <kbd>F</kbd> で全画面
        </div>

        <div className="nav-buttons-group">
          <button 
            className="marp-ctrl-btn prev"
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex(i => Math.max(0, i - 1))}
          >
            <ChevronLeft size={18} /> 前へ
          </button>
          <button 
            className="marp-ctrl-btn next primary"
            disabled={currentSlideIndex === slides.length - 1}
            onClick={() => setCurrentSlideIndex(i => Math.min(slides.length - 1, i + 1))}
          >
            次へ <ChevronRight size={18} />
          </button>
        </div>

        {currentSlideIndex >= 9 && onLaunchDemo && (
          <div className="quick-demo-launch">
            <button className="marp-launch-game-btn" onClick={() => onLaunchDemo()}>
              <Gamepad2 size={16} /> クソUI脱出ゲームを起動 ➔
            </button>
          </div>
        )}
      </div>

      {/* Marp Markdown Source Viewer Modal */}
      {showSourceModal && (
        <div className="marp-source-modal-overlay" onClick={() => setShowSourceModal(false)}>
          <div className="marp-source-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <FileCode size={20} color="#315e4d" />
                <h3>Marp形式スライド Markdownソース</h3>
              </div>
              <div className="modal-header-right">
                <button className="copy-code-btn" onClick={handleCopyMarkdown}>
                  {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  <span>{copied ? 'コピー完了！' : 'Markdownをコピー'}</span>
                </button>
                <button className="close-btn" onClick={() => setShowSourceModal(false)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <p className="source-intro">
              このテキストを <code>.md</code> ファイルとして保存し、VS Codeの Marp 拡張機能や Marp CLI（<code>npx @marp-team/marp-cli</code>）で開くと、PDFやPowerPoint（PPTX）、HTMLスライドとして出力できます。
            </p>

            <pre className="marp-source-code-block">
              <code>{UIUX_MARP_MARKDOWN}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 簡易Markdown ➔ HTML レンダラー（Marpの主要構文・HTMLタグに対応）
 */
function renderMarpContentToHtml(md: string): string {
  let html = md;

  //見出し #, ##, ###
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 太字 **text**
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  // 斜体 *text*
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // 引用 > text
  html = html.replace(/^>\s+(.*$)/gim, '<div class="marp-blockquote">$1</div>');

  // リスト - item
  html = html.replace(/^\-\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>(\n|$))+/g, '<ul class="marp-list">$&</ul>');

  // 改行
  html = html.replace(/\n\n/g, '<br/>');

  return html;
}
