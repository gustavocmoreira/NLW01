import React,{useState, useEffect} from 'react';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, ScrollView, Image,Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Feather as Icon} from '@expo/vector-icons';
import {useNavigation,useRoute} from '@react-navigation/native';
import MapView,{Marker} from 'react-native-maps';
import {SvgUri} from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item{
  id:number;
  title:string;
  item_url:string;
}

interface Point {
  id: number;
  image: string;
  image_url:string;
  name: string;
  latitude:number;
  longitude: number;
 
}

interface Params{
  uf:string;
  city:string
}

const Points = () =>{
    const navegation = useNavigation();
    const [items,setItems] = useState<Item>([]);
    const [selectedItems,setSelectItems] = useState<number[]>([]);
    const [insitialPostion,setInitialPostion] =useState<number[]>([0,0]);
    const [points,setPoints] = useState<Point[]>([]);

    const routes = useRoute();
    const routeParams = routes.params as Params; 


    useEffect(()=>{
      api.get('items').then(response=>{
          setItems(response.data)
      })
    },[])

    useEffect(()=>{
      async function loadPostion(){
        const { status} = await Location.requestPermissionsAsync();

        if(status !== 'granted'){
           Alert.alert('Oooops','Precisamos de sua localização')
           return;
        }

        const location = await Location.getCurrentPositionAsync();

        const {latitude,longitude} = location.coords;
      
        setInitialPostion([
          latitude,
          longitude
        ]);
        console.log(insitialPostion)
      }

      loadPostion();


    },[])

    useEffect(()=>{
        api.get('points',{
          params:{
             city: routeParams.city,
             uf: routeParams.uf,
             items: selectedItems
          }
        }).then(response=>{
          setPoints(response.data);
        } )
    },[selectedItems])

    function handleSelectItem(id: number){
    
      /*if(!selectedItems.includes(id)){
        setSelectItems([...selectedItems,id]);
      }else{
          const filteredItems = selectedItems.filter(item=>item!==id);

          setSelectItems(filteredItems);
      }*/
      

      const alreadySelected = selectedItems.findIndex(item=>item===id);

      if(alreadySelected>=0){
          const filteredItems = selectedItems.filter(item=>item!==id);

          setSelectItems(filteredItems);
          
      }else{
        setSelectItems([...selectedItems,id]);
      }

      
  }


    function handleNavigateBack(){
        navegation.goBack();
    }
    function handleNavigateToDetail(id:number){
      navegation.navigate('Detail',{point_id: id});
    }
    return(
        <>
          <View style={styles.container}>
              <TouchableOpacity onPress={handleNavigateBack}>
                  <Icon name="arrow-left" size={20} color="#34cb79" />
              </TouchableOpacity>
              <Text style={styles.title}>Bem Vindo.</Text>
              <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
              <View style={styles.mapContainer}>
                  {insitialPostion[0] !== 0 && (
                     <MapView style={styles.map}
                     loadingEnabled={insitialPostion[0] === 0}
                     initialRegion={{latitude:insitialPostion[0],
                                   longitude:insitialPostion[1],
                                   latitudeDelta:0.014,
                                   longitudeDelta:0.014}} >
                      {points.map(point=>(
                            <Marker key={String(point.id)}
                           onPress={()=>handleNavigateToDetail(point.id)}
                            style={styles.mapMarker} coordinate={{
                            latitude:point.latitude,
                            longitude:point.longitude, 
                            }}>
                          <View style={styles.mapMarkerContainer} >
                              <Image style={styles.mapMarkerImage} source={{uri:point.image_url}} />
                              <Text style={styles.mapMarkerTitle}>{point.name }</Text>
                          </View>
                          
                        </Marker>
                      ))}
   
                     </MapView>
                  )}
                 
              </View>
          </View>
          <View style={styles.itemsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20 }}>
              {items.map(item=>(
                  <TouchableOpacity
                      onPress={() =>  handleSelectItem(item.id)}
                      key={String(item.id)} 
                      style={[styles.item,selectedItems.includes(item.id) ? styles.selectedItem : {}]} 
                     
                      activeOpacity={0.6}>
                    <SvgUri width={42} uri={item.item_url}  />
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </TouchableOpacity>
              ))}
              
              
            </ScrollView>
          </View>
        </>
    ) ;
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;