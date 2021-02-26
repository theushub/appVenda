import * as React from 'react' ;
import {View, Text,StyleSheet} from 'react-native';


export default function Perfil() {

    return(

        <View style={telas.geral}>

            <Text> tela Perfil sendo apresentada</Text>
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