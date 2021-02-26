import * as React from 'react' ;
import {View, Text, StyleSheet, ActivityIndicator, Image} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {host} from '../config/settings';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase("appvenda.dbb");

const stack = createStackNavigator();

export default function Home() {

    return(
        <stack.Navigator>
            <stack.Screen name= "Listar Produtos"  component=  {ListarProdutos} options={{headerShown:false}} />
            <stack.Screen name= "Detalhes Produto" component=  {DetalhesProduto} />
        </stack.Navigator>
    );

}


//============================= tela de lista de produtos =========================


function ListarProdutos({navigation}:any){

    const [carregando, setCarregando] = React.useState(true);
    const [dados, setDados] = React.useState([]);

    React.useEffect(()=>{
        fetch(`${host}/matheus/service/produto/listartelainicial.php`)
        .then((response)=>response.json())
        .then((produto)=>setDados(produto.saida))
        .catch((error)=>console.error(`erro ao carregar a api ${error}`))
        .finally(()=>setCarregando(false))
    },[]);

        return(

           <ScrollView style={Styles.scrollview} horizontal={true}>

            {carregando ? (
                <ActivityIndicator/>
            ):(
                <FlatList
                data={dados}
                renderItem={({item})=>(
                    <View>
                        <Text>Nome Produto { item.nomeproduto} </Text>
                        <Text>Preço: R$ {item.preco}</Text>

                        <TouchableOpacity onPress={()=>{
                            navigation.navigate("Detalhes Produto",{
                                idproduto:`${item.idproduto}`
                            })    
                        }} style={Styles.btnDetalhes}>

                            <Text style={Styles.txtBtnDetalhes}> Saiba mais </Text>

                        </TouchableOpacity>

                    </View>
                )}
                keyExtractor={({idproduto, index})=>idproduto}
                />
            )
            }        


           </ScrollView>
       
        );
    }



//============================= tela de detalhes =========================


    function DetalhesProduto({route}:any){

        const {idproduto} = route.params;

        const [carregando, setCarregando] = React.useState(true);
    const [dados, setDados] = React.useState([]);

    React.useEffect(()=>{
        fetch(`${host}/matheus/service/produto/detalheproduto.php?idproduto=${idproduto}`)
        .then((response)=>response.json())
        .then((produto)=>setDados(produto.saida))
        .catch((error)=>console.error(`erro ao carregar a api ${error}`))
        .finally(()=>setCarregando(false))
    },[]);

        return(
           <ScrollView style={Styles.scrollview} horizontal={true}>

            {carregando ? (
                <ActivityIndicator/>
            ):(
                <FlatList
                data={dados}
                renderItem={({item})=>(
                    <View>
                        <Image source={{uri:`${host}/Matheus/img/${item.foto1}`}} style={Styles.foto} />
                        <Image source={{uri:`${host}/Matheus/img/${item.foto2}`}} style={Styles.foto} />
                        <Image source={{uri:`${host}/Matheus/img/${item.foto3}`}} style={Styles.foto} />
                        <Image source={{uri:`${host}/Matheus/img/${item.foto4}`}} style={Styles.foto} />

                        <Text>Nome Produto { item.nomeproduto} </Text>
                        <Text>Descrição: {item.descricao}</Text>
                        <Text>Preço: R$ {item.preco}</Text>

                        <TouchableOpacity onPress={()=>{


                            db.transaction((tx)=>{
                                tx.executeSql("create table if not exists carrinho(id integer primary key, idproduto int, nomeproduto text, preco text, foto text);");
                            });

                            db.transaction((ts)=>{
                                ts.executeSql("insert into carrinho(idproduto, nomeproduto, preco,foto)values(?,?,?,?)",[item.idproduto,item.nomeproduto,item.preco,item.foto1]);
                            })

                            db.transaction((sl)=>{
                                sl.executeSql("select * from carrinho",[],(_,{rows})=>{
                                    console.log(JSON.stringify(rows));
                                });
                            });

                        }} style={Styles.btnDetalhes}>

                            <Text>Adicionar ao carrinho</Text>

                        </TouchableOpacity>

                    </View>
                )}
                keyExtractor={({idproduto, index})=>idproduto}
                />
            )
            }        


           </ScrollView>
       
        );
    }






//=====================css da tela=====================

const Styles = StyleSheet.create({
    scrollview:{
        flex:1, 
        backgroundColor:"white",
        alignContent:"center",
        marginLeft:"auto",marginRight:"auto",
        width:"100%",
        paddingLeft:"20%"
       
    },
    btnDetalhes:{
        backgroundColor:'silver',
        padding:10,
        margin:5
    },
    txtBtnDetalhe:{
        fontSize:12
    },
    foto:{
        flex:1,
        resizeMode:'cover',
        width:200,
        height:200,
        margin:10
    }
})


