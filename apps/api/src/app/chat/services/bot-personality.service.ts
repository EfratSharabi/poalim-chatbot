import { Injectable } from '@nestjs/common';

@Injectable()
export class BotPersonalityService {

  /**
   * Wrap a base answer with personality text.
   */
  wrapAnswer(base: string, botName: string): string {
    const prefixes = [
      `Hey there! ${botName} here:`,
      `${botName} says:`,
      `Oh good question! ${botName}:`,
      `For you, straight from ${botName}:`,
    ];
    const suffixes = [
      ` Hope that helps! 😄`,
      ` You're welcome (not that I need it).`,
      ` Now go build something cool! 🚀`,
      ``,
    ];

    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${p} ${base}${s}`;
  }
}
