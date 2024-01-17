import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

export type Option = Readonly<{
  text: string;
  uid: string;
  votes: Array<number>;
}>;

export type Options = ReadonlyArray<Option>;

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
}

export function createPollOption(text = ''): Option {
  return {
    text,
    uid: createUID(),
    votes: [],
  };
}

function cloneOption(
  option: Option,
  text: string,
  votes?: Array<number>
): Option {
  return {
    text,
    uid: option.uid,
    votes: votes || Array.from(option.votes),
  };
}

export type SerializedPollNode = Spread<
  {
    question: string;
    options: Options;
    type: 'poll';
    version: 1;
  },
  SerializedLexicalNode
>;

function convertPollElement(domNode: HTMLElement): DOMConversionOutput | null {
  const question = domNode.getAttribute('data-lexical-poll-question');
  if (question !== null) {
    const node = $createPollNode(question);
    return { node };
  }
  return null;
}

export class PollNode extends DecoratorNode<JSX.Element> {
  __question: string;

  __options: Options;

  static getType(): string {
    return 'poll';
  }

  static clone(node: PollNode): PollNode {
    return new PollNode(node.__question, node.__options, node.__key);
  }

  constructor(question: string, options?: Options, key?: NodeKey) {
    super(key);
    this.__question = question;
    this.__options = options || [createPollOption(), createPollOption()];
  }

  static importJSON(serializedNode: SerializedPollNode): PollNode {
    const node = $createPollNode(serializedNode.question);
    serializedNode.options.forEach(node.addOption);
    return node;
  }

  addOption(option: Option): void {
    const self = this.getWritable();
    const options = Array.from(this.__options);
    options.push(option);
    self.__options = options;
  }

  deleteOption(option: Option): void {
    const self = this.getWritable();
    const options = Array.from(self.__options);
    const index = options.indexOf(option);
    options.splice(index, 1);
    self.__options = options;
  }

  setOptionText(option: Option, text: string): void {
    const self = this.getWritable();
    const clonedOption = cloneOption(option, text);
    const options = Array.from(self.__options);
    const index = options.indexOf(option);
    options[index] = clonedOption;
    self.__options = options;
  }

  toggleVote(option: Option, clientID: number): void {
    const self = this.getWritable();
    const { votes } = option;
    const votesClone = Array.from(votes);
    const voteIndex = votes.indexOf(clientID);
    if (voteIndex === -1) {
      votesClone.push(clientID);
    } else {
      votesClone.splice(voteIndex, 1);
    }
    const clonedOption = cloneOption(option, option.text, votesClone);
    const options = Array.from(self.__options);
    const index = options.indexOf(option);
    options[index] = clonedOption;
    self.__options = options;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domeNode: HTMLElement) => {
        if (!domeNode.hasAttribute('data-lexical-poll-question')) {
          return null;
        }
        return {
          conversion: convertPollElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-poll-question', this.__question);
    return { element };
  }

  createDOM(): HTMLElement {
    const elem = document.createElement('span');
    elem.style.display = 'inline-block';
    return elem;
  }

  updateDOM(): false {
    return false;
  }
}

export function $createPollNode(question: string): PollNode {
  return new PollNode(question);
}

export function $isPollNode(
  node: LexicalNode | null | undefined
): node is PollNode {
  return node instanceof PollNode;
}
