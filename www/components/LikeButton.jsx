var React = require('react');

class LikeButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			liked: false
		};
	}

	render() {
		if (this.state.liked) {
			return (<p>You liked this.</p>);
		}

		return (<button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={() => this.setState({liked: true})}>Like</button>);
	}
}

module.exports = LikeButton;
