'use strict'

import { Mixin as Many } from 'ts-mixer'
import { ConsoleInput, ConsoleOutput } from '@supercharge/console-io'

export class IO extends Many(ConsoleInput, ConsoleOutput) {}
