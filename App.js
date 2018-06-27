import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      page: 1,
      error: null,
      query: ""
    };
  }
  _getImages() {
    const { page, query } = this.state;
    this.setState({ isLoading: true });
    const url = `https://api.shutterstock.com/v2/images/search?query=${query}&page=${page}&per_page=20`;
    setTimeout(() => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Basic YzRkZjktNzEyNDEtMzk1ODYtMzY2ZTItNWYwMjYtNjE3MjA6NGMwOTctMjYyMjMtMzA3MzQtYTcwYjMtMDkwY2YtZWEwODI="
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.total_count != 0) {
            this.setState({
              data:
                page === 1
                  ? responseJson.data
                  : [...this.state.data, ...responseJson.data],
              isLoading: false,
              error: responseJson.error || null
            });
          } else {
            this.setState({
              data: [],
              isLoading: false,
              error: responseJson.error || null
            });
            alert("No image found");
          }
          console.log(responseJson.data);
        })
        .catch(error => {
          this.setState({ isLoading: false, error });
          console.error(error);
        });
    }, 1500);
  }
  componentDidMount(){
    this._getImages();
  }
  _handleSearch = () => {
    Keyboard.dismiss()
    const { query } = this.state;
    if (query) {
      this.setState(
        {
          data: []
        },
        () => {
          this._getImages();
        }
      );
    } else {
      alert("Please enter a Image name to search");
    }
  };

  renderFooter = () => {
    if (!this.state.isLoading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
        }}
      >
        <ActivityIndicator animating size="large" color="grey" />
      </View>
    );
  };
  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 8,
          width: "100%"
        }}
      />
    );
  };
  _handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => this._getImages()
    );
  };
  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          height: Dimensions.get("window").width / 3 - 8,
          width: Dimensions.get("window").width / 3 - 8,
          backgroundColor: "grey",
          marginRight: 4,
          marginLeft: 4
        }}
      >
        <Image
          style={{
            height: Dimensions.get("window").width / 3 - 8,
            width: Dimensions.get("window").width / 3 - 8
          }}
          source={{ uri: item.assets.preview.url }}
        />
        <Text>{item.id}</Text>
      </View>
    );
  };

  _keyExtractor = (item, index) => item.id;
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 60,
            width: Dimensions.get("window").width,
            borderBottomColor: "grey",
            borderBottomWidth: 0.5
          }}
        >
          <TextInput
            style={{ height: 60, width: Dimensions.get("window").width - 70 }}
            underlineColorAndroid="transparent"
            placeholder="Type a name here to search image!"
            onChangeText={e => this.setState({ query: e })}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
              padding: 8,
              borderRadius: 19,
              height: 38
            }}
            onPress={() => this._handleSearch()}
          >
            <Icon style={{ color: "white", fontSize: 24 }} name="search" />
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ paddingTop: 8 }}
          data={this.state.data}
          numColumns={3}
          horizontal={false}
          ListFooterComponent={this.renderFooter}
          keyExtractor={this._keyExtractor}
          ItemSeparatorComponent={this._renderSeparator}
          renderItem={this._renderItem}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={10}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  }
});
