import { isBlack } from "../Util.js"
/**
 * Class that renders the background of the main canvas
 */
export class BackgroundRender {
	constructor(ctx, renderDimensions) {
		this.ctx = ctx
		this.renderDimensions = renderDimensions
		this.renderDimensions.registerResizeCallback(this.render.bind(this))
		this.render()
	}
	render() {
		let c = this.ctx
		c.clearRect(
			0,
			0,
			this.renderDimensions.windowWidth,
			this.renderDimensions.windowHeight
		)

		let bgHeight = this.renderDimensions.getAbsolutePianoPosition()
		let bgY = 0
		const col1 = "rgba(40,40,40,0.8)"
		const col2 = "rgba(25,25,25,1)"
		const col3 = "rgba(10,10,10,0.5)"
		c.strokeStyle = col1
		c.fillStyle = col2
		let whiteKey = 0
		for (let i = 0; i < 88; i++) {
			if (!isBlack(i)) {
				c.strokeStyle = col3
				c.fillStyle = (i + 2) % 2 ? col1 : col2
				c.lineWidth = 1

				let dim = this.renderDimensions.getKeyDimensions(i)
				c.fillRect(dim.x, bgY, dim.w, bgHeight)

				if (1 + (whiteKey % 7) == 3) {
					c.lineWidth = 2
					c.beginPath()
					c.moveTo(dim.x, bgY)
					c.lineTo(dim.x, bgY + bgHeight)
					c.stroke()
					c.closePath()
				}
				whiteKey++
			}
		}
	}
}
