/* eslint-disable react/require-default-props */
/* eslint-disable no-useless-return */
import type { LinkNode } from '@lexical/link';
import {
  $getNearestNodeFromDOMNode,
  LexicalEditor,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $isLinkNode } from '@lexical/link';

type LinkFilter = (event: MouseEvent, linkNode: LinkNode) => boolean;

const isLinkDomNode = (domNode: Node) => domNode.nodeName.toLowerCase() === 'a';

const getLinkDomNode = (
  event: MouseEvent,
  editor: LexicalEditor
): HTMLAnchorElement | null =>
  editor.getEditorState().read(() => {
    const domNode = event.target as Node;

    if (isLinkDomNode(domNode)) {
      return domNode as HTMLAnchorElement;
    }

    if (domNode.parentNode && isLinkDomNode(domNode.parentNode)) {
      return domNode.parentNode as HTMLAnchorElement;
    }

    return null;
  });

function ClickableLinkPlugin({
  filter,
  newTab = true,
}: {
  filter?: LinkFilter;
  newTab?: boolean;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    function onClick(e: Event) {
      const event = e as MouseEvent;
      const linkDomNode = getLinkDomNode(event, editor);

      if (linkDomNode === null) {
        return;
      }

      const href = linkDomNode.getAttribute('href');

      if (
        linkDomNode.getAttribute('contenteditable') === 'false' ||
        href === undefined
      ) {
        return;
      }

      // Allow user to select link text without following url
      const selection = editor.getEditorState().read($getSelection);
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        return;
      }

      let linkNode = null;
      editor.update(() => {
        const maybeLinkNode = $getNearestNodeFromDOMNode(linkDomNode);

        if ($isLinkNode(maybeLinkNode)) {
          linkNode = maybeLinkNode;
        }
      });

      if (
        linkNode === null ||
        (filter !== undefined && !filter(event, linkNode))
      ) {
        return;
      }

      try {
        if (href !== null) {
          window.open(
            href,
            newTab || event.metaKey || event.ctrlKey ? '_blank' : '_self'
          );
        }
      } catch (error) {
        // do nothing
      }
    }

    return editor.registerRootListener(
      (
        rootElement: null | HTMLElement,
        prevRootElement: null | HTMLElement
      ) => {
        if (prevRootElement !== null) {
          prevRootElement.removeEventListener('click', onClick);
        }

        if (rootElement !== null) {
          rootElement.addEventListener('click', onClick);
        }
      }
    );
  }, [editor, filter, newTab]);
  return null;
}

export default ClickableLinkPlugin;
