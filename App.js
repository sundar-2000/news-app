import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity, Image, TextInput, Linking
} from "react-native";
import PTRView from 'react-native-pull-to-refresh';
import SplashScreen from 'react-native-splash-screen'
export default class Source extends React.Component {

  cnt = 0;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      value: '',
      mode: true
    };
  }

  
  //Initial data fetch
  componentDidMount() {
    fetch('http://newsapi.org/v2/top-headlines?' +
      'country=in&' +
      'apiKey=6b57fb16033c42658318466933431fcc')
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          dataSource: responseJson.articles
        })
        //console.log(this.state.dataSource);
        SplashScreen.hide();
      })
      .catch(error => console.log(error)) //to catch the errors if any
  }
  //To separate two lists
  Separator = () => {
    return (
      <View style={{
        height: .5,
        width: "100%"
      }}
      />
    );
  }
  //adding data from fetch results
  addData = (data) =>
    <View style={[styles.list, this.mode1()]}
      onPress={() => {
        Linking.openURL(data.item.url);
      }}>
      <Image style={styles.pic}
        source={{
          uri: data.item.urlToImage,
        }}
      />
      <Text style={[styles.boldText, this.mode1()]}>{data.item.title}</Text>
      <Text style={[styles.lightText, this.mode1()]}>{data.item.description}
        <Text style={styles.uText}
          onPress={() => {
            Linking.openURL(data.item.url);
          }}>{"...Read more>>"}</Text>
      </Text>
    </View>
  //detecting search values
  onChangeText = (val) => {
    this.setState({
      value: val
    })
  }
  //Modifying fecth results based on query
  callFun() {
    const { value } = this.state;
    this.setState({
      loading: true
    })
    fetch('https://newsapi.org/v2/everything?q=' + value + '&apiKey=6b57fb16033c42658318466933431fcc')
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          dataSource: responseJson.articles,
        })
      })
      .catch(error => console.log(error)) //to catch the errors if any
  };
  //Pull to refresh
  refresh() {
    return new Promise((resolve) => {
      fetch('http://newsapi.org/v2/top-headlines?' +
        'country=in&' +
        'apiKey=6b57fb16033c42658318466933431fcc')
        .then(response => response.json())
        .then((responseJson) => {
          this.setState({
            loading: false,
            dataSource: responseJson.articles
          })
          //console.log(this.state.dataSource);
        })
        .catch(error => console.log(error))
      setTimeout(() => { resolve() }, 2000)
    });
  }

  //mode changing function
  mode() {
    if (this.state.mode) {
      return {
        backgroundColor: "#fff",
        color: "#000",
      }
    }
    else {
      return {
        backgroundColor: "#121212",
        color: "#fff"
      }
    }
  }
  //mode changing fn for lists
  mode1() {
    if (this.state.mode) {
      return {
        backgroundColor: "#fff",
        color: "#000",
      }
    }
    else {
      return {
        backgroundColor: "#32383D",
        color: "#fff"
      }
    }
  }
  modetoggle() {
    if (this.state.mode) {
      this.setState({
        mode: false,
      })


    }
    else {
      this.setState({
        mode: true
      })


    }
  }

  //Rendring data
  render() {
    if (this.state.loading) {
      return (
        <View style={[styles.loader, this.mode()]}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      )
    }
    return (

      <View style={[styles.mainbox, this.mode()]}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.modetoggle()}>
            <Image
              style={styles.mode}
              source={this.state.mode === true ?
                require('./assets/moon.png') :
                require('./assets/sun.png')}
            />
          </TouchableOpacity>

          <TextInput underlineColorAndroid='#fff' style={styles.text}
            placeholder="Search"
            onChangeText={val => this.onChangeText(val)}
          />
          <TouchableOpacity onPress={() => this.callFun()}>
            <Image
              style={styles.search}
              source={require('./assets/search.png')}
            />
          </TouchableOpacity>

        </View>
        <View style={[styles.container, this.mode()]}>

          <PTRView onRefresh={() => this.refresh()} >
            <FlatList
              data={this.state.dataSource}
              ItemSeparatorComponent={this.Separator}
              renderItem={item => this.addData(item)}
              keyExtractor={()=> (++this.cnt).toString() }

            />
          </PTRView>
          <View style={[this.mode()]}>
            <Text style={[styles.footer, this.mode()]}>© Developed by Sundar</Text></View>
        </View >

      </View>

    );
  }
}
const styles = StyleSheet.create({
  mainbox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    position: 'absolute',
    top: 70,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "86%"

  },
  loader: {
    flex: 1,
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  pic: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 7
  },
  list: {
    margin: 7,
    padding: 5,
    borderRadius: 5,
    elevation: 7

  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16
  },
  lightText: {
    fontSize: 16

  },
  uText: {
    textDecorationStyle: "dashed",
    color: "blue"

  },
  header: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    top: 20,
    height: 40,
    width: "100%",


  },
  tinyLogo: {
    resizeMode: "contain",
  },
  text: {
    borderWidth: 2,
    width: "60%",
    height: 35,
    paddingLeft: 7,
    borderRadius: 5,
    borderColor: "grey",
    backgroundColor: "#fff"
  },
  search: {
    borderRadius: 5,
    borderColor: "grey",
    borderWidth: 2,
    left: 5,
    height: 35,
    width: 35,
    resizeMode: "cover",
    backgroundColor: "#fff"
  },
  mode: {
    borderRadius: 5,
    borderColor: "grey",
    borderWidth: 2,
    height: 35,
    right: 5,
    width: 35,
    resizeMode: "cover",
    backgroundColor: "#fff"

  },
  footer: {

    bottom: 0,

  }

});