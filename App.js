import  React from 'react';
import {
StyleSheet,
View,
ActivityIndicator,
FlatList,Share,
Text,ScrollView,
Keyboard,
TouchableOpacity,Image,TextInput
} from "react-native";
import { WebView } from 'react-native-webview';
import PTRView from 'react-native-pull-to-refresh';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Source extends React.Component {
  cnt = 0;
  header =['home','search','country'];
  category = ['General' ,'Business' ,'Entertainment' ,'Health' ,'Science' ,'Sports' ,'Technology'];
  country =['Argentina','Australia','Austria','Belgium','Brazil','Bulgaria','Canada','China','Colombia','Cuba','Czech Republic','Egypt','France',
  'Germany','Greece','Hong Kong','Hungary','India','Indonesia','Ireland','Israel','Italy','Japan','Latvia','Lithuania','Malaysia','Mexico','Morocco',
  'Netherlands','New Zealand','Nigeria','Norway','Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia','Serbia','Singapore','Slovakia',
  'Slovenia','South Africa','South Korea','Sweden','Switzerland','Taiwan','Thailand','Turkey','UAE','Ukraine','United Kingdom','United States','Venuzuela'];
  code = ['ar','au','at','be','br','bg','ca','cn','co','cu','cz','eg','fr','de','gr','hk','hu','in','id','ie','il','it','jp','lv','lt','my','mx','ma','nl',
  'nz','ng','no','ph','pl','pt','ro','ru','sa','rs','sg','sk','si','za','kr','se','ch','tw','th','tr','ae','ua','gb','us','ve']
  constructor(props) {
 super(props);
 this.state = {
   loading: true,
   dataSource:[],
   value: '',
   mode: true,
   catg: 'General',
   cnt: 'in',
   selectedcatg: 0,
   selectedcountry: 17,
   shownews: false,
   home: true,
   country: false,
   search: false,
   url: ''
  };
}
//Initial data fetch
componentDidMount(){
  fetch('http://newsapi.org/v2/top-headlines?' +
'country='+this.state.cnt+'&category=' +this.state.catg+
'&apiKey=6b57fb16033c42658318466933431fcc')
.then(response => response.json())
.then((responseJson)=> {
  this.setState({
   loading: false,
   dataSource: responseJson.articles
  })
})
.catch(error=>console.log(error)) //to catch the errors if any
}
//To separate two lists
Separator = () => {
return (
  <View style={{
     height: .5,
     width:"100%"
}}
/>
);
}
//adding data from fetch results
addData=(data)=>
   <View style={[ styles.list, this.mode1(),{borderWidth: 0.5,borderColor: this.state.mode?'grey':'skyblue'}]} 
       onPress={() => {
              Linking.openURL(data.item.url);
            }}>
  <Image style={styles.pic}
        source={{
          uri: data.item.urlToImage,
        }}
      />
<Text style={[ styles.boldText, this.mode1()]}>{data.item.title}</Text>
<Text style={[ styles.lightText, this.mode1()]}>{data.item.description}</Text>
<View style={{flexDirection: 'row',justifyContent:'space-between'}}>
<Text style={[styles.uText , {color:this.state.mode?'blue':'skyblue'}]} 
onPress={() => {this.setState({shownews : true,url : data.item.url}) 
              //Linking.openURL(data.item.url);
            }}>{"...Read More>>"}</Text>                      
<TouchableOpacity style ={{width: 30, height: 20}}  onPress ={() => this.share(data.item.url,data.item.title)} >          
  <Image 
      style={styles.share}
      source={require('./assets/share.png')}
    /></TouchableOpacity>  
</View>
</View>

//share API
share(url,title) {
  const link = 'https://github.com/sundar-2000/news-app/blob/main/app-armeabi-v7a-release.apk?raw=true';
  Share.share({
    message: title +'\n'+ url+'\nFor more interesting News download our official app👇'+link ,
    url: url,
    title: 'Did you see that??'
  }, {
    // Android only:
    dialogTitle: 'Share News Via',
    // iOS only:
    excludedActivityTypes: [
      'com.apple.UIKit.activity.PostToTwitter'
    ]
  })
}

//detecting search values
onChangeText = (val) => {
  this.setState({
    value : val
   })
}
//Modifying fecth results based on query
 callFun(){ 
  const { value}  = this.state ;
  this.setState({
    loading : true,
    selectedcatg: -1
   })
  fetch('https://newsapi.org/v2/everything?q='+value+'&apiKey=6b57fb16033c42658318466933431fcc')
.then(response => response.json())
.then((responseJson)=> {
  this.setState({
   loading: false,
   dataSource: responseJson.articles,
  });


})
.catch(error=>console.log(error)) //to catch the errors if any
};
//Pull to refresh
refresh() {
  this.setState( {
    selectedcatg: 0,
    value: '',
    search: false,
    country: false,
    home: true
  } )
  return new Promise((resolve) => {
    fetch('http://newsapi.org/v2/top-headlines?' +
'country=' +this.state.cnt+
'&apiKey=6b57fb16033c42658318466933431fcc')
.then(response => response.json())
.then((responseJson)=> {
  this.setState({
   loading: false,
   dataSource: responseJson.articles
  })
})
.catch(error=>console.log(error))
    setTimeout(()=>{resolve()}, 2000)
  });
}

//mode changing function
mode()
{
  if(this.state.mode){
  return {
    backgroundColor: "#fff",
    color: "#000",
  }
}
  else{
  return{
    backgroundColor: '#32383D',
    color:"#fff"
  }
}
}
//mode changing fn for lists
mode1()
{
  if(this.state.mode){
  return {
    backgroundColor: "#fff",
    color: "#000",
  }
}
  else{
  return{
    backgroundColor: "#32383D",
    color:"#fff",
  }
}
}
modetoggle()
{
  if(this.state.mode){
    this.setState({
      mode : false,
     }) 
}
  else{
    this.setState({
      mode : true
     }) 
}
}
highlightcatg(key){
  this.setState( {
    selectedcatg: key,
    catg: this.category[key],
    loading: true
  } );
  setTimeout(()=>{this.componentDidMount()}, 10);
}
highlightcnt(key){
  this.scrollListReftop.scrollTo({x: 0, y: 0, animated: true});
  this.setState( {
    selectedcountry: key,
    cnt: this.code[key],
    loading: true,
    country: false,
    home: true
  } );
  setTimeout(()=>{this.componentDidMount()}, 10);
}
change(item){
 item == 'search' ?  this.setState( {
  home: false,
  country: false,
  search: true
} ): item == 'country' ? this.setState( {
  home : false,
  search: false,
  country: true
} ) : this.setState( {
  search: false,
  country: false,
  home: true
} );
this.scrollListReftop.scrollTo({x: 0, y: 0, animated: true});
}

//Rendring data
render(){
return(
 <View style={[ styles.mainbox, this.mode()]}>
  {
  this.state.shownews ?
    <View style={{flex: 1,width: "100%"}}>
      <Text style={{ marginLeft: 20,marginTop: 10,fontWeight: "bold" ,fontSize: 16,color: this.state.mode ? '#000':'#fff'}} 
         onPress={ ()=>this.setState({shownews : false}) }> 
          &#10096;&#10096;  Back</Text>
      <WebView 
        source={{
          uri: this.state.url
        }}
        style={{ marginTop: 20}}
      />
      </View>
    :
    <View>
   <View style={styles.header}>
   <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center',alignItems: 'center' }} horizontal={true} showsHorizontalScrollIndicator={false} fadingEdgeLength={20} ref={(ref) => { this.scrollListReftop = ref; }}>   
   { 
     this.state.search ?  //search
      <>
      <TextInput underlineColorAndroid ='#fff' style ={[styles.text,{borderColor:this.state.mode?'blue':'skyblue'}]}
        placeholder="Search"
        onChangeText={val => this.onChangeText( val)}
        value = {this.state.value}
      />
      <Text>{'      '}</Text>
     <TouchableOpacity   onPress={ ()=>this.callFun() }>
     <Icon name="search" color={this.state.mode?'blue':'skyblue'} size={32}  />
    </TouchableOpacity>
    </>
   
   : this.state.home? //home
   <> 
  <View style={styles.category}>
       {this.category.map((item,i)=>(
       <Text key={i} onPress={ ()=>this.highlightcatg(i)}  style={ [ styles.item, 
        { 
          fontWeight: this.state.selectedcatg === i ? 'bold':'normal',
          backgroundColor:  this.state.selectedcatg === i ? this.state.mode? 'blue':'skyblue' : 'transparent',
          color: this.state.selectedcatg === i ? '#fff' :this.state.mode? 'blue':'skyblue' ,
          elevation: this.state.selectedcatg === i ? 7 :0,
          fontSize: 16,
          marginRight: 5
        } ]} > { item } </Text>)
       )}
   </View> 
  </>
   
   :  //country
     <>
  <View style={styles.category}>
       {this.country.map((item,i)=>(
       <Text key={i} onPress={ ()=>this.highlightcnt(i)}  style={ [ styles.item, 
        { 
          fontWeight: this.state.selectedcountry=== i ? 'bold':'normal',
          backgroundColor:  this.state.selectedcountry === i ? this.state.mode? 'blue':'skyblue' : 'transparent',
          color: this.state.selectedcountry === i ? '#fff' :this.state.mode? 'blue':'skyblue' ,
          elevation: this.state.selectedcountry === i ? 7 :0,
          fontSize: 16,
          marginRight: 5
        } ]} > { item } </Text>)
       )}
   </View>
     </>
   }  
   </ScrollView>  
    </View>
     {this.state.loading 
     ?
      <View style={[ styles.loader, this.mode()]}> 
      <ActivityIndicator size="large" color="#0c9"/>
      </View>
     :   
    <View style={[ styles.container, this.mode()]}>
   <PTRView onRefresh={()=>this.refresh()} > 
   <FlatList
    data= {this.state.dataSource}
    ItemSeparatorComponent = {this.Separator}
    renderItem= {item=> this.addData(item)}
    keyExtractor={()=> (++this.cnt).toString() } 
   />
 </PTRView>
</View >
}
<View style={[ styles.footer,this.mode()]}>
 <Text style={[styles.footericon,this.mode(), {color :this.state.country?this.state.mode?'blue':'skyblue':'grey'}]} onPress={ ()=>this.change('country') }>
 <Icon name="globe" size={20} /><Text>{'\n'+this.code[this.state.selectedcountry]}</Text>
   </Text>  
 <Text style={[styles.footericon,this.mode(),{color :this.state.home?this.state.mode?'blue':'skyblue':'grey'}]} onPress={ ()=>this.change('home') }>
              <Icon name="home" size={20} /><Text>{'\nHome'}</Text>
  </Text>
  <Text style={[styles.footericon,this.mode(),{color :this.state.search?this.state.mode?'blue':'skyblue':'grey'}]} onPress={ ()=>this.change('search') }>
 <Icon name="search"  size={20}  /><Text>{'\nSearch'}</Text>
   </Text>
   <Text style={[styles.footericon,this.mode(), {color:'grey'}]} onPress={ ()=>this.modetoggle() }>
 <Icon name = {this.state.mode?'moon-o':'sun-o'}  size={20} /><Text>{'\nMode'}</Text>
   </Text>     
</View>
</View>
}

</View>

);
}}
const styles = StyleSheet.create({
  mainbox:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: "90%",
    marginTop: 7  
   },
   category:{
    flexDirection: "row",
    height: 20,
    margin: 5,
   },
   item:{
    borderRadius: 5,
    fontFamily: "roboto"
   },
  loader:{
    flex: 1,
    top: '40%'
   },
   pic: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 7
  },
  list:{
    margin: 7,
    padding: 7,
    borderRadius: 5,
    elevation: 7
    
   },
   boldText:{
     fontWeight: "bold",
     fontSize: 16
   },
   lightText:{
     fontSize: 16

   },
   uText:{
     fontSize: 16
   },
   share:{
     height: 20,
     width: 30,
     resizeMode: 'contain'
   },
   header:{
      flexDirection: "row",
      justifyContent: "center",
      alignItems: 'center',
      height: 40,
      margin: 5,
        
   },
   text:{
    borderWidth: 2,
    width: "60%",
    height: 35,
    paddingLeft: 7,
    borderRadius: 5,
    backgroundColor:"#fff"
   },
   footer:{
    marginBottom: 15,
    marginTop:3,
    flexDirection: 'row',
    justifyContent: "space-around",
   },
   footericon:{
     textAlign: 'center'
   }

   
});