// <reference path="index.d.ts"/>

import chalk from 'chalk'

import { IContext } from '../../types'

export function log({
	context,
	message,
}: {
	context: IContext
	message: string
}): void {
	console.log(chalk.bgBlue(`${context} - ${message}`))
}

export function warning({
	context,
	message,
}: {
	context: IContext
	message: string
}): void {
	console.log(chalk.bgRed(`${context} - ${message}`))
}

export function alert({
	context,
	message,
}: {
	context: IContext
	message: string
}): void {
	console.log(chalk.bgYellow(`${context} - ${message}`))
}

export function success({
	context,
	message,
}: {
	context: IContext
	message: string
}): void {
	console.log(chalk.bgGreen(`${context} - ${message}`))
}

success({
	context: '[Bot]',
	message: 'Lmao',
})
