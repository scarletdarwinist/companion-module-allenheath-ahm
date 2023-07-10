const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

const SYSEX_HEADER = [0xF0, 0x00, 0x00, 0x1A, 0x50, 0x12, 0x01, 0x00]


class ModuleInstance extends InstanceBase {

	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(this.tryConnect());

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		if (this.midiPort != null) {
			this.midiPort.destroy();
		}

		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
		this.updateStatus(this.tryConnect());
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'number',
				id: 'user',
				label: 'User ID',
				width: 6
			},
			{
				type: 'textinput',
				id: 'pwd',
				label: 'Password',
				width: 6
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	tryConnect()
	{
		//check for necessary config items
		if (this.config.host == null || this.config.host == '' || this.config.user < 1 || this.config.user > 255) {
			return InstanceStatus.BadConfig
		}

		//create port
		var midiPort = new TCPHelper(this.config.host, 51325);
		midiPort.on('connect', () => {
			//send login message
			midiPort.on('data', () => {
				console.log(data);
				InstanceBase.this.updateStatus(InstanceStatus.Ok);
			});
			var bytes = new TextEncoder().encode(this.config.pwd);
			midiPort.send(Buffer.From([this.config.host] + bytes));
		});
		midiPort.on('error', this.handleError);
		midiPort.on('end', () => {
			InstanceBase.this.updateStatus(InstanceStatus.Disconnected);
		});

		midiPort.connect();

		return InstanceStatus.Connecting;
	}

	handleError(err) {
		console.log(err);
		InstanceBase.this.updateStatus(InstanceStatus.UnknownError);
	}

	handleData(data) {

	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
