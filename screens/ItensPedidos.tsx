import * as React from 'react' ;
import {View, Text,StyleSheet} from 'react-native';


export default function Bebidas() {

    return(

        <View style={telas.geral}>

            <Text> tela Bebidas sendo apresentada</Text>
        </View>
    );
    
}




const telas = StyleSheet.create({

    geral:{
        flex:1,
        backgroundColor:'white'
    },
    titulo:{

    }
});