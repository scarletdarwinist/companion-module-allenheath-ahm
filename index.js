const { InstanceBase, Regex, runEntrypoint } = require('@companion-module/base')

class AHMInstance extends InstanceBase {

	constructor(internal) {
		super(internal)
	}

	
	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.2.0
	 */
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module is for the Allen & Heath AHM mixers',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				default: '192.168.1.70',
				regex: this.REGEX_IP,
			},
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.2.0
	 */
	destroy() {
		if (this.midiSocket !== undefined) {
			this.midiSocket.destroy()
		}

		this.log('debug', `destroyed ${this.id}`)
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.2.0
	 */
	async init(config) {

		this.updateStatus('ok')
	}

	/*initFeedbacks() {
		this.setFeedbackDefinitions(this.getFeedbacks(this.inputsMute, this.zonesMute, this.inputsToZonesMute))
	}

	initPresets() {
		this.setPresetDefinitions(this.getPresets(this.inputsMute, this.zonesMute))
	}

	/**
	 * INTERNAL: use setup data to initialize the tcpSocket object.
	 *
	 * @access protected
	 * @since 1.2.0
	 
	init_tcp() {
		if (this.midiSocket !== undefined) {
			this.midiSocket.destroy()
			delete this.midiSocket
		}

		if (this.config.host) {
			this.midiSocket = new tcp(this.config.host, MIDI_PORT)

			this.midiSocket.on('status_change', (status, message) => {
				this.status(status, message)
			})

			this.midiSocket.on('error', (err) => {
				this.log('error', 'MIDI error: ' + err.message)
			})

			this.midiSocket.on('data', (data) => {
				this.processIncomingData(data)
			})

			this.midiSocket.on('connect', () => {
				this.log('debug', `MIDI Connected to ${this.config.host}`)
				this.getMuteInfoFromDevice(64)
			})
		}
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.2.0
	 
	updateConfig(config) {
		this.config = config

		this.actions()
		this.init_tcp()
	}

	hexToDec(hexString) {
		return parseInt(hexString)
	}
	/**
	 * Process incoming data.
	 *
	 * @param {Object} data - the incoming data
	 * @access public
	 * @since 1.2.0
	 
	processIncomingData(data) {
		console.log(data)

		switch (data[0]) {
			case 144:
				// input mute
				// data[2] 63 == unmute, 127 == mute
				console.log(`Channel ${data[2] == 63 ? 'unmute' : 'mute'}: ${this.hexToDec(data[1]) + 1}`)
				// this.log('debug', `Channel ${parseInt(data[1], 16) + 1} ${data[2] == 63 ? 'unmute' : 'mute'}`)
				this.inputsMute[this.hexToDec(data[1])] = data[2] == 63 ? 0 : 1
				this.checkFeedbacks('inputMute')
				break
			case 145:
				// zone mute
				console.log(`Zone ${data[2] == 63 ? 'unmute' : 'mute'}: ${this.hexToDec(data[1]) + 1}`)
				this.log('debug', `Zone ${this.hexToDec(data[1]) + 1} ${data[2] == 63 ? 'unmute' : 'mute'}`)
				this.zonesMute[this.hexToDec(data[1])] = data[2] == 63 ? 0 : 1
				this.checkFeedbacks('zoneMute')
				break
			case 240:
				// input to zone mute
				console.log(
					`Input ${this.hexToDec(data[10]) + 1} to zone Zone ${this.hexToDec(data[12]) + 1} ${
						data[13] == 63 ? 'unmute' : 'mute'
					}`
				)
				this.log(
					'debug',
					`Input ${this.hexToDec(data[10]) + 1} to zone Zone ${this.hexToDec(data[12]) + 1} ${
						data[13] == 63 ? 'unmute' : 'mute'
					}`
				)
				this.inputsToZonesMute[this.hexToDec(data[10])][this.hexToDec(data[12]) + 1] = data[2] == 63 ? 0 : 1
				this.checkFeedbacks('inputToZoneMute')
				break
			default:
				console.log('Extra data coming in')
				break
		}
	}*/
}
