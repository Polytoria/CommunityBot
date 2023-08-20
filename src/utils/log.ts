// <reference path="index.d.ts"/>
import { IContext } from '../../types'
import chalk from 'chalk'

export function log ({
  context,
  message
}: {
  context: IContext;
  message: string;
}): void {
  console.log(chalk.blue(`👷 ${context} - ${message}`))
}

export function warning ({
  context,
  message
}: {
  context: IContext;
  message: string;
}): void {
  console.log(chalk.red(`${context} - ${message}`))
}

export function alert ({
  context,
  message
}: {
  context: IContext;
  message: string;
}): void {
  console.log(chalk.yellow(`${context} - ${message}`))
}

export function success ({
  context,
  message
}: {
  context: IContext;
  message: string;
}): void {
  console.log(chalk.green(`📦 ${context} - ${message}`))
}
