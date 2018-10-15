const React = require('react');
const LikeButton = require('./LikeButton.jsx');

class Test extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: []
		};
	}

	componentDidMount() {
		// fetch('/api/test').
		// then((res) => res.json()).then((res) => {
		// 	this.setState({posts: res.posts});
		// });
	}

	handleClick() {
		alert('TEST');
		fetch('/api/test').then((res) => res.json()).then((res) => {
			this.setState({posts: res.posts});
		});
	}

	showTitles() {
		var list = [];

		this.state.posts.map((post) => {
			list.push(<li>{post}</li>);
			document.title = post;
		});

		return list;
	}

	render() {
		return (<div>
			<h1>Hello World!</h1>
			<p>Welcome on this website that uses NodeJS + MySQL + GitLab with continuous integration and deployment</p>
			<p>Isn&apos;t server-side rendering remarkable?</p>
			<ul>
				{this.showTitles()}
			</ul>

			<button onClick={this.handleClick.bind(this)}>Click Me</button>

			<h2>JSX import test :</h2>
			<LikeButton/><br/>
			<LikeButton/><br/>
			<LikeButton/><br/>
			<LikeButton/><br/>
		</div>);
	}
}

module.exports = Test;
