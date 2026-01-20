import { getGame } from './scripts/helpers';
import { MODULE_ID } from './scripts/constants';

import './styles/style.css';

Hooks.once('init', () => {
  getGame().settings.register(MODULE_ID, 'thumbnailPosition', {
    name: 'Thumbnail Position',
    hint: 'Whether the thumbnail is left of the journal entry title or right',
    scope: 'world',
    config: true,
    default: 'right',
    type: String,
    choices: {
      right: 'Right',
      left: 'Left',
    },
    onChange: () => getGame().journal?.render(),
  });
});

const loadImages = (html: HTMLElement) => {
  const game = getGame();

  const journalEntries = html.querySelectorAll('li.journalentry');
  const thumbnailPosition = game.settings.get(MODULE_ID, 'thumbnailPosition');

  journalEntries.forEach((li) => {
    if (!(li instanceof HTMLElement)) return;
    const id = li.dataset.entryId;
    if (!id) return;

    const oldThumbnail = li.querySelector('img.journal-thumbnail');
    const journalEntry = game.journal?.get(id);

    let imageSrc = '';

    if (!!journalEntry?.flags["campaign-codex"]?.image) {
      imageSrc = journalEntry.flags["campaign-codex"].image
    }
    else if (!!journalEntry?.pages.size && journalEntry.pages.size > 0) {
      const sortedArray = journalEntry.pages.contents.sort((a, b) => a.sort - b.sort);
      const firstJournalPage = sortedArray[0];

      switch (firstJournalPage.type) {
        case 'text':
          const imgMatch = firstJournalPage.text.content?.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch && imgMatch[1]) {
            imageSrc = imgMatch[1].toString();
          }
          break;
        case 'image':
          imageSrc = firstJournalPage.src?.toString() ?? '';
          break;
        default:
          return;
      }
    }

    if (!imageSrc) {
      if (oldThumbnail) {
        oldThumbnail.remove();
      }
      return;
    }

    if (oldThumbnail instanceof HTMLImageElement) {
      oldThumbnail.src = imageSrc;
      return;
    }

    const thumbnail = document.createElement('img');
    thumbnail.classList.add('journal-thumbnail');
    thumbnail.src = imageSrc;
    thumbnail.alt = `Journal Entry Thumbnail ${journalEntry.name}`;

    if (thumbnailPosition === 'right') {
      li.append(thumbnail);
      return;
    }

    li.prepend(thumbnail);
  });
};

Hooks.on('renderJournalDirectory', (app, html) => {
  loadImages(html);
});

Hooks.on('renderJournalEntryPageSheet', () => {
  const journal = document.getElementById('journal');
  if (!journal) return;
  loadImages(journal);

  const monksJournal = document.getElementById('MonksEnhancedJournal');
  if (!monksJournal) return;
  loadImages(monksJournal);
});

