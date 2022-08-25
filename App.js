import React, { useState, useEffect, cloneElement } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid
} from "react-native";
import {uid} from "uid"
import { BarCodeScanner } from "expo-barcode-scanner";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { store } from "./Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage"
const { height, width } = Dimensions.get("window");
export default function Home({navigation,route}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [Data, setData] = useState([]);
  const [CheckOut, setCheckOut] = useState(false);
  const[Load,setLoad]=useState(false)
  const [Id, setId] = useState("");
  const [home,setHome]=useState(true);
  const [Price,setPrice]=useState(0)
   const [history,setHistory]=useState(false)
   const[HisData,setHisData]=useState([])
  // const Quantity = [];
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    const StoreData=async()=>{
      const Id=uid(15)
      const value = await AsyncStorage.getItem('Id');
      if(value !== null) {
      
          setId(value);
      }
      else{
      
          await AsyncStorage.setItem('Id',Id ).then(() => {
                      setId(Id)
      })}}
      
      
    
     StoreData()
    getBarCodeScannerPermissions();
  }, []);
  useEffect(() => {
    if(Id.length>0){
      getDocs(collection(store,Id)).then(docs=>{
        let doc=[]
        docs.forEach(data=>{
          doc.push(data.data())
        })
        console.log(doc);
        setHisData([...doc])
      })
    }

  },[Id])
  console.log(Data);
 
 

  // console.log(Quantity);

  // console.log(Data);
  const handleBarCodeScanned = ({ type, data }) => {
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    // setId(data);
    try {
      setLoad(true);
    
      getDoc(doc(store, `Payment`, data.trim()))
        .then((docs) => {
          // console.log(docs.data().Data);
          if (docs.exists()) {
            setLoad(false);
         
            setScanned(true);

            setCheckOut(true);
          
              setData(docs.data().Data)
              // setData([{
              //   "Category": "Beverage",
              //   "Name": "Wagh Bakri Premium  Tea",
              //   "Price": "50",
              //   "Size": "750",
              //   "id": "9614ebb637cda31",
              //   "image": "https://res.cloudinary.com/dz7xfhqxk/image/upload/v1660720539/Grocery/image_5_rpzjdr.png",
              //   "quantity": 1,
              // },{
              //   "Category": "Beverage",
              //   "Name": "Wagh Bakri Premium  Tea",
              //   "Price": "50",
              //   "Size": "750",
              //   "id": "9614ebb637cda31",
              //   "image": "https://res.cloudinary.com/dz7xfhqxk/image/upload/v1660720539/Grocery/image_5_rpzjdr.png",
              //   "quantity": 1,
              // },{
              //   "Category": "Beverage",
              //   "Name": "Wagh Bakri Premium  Tea",
              //   "Price": "50",
              //   "Size": "750",
              //   "id": "9614ebb637cda31",
              //   "image": "https://res.cloudinary.com/dz7xfhqxk/image/upload/v1660720539/Grocery/image_5_rpzjdr.png",
              //   "quantity": 1,
              // }])
              let price=0
              docs.data().Data.map((item)=>{
                price=price+Number(item.Price)
              })
              setPrice(price)

            
        } else {
          
            setLoad(false);

            alert("Please Again scan QR Code");
          }
        })
        .catch((e) => {
          setLoad(false);
          
          console.log(e)
        });
    } catch (e) {
      setLoad(false);

      console.log(e);
    }
    
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  function renderItem({ item, index }) {
  
    return (

      <View style={{ flexDirection: "row" ,borderColor:"rgba(0,0,0,0.12)",borderTopWidth: 1,borderBottomWidth: 1,paddingVertical:10,marginVertical:5}} key={index}>
      <Image source={{uri:item.image}} style={{width:width*0.25,height:width*0.25,marginRight:15}}/>
        <View style={{ marginRight: "auto",justifyContent: "center"}}>
          <Text style={{fontSize:16,fontWeight: "bold",maxWidth:"90%"}}>{item.Name}</Text>
          <Text style={{color:"rgba(0, 0, 0, 0.6)"}}>{item.Category}</Text>
          <Text style={{color:"rgba(0, 0, 0, 0.6)"}}>{item.Size} gm</Text>
        </View>
        <View style={{justifyContent: "center"}}>
          <Text>{item.Price}.00 Rs.</Text>
          <Text style={{marginLeft:"auto",marginTop:7,borderColor:"rgba(0, 0, 0, 0.12)",borderWidth:1,padding:10,borderRadius:5}}>{item.quantity}</Text>
        </View>
      </View>
    );
  }
 
  

  if(home&&!history){
    return(
      <View style={{   flex:1,backgroundColor:"#fff",marginVertical:25}} contentContainerStyle={{justifyContent:"center"}}>
      <Text style={{marginVertical:10,fontSize:20,fontWeight:"bold",textAlign:"center"}}>Your Bill</Text>
              <TouchableOpacity style={{height:221,width:"85%",marginTop:15,backgroundColor:"rgba(0, 0, 0, 0.2))",alignItems: "center",justifyContent:"center",borderRadius:16,alignSelf:"center"}}  onPress={()=>setHome(false)}>
                  <Image source={require("./assets/image1.png")} style={{width:100,height:100}} />
                  <Text style={{marginTop:10,fontSize:18}}>Scan Qrcode to View Bill</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{height:221,width:"85%",marginTop:15,backgroundColor:"rgba(0, 0, 0, 0.2))",alignItems: "center",justifyContent:"center",borderRadius:16,alignSelf:"center"}}  onPress={()=>setHistory(false)}>
                  <Image source={require("./assets/history.png")} style={{width:100,height:100}} />
                  <Text style={{marginTop:10,fontSize:18}}>History</Text>
              </TouchableOpacity>
           
               
      </View>
    )
  }
 if(!home&&!history){
  return (
    <>
      <View style={styles.container}>
        {!scanned && !Load && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {Load && <ActivityIndicator color="red" size="large" />}
      </View>
      {scanned && !Load && (
        <View style={{ width: width, height: height, padding: 15 }}>
       
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: "black",
              textAlign: "center",
              marginTop: 10,
            }}
          >
           Bill
          </Text>
          {/* <Text style={{fontSize:20,fontWeight: "bold",marginVertical:15}}>{Quantity} {Quantity>1?"items":"item"}</Text> */}
          <View style={{ height: height *0.6}}>
            <FlatList
              data={Data}
              keyExtractor={(data, index) => {
                return index;
              }}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}/>
          </View>
          <View style={{ borderTopWidth:1,borderColor:"rgba(0, 0, 0, 0.12)",flex:1}}>
          <View style={{ flexDirection:"row",marginVertical:20}}>

        
          <View style={{marginRight:"auto"}}>

              <Text style={{fontSize:16,fontWeight: "800"}}>SubTotal </Text>
              <Text>Include GST.</Text>
          </View>
          <Text style={{fontSize:20,fontWeight:"bold"}}>{Price}.00 Rs.</Text>
          </View>
  <Button
            title={"Save"}
              onPress={async()=>{
      
      addDoc(collection(store,Id),{...Data}).then(() => {
        alert("Successfully Stored!!")
      }).catch(err => {
        alert("Network Error!")
      })
   
 

                }}/>
                <View style={{marginVertical:10}}>

                 <Button
            title={"Back to home"}
              onPress={()=>{
                setHome(!home) 
                setScanned(!scanned)
                setHistory(!history)
                }}
            // style={{marginTop:25}}
          />
                </View>
        
         
          </View>
        </View>
      )}
    </>
  );
            }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
