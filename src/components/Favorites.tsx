import React from "react";
import "../css/Favorites.css";
import { Button } from "semantic-ui-react";

export interface Props {
  savedCities: any[];
  callBackFromParent: (city: string) => void;
}

class Favorites extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.getWeather = this.getWeather.bind(this);
  }

  getWeather(event: any) {
    this.props.callBackFromParent(event.target.value);
  }

  render() {
    let cityElements = this.props.savedCities.map((city) => {
      return (
        <Button
          className="Favorites-btn"
          size="tiny"
          value={city}
          key={`${city}-button`}
          onClick={this.getWeather}
          content={city}
        />
      );
    });

    return (
      <div className="Favorites">
        <h3 className="Favorites-title">My favorite cities</h3>
        <div className="Favorites-button-container">{cityElements}</div>
      </div>
    );
  }
}

export default Favorites;
