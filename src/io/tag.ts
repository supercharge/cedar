'use strict'

import { ConsoleOutput } from './console-output'

export class Tag {
  private readonly io: ConsoleOutput
  private readonly label: string

  /**
   * Create a new instance.
   */
  constructor (io: ConsoleOutput, label: string) {
    this.io = io
    this.label = label
  }

  success (message: string): ConsoleOutput {
    return this.io.success(this.label, message)
  }

  skipped (message: string, reason?: string): ConsoleOutput {
    return this.io.hint(this.label, `${message} ${this.formatReason(reason)}`)
  }

  failed (message: string, reason?: string): ConsoleOutput {
    return this.io.fail(this.label, `${message} ${this.formatReason(reason)}`)
  }

  private formatReason (reason?: string): string {
    if (!reason) {
      return ''
    }

    return `: ${this.io.colors().dim(reason)}`
  }
}
