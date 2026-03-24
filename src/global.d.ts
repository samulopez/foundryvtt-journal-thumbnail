declare module 'fvtt-types/configuration' {
  interface SettingConfig {
    'journal-thumbnail.thumbnailPosition': 'right' | 'left';
  }

  namespace Hooks {
    interface HookConfig {
      renderEnhancedJournal: (app: ApplicationV2Config, html: HTMLElement) => void;
    }
  }
}

export {};
