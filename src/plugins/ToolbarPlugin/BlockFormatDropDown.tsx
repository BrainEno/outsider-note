/* eslint-disable react/require-default-props */
import {
  LexicalEditor,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $INTERNAL_isPointSelection,
} from 'lexical';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import DropDown, { DropDownItem } from '../../components/DropDown';

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

export const rootTypeToRootName = {
  root: 'root',
  table: 'Table'
}

const dropDownActiveClass = (active: boolean) =>
  active ? 'active dropdown-item-active' : '';

export function BlockFormatDropdown({
  editor,
  blockType,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($INTERNAL_isPointSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });

  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($INTERNAL_isPointSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if ($INTERNAL_isPointSelection(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={`icon block-type ${blockType}`}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="字体样式"
    >
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'paragraph')}`}
        onClick={formatParagraph}
      >
        <i className="icon paragraph" />
        <span className="text">标准</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'h1')}`}
        onClick={() => formatHeading('h1')}
      >
        <i className="icon h1" />
        <span className="text">Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'h2')}`}
        onClick={() => formatHeading('h2')}
      >
        <i className="icon h2" />
        <span className="text">Heading 2</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'h3')}`}
        onClick={() => formatHeading('h3')}
      >
        <i className="icon h3" />
        <span className="text">Heading 3</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'bullet')}`}
        onClick={formatBulletList}
      >
        <i className="icon bullet-list" />
        <span className="text">无序列表</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'number')}`}
        onClick={formatNumberedList}
      >
        <i className="icon numbered-list" />
        <span className="text">排序列表</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'check')}`}
        onClick={formatCheckList}
      >
        <i className="icon check-list" />
        <span className="text">勾选列表</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'quote')}`}
        onClick={formatQuote}
      >
        <i className="icon quote" />
        <span className="text">引号</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'code')}`}
        onClick={formatCode}
      >
        <i className="icon code" />
        <span className="text">代码</span>
      </DropDownItem>
    </DropDown>
  );
}
