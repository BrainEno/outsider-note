import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import {
  EditorState,
  $getSelection,
  $isRangeSelection,
  RootNode,
} from 'lexical';
import { $restoreEditorState } from '@lexical/utils';
import { trimTextContentFromAnchor } from '@lexical/selection';

export function MaxLengthPlugin({ maxLength }: { maxLength: number }): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let lastRestoredEditorState: EditorState | null = null;

    return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        // eslint-disable-next-line no-useless-return
        return;
      }
      const prevEditorState = editor.getEditorState();
      const prevTextContext = prevEditorState.read(() =>
        rootNode.getTextContent()
      );
      const textContent = rootNode.getTextContent();
      if (prevTextContext !== textContent) {
        const textLength = textContent.length;
        const delCount = textLength - maxLength;
        const { anchor } = selection;

        if (delCount > 0) {
          if (
            prevTextContext.length === maxLength &&
            lastRestoredEditorState !== prevEditorState
          ) {
            lastRestoredEditorState = prevEditorState;
            $restoreEditorState(editor, prevEditorState);
          } else {
            trimTextContentFromAnchor(editor, anchor, delCount);
          }
        }
      }
    });
  }, [editor, maxLength]);

  return null;
}
