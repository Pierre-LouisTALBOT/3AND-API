var React = require('react');

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			liked: false
		};
	}

	render() {
		return (<div>
			<form action="#" method="GET">
				<input name="username" defaultValue="Username" type="text"/>
				<input type="submit" value="Login"/>
			</form>
		</div>);
	}
}

module.exports = LoginForm;
