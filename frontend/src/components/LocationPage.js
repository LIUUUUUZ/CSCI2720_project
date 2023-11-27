// 记得添加访问的id对应的页面不存在时的处理措施
import '../App.css';
import React from "react";
import { useParams } from "react-router-dom";

const SERVER_URL = 'localhost:5000'
const colorSet = {
  CUHKPurple: "#740f6B",
  CUHKYellow: "#E6B001"
}

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class LocationPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      location: {},
      isFetching: true,
    }
  }

  componentDidMount() {
    let { id } = this.props.params;
    // Get info
    fetch(`http://${SERVER_URL}/location-page/${id}`)
    .then(response => response.json())
    .then(data => {
      this.setState({
        location: data,
        isFetching: false
      });
    })
    .catch(error => {
      console.log('Error fetching location list:', error);
      this.setState({ isFetching: false });
    });
  }

  render() {
    const { location, isFetching } = this.state
    if (isFetching) {
      return <div>Loading...</div>
    } else {
      return (
        <div className='main-container'>
          {location.ID}
          {location.events.map((event) => <p>{event.description}</p>)}
        </div>
      )
    }
  }
}

export default withParams(LocationPage);