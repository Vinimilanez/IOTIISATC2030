/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import type {Node} from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
const axios = require('axios').default;
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import PureChart from 'react-native-pure-chart';


const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [dados, setDados] = useState([]);
  const recuperarDados = async () => {
    const b =(await axios({
      method:'get',
      baseURL:"https://us-central1-iot-ii-2030.cloudfunctions.net/",
      url:"api/dados",
      responseType:'json'
    })).data;
    
    let a = b.map(x => {
      let z = JSON.parse(x.dados);
      z.data = x.data;
      z.aparelho = x.idAparelho;
      return z;
    });
    console.log(a);
    let add = [];
    let dadosGrafico = []; 
    a.forEach(element => {
      console.log(element.aparelho);
      
      if(!add.includes(element.aparelho)){
       
        add.push(element.aparelho);
       
        let g = {
          id: element.aparelho,
          dadosLuz: a.filter(x => x.aparelho == element.aparelho).map(x => {
            return  {
              x: x.data,
              y: x.luz
            };
          }),
          dadosProximidade: a.filter(x => x.aparelho == element.aparelho).map(x => {
            return  {
              x: x.data,
              y: x.proximidade
            };
          })
        };
      
        dadosGrafico.push(g);
      }
    });
    console.log(dadosGrafico);
    setDados(dadosGrafico);
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const a = async () => {
      await recuperarDados();
    };   
    a();
  }, []);
  
  return (
    <SafeAreaView style={{...backgroundStyle, height: '100%'}}>
      <FlatList data={dados} style={{ height: 1000}} renderItem={({item}) => {
        if(!item){
          return <Text>xr</Text>;
        }
        
        console.log(item);
        s =[{
          seriesName: 'Luz',
          data: item.dadosLuz,
          color:"yellow"
          
        },
        {
          seriesName: 'Proximidade',
          data: item.dadosProximidade,
          color:"#297AB1"
        }
        ] 
        console.log(JSON.stringify(s))

        return  (<><Text>Aparelho: {item.id}</Text><SafeAreaView style={{height: 200, color:'black'}}><PureChart data={s} type='line' /></SafeAreaView></>);
      }}/>
      <Button onPress={async () => {
        recuperarDados();   
      }} title="Atualizar"/>
      <StatusBar hidden={true}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
