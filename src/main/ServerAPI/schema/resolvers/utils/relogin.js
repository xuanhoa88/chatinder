// @flow
import type { ServerAPI } from 'main/ServerAPI'
import { isOnline } from './isOnline'
import { success } from './statuses'
import { login } from '../mutations'
import Bluebird from 'bluebird'

export function reloginCallback(ctx: ServerAPI, callback: Function): void {
	if (ctx.reloginCallbacks !== null) {
		ctx.reloginCallbacks.push(callback)
	} else {
		if (ctx.reloginInterval !== null) {
			clearInterval(ctx.reloginInterval)
			ctx.reloginInterval = null
		}

		ctx.reloginCallbacks = [callback]
		ctx.reloginInterval = setInterval(async function _relogin() {
			const online = await isOnline()
			if (online) {
				const res = await login(null, { silent: true }, ctx)
				if (res.status === success.status) {
					if (ctx.reloginInterval !== null) {
						clearInterval(ctx.reloginInterval)
						ctx.reloginInterval = null
					}
					if (ctx.reloginCallbacks !== null) {
						ctx.reloginCallbacks.forEach(clb => clb())
						ctx.reloginCallbacks = null
					}
				}
			}
		}, 5000)
	}
}

export function relogin(ctx: ServerAPI) {
	return Bluebird.fromCallback(callback => reloginCallback(ctx, callback))
}
