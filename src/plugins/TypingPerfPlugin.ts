import { useEffect } from 'react';
import useReport from '../hooks/useReport';

const validInputTypes = new Set([
  'insertText',
  'insertCompositionText',
  'insertFromComposition',
  'insertLineBreak',
  'insertParagraph',
  'deleteCompositionText',
  'deleteContentBackward',
  'deleteByComposition',
  'deleteContent',
  'deleteContentForward',
  'deleteWordBackward',
  'deleteWordForward',
  'deleteHardLineBackward',
  'deleteSoftLineBackward',
  'deleteHardLineForward',
  'deleteSoftLineForward',
]);

function TypingPerPlugin(): JSX.Element | null {
  const report = useReport();
  useEffect(() => {
    let start = 0;
    let timerId: ReturnType<typeof setTimeout> | null;
    let keyPressTimerId: ReturnType<typeof setTimeout> | null;
    let log: Array<DOMHighResTimeStamp> = [];
    let invalidatingEvent = false;

    const measureEventEnd = () => {
      if (keyPressTimerId !== null) {
        if (invalidatingEvent) {
          invalidatingEvent = false;
        } else {
          log.push(performance.now() - start);
        }

        clearTimeout(keyPressTimerId);
        keyPressTimerId = null;
      }
    };

    const measureEventStart = () => {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
      keyPressTimerId = setTimeout(measureEventEnd, 0);

      timerId = setTimeout(() => {
        const total = log.reduce((a, b) => a + b, 0);
        const reportedText = `Typing Perf: ${
          Math.round((total / log.length) * 100) / 100
        }ms`;
        report(reportedText);
        log = [];
      }, 2000);
      start = performance.now();
    };

    const beforeInputHandler = (event: InputEvent) => {
      if (!validInputTypes.has(event.inputType) || invalidatingEvent) {
        invalidatingEvent = false;
        return;
      }
      measureEventStart();
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      const { code } = event;
      if (code === 'Backspace' || code === 'Enter') {
        measureEventStart();
      }
    };

    const pasteHandler = () => {
      invalidatingEvent = true;
    };

    const cutHandler = () => {
      invalidatingEvent = true;
    };

    window.addEventListener('keydown', keyDownHandler, true);
    window.addEventListener('selectionchange', measureEventEnd, true);
    window.addEventListener('beforeinput', beforeInputHandler, true);
    window.addEventListener('paste', pasteHandler, true);
    window.addEventListener('cut', cutHandler, true);

    return () => {
      window.removeEventListener('keydown', keyDownHandler, true);
      window.removeEventListener('selectionchange', measureEventEnd, true);
      window.removeEventListener('beforeinput', beforeInputHandler, true);
      window.removeEventListener('paste', pasteHandler, true);
      window.removeEventListener('cut', cutHandler, true);
    };
  }, [report]);

  return null;
}

export default TypingPerPlugin;
