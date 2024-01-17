/* eslint-disable no-nested-ternary */
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createTextNode, $getRoot } from 'lexical';
import Editor from '../components/Editor';
import { useSettings } from '../context/SettingsContext';
import { SharedHistoryContext } from '../context/SharedHistoryContext';
import EditorNodes from '../nodes/EditorNodes';
import TypingPerPlugin from '../plugins/TypingPerfPlugin';
import EditorTheme from '../themes/EditorTheme';

function prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Hello World'));
    root.append(heading);
  }
}

function Home() {
  const {
    settings: { isCollab, emptyEditor, measureTypingPerf },
  } = useSettings();

  const initialConfig = {
    editorState: isCollab
      ? null
      : emptyEditor
        ? undefined
        : prepopulatedRichText,
    namespace: 'DiffEditor',
    nodes: [...EditorNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: EditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <div className="editor-shell">
          <Editor />
        </div>
        {measureTypingPerf ? <TypingPerPlugin /> : null}
      </SharedHistoryContext>
    </LexicalComposer>
  );
}



export default Home;
