// @flow

import chalk from 'chalk';
import ansiEscapes from 'ansi-escapes';
import Prompt from './Prompt';
import { type ScrollOptions } from './scroll';

const usage = (entity: string) =>
  // eslint-disable-nextline prefer-template
  `\n${chalk.bold('Pattern Mode Usage')}\n` +
  ` ${chalk.dim('\u203A Press')} Esc ${chalk.dim('to exit pattern mode.')}\n` +
  ` ${chalk.dim('\u203A Press')} Enter ` +
  `${chalk.dim(`to apply pattern to all ${entity}.`)}\n` +
  `\n`;

const usageRows = usage('').split('\n').length;

export default class PatternPrompt {
  _pipe: stream$Writable | tty$WriteStream;
  _prompt: Prompt;
  _entityName: string;
  _currentUsageRows: number;

  constructor(pipe: stream$Writable | tty$WriteStream, prompt: Prompt) {
    this._pipe = pipe;
    this._prompt = prompt;
    this._currentUsageRows = usageRows;
  }

  run(onSuccess: Function, onCancel: Function, options?: { header: string }) {
    this._pipe.write(ansiEscapes.cursorHide);
    this._pipe.write(ansiEscapes.clearScreen);

    if (options && options.header) {
      this._pipe.write(`${options.header}\n`);
      this._currentUsageRows = usageRows + options.header.split('\n').length;
    } else {
      this._currentUsageRows = usageRows;
    }

    this._pipe.write(usage(this._entityName));
    this._pipe.write(ansiEscapes.cursorShow);

    this._prompt.enter(this._onChange.bind(this), onSuccess, onCancel);
  }

  // eslint-disable-next-line no-unused-vars
  _onChange(pattern: string, options: ScrollOptions) {
    this._pipe.write(ansiEscapes.eraseLine);
    this._pipe.write(ansiEscapes.cursorLeft);
  }
}
