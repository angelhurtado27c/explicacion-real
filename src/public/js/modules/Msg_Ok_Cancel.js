import Msg from './Msg.js'

class Msg_Ok_Cancel extends Msg {
	constructor(action) {
		super()
		this.action = action
		this.createOkCancel()
	}

	createOkCancel() {
		const style = document.createElement('style')
		style.innerHTML = `
			.msg_all_display p {
				width: 100%;
				margin-bottom: 15px;
			}

			.msg_all_display > div {
				position: static;
				padding: 20px;
			}

			.msg_all_display .buttons {
				padding: 0;
				box-shadow: none;
				display: flex;
				justify-content: center;
			}

			.msg_all_display button {
				position: static;
				box-shadow: none;
				width: 97px;
			}
			.msg_all_display button:first-child {
				margin-right: 10px;
			}
		`
		this.msg.appendChild(style)

		this.div_msg.removeChild(this.btn_ok)
		this.msg_div_buttons = document.createElement('div')
		this.msg_div_buttons.className = 'buttons'
		this.div_msg.appendChild(this.msg_div_buttons)

		this.msg_div_buttons.appendChild(this.btn_ok)
		this.btn_ok.innerText = 'Exacto'
		this.btn_ok.onclick = this.execute_action

		this.btn_cancel = document.createElement('button')
		this.btn_cancel.innerText = '¡no!'
		this.btn_cancel.onclick = this.remove
		this.msg_div_buttons.appendChild(this.btn_cancel)

		this.execute_action()
	}

	execute_action = async () => {
		await this.action()
	}
}

const test = new Msg_Ok_Cancel(function(){console.log('Acción')})
test.show('Sí, quiero remover la imágen de perfil')
//console.log(test)

export default 'asd'