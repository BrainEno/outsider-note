/* eslint-disable no-console */
import { LexicalNode, ParagraphNode } from 'lexical';

export default class CustomParagraph extends ParagraphNode {
  static getType(): string {
    return 'custom-paragraph';
  }

  static clone(node: ParagraphNode): ParagraphNode {
    return new CustomParagraph(node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('p');
    return dom;
  }

  updateDOM(prevNode: CustomParagraph, dom: HTMLElement): boolean {
    console.log(prevNode, dom);
    return false;
  }
}

export function $createCutomParagraphNode(): ParagraphNode {
  return new CustomParagraph();
}

export function $isCustomParagraphNode(node?: LexicalNode): boolean {
  return node instanceof CustomParagraph;
}
