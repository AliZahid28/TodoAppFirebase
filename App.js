import { Button, ScrollView, PanResponder, TouchableOpacity, StyleSheet, Text, TextInput, View, Alert, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import database from '@react-native-firebase/database';


const App = () => {
  const [data, setData] = useState()
  const [inputvalue, setInputValue] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState()


  const onValuesChange = (newValues) => {
    setValues(newValues);
  };

  useEffect(() => {
    getData()
  }, [])

  // getting data from firebase database
  const getData = async () => {
    try {
      const newdata = await database().ref('todo').on('value', tempdata =>{
        
        const dataArray = tempdata !== null ? Object.entries(tempdata.val()): [];
        setData(dataArray)
      });
    } catch (err) {
      console.log(err)
    }
  }
  console.log('hey how --=============     ',data)


  // setting to new data to firebase database 
  const handleNewTodo = async () => {
    try {
      if (inputvalue !== '') {
        const todoRef = await database().ref('todo').push({value:inputvalue},undefined);
        setInputValue('')
      }
    } catch (err) {
      console.log(err)
    }
  }

  // updating the list
  const handleUpdatelist = async () => {
    try {
      const response = await database().ref(`todo/${selectedIndex}`).update({
        value: inputvalue
      })
      setInputValue('')
      setIsUpdate(false);


    } catch (err) {
      console.log(err)
    }

  }

  // deleting data
  const handleRemovingFromList = (value, index) => {
    Alert.alert(`Alert, Are You Sure to delete ${value}`,'',
      [
        {
          text: 'cancel',
          onPress: () => console.log('I am canceled')
        },
        {
          text: 'Ok',
          onPress: async() => {
            try {
              const response = await database().ref(`/todo/${index}`).remove()
              console.log(response)
            } catch (err) {
              console.log(err)
            }
          }
        },
      ]

    )
  }

  return (
    <View>
      <TextInput value={inputvalue} onChangeText={(value) => setInputValue(value)} placeholder='Enter your note' />
      {
        !isUpdate ?
          <Button onPress={handleNewTodo} title='Add' /> :
          <Button onPress={handleUpdatelist} title='Update' />
      }

      <ScrollView >
        <View style={{ marginTop: 40, paddingBottom: 100 }} >
          {
            data?.map(([id,item]) => {
              console.log('hi==============     ',item)
              if (item !== null) {
                return (
                  <TouchableOpacity key={id} onLongPress={() => handleRemovingFromList(item.value, id)} onPress={() => {
                    setIsUpdate(true)
                    setInputValue(item.value)
                    setSelectedIndex(item.index)
                  }} style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <Text style={{ textAlign: 'center', borderWidth: 1, paddingVertical: 8, borderRadius: 15, }} >{item.value}</Text>
                  </TouchableOpacity>
                )
              }
            })
          }




        </View>


      </ScrollView>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // sliderTrack: {
  //   position: 'absolute',
  //   top: '50%',
  //   height: 2,
  //   width: '100%',
  //   backgroundColor: 'gray',
  // },
  // sliderHandle: {
  //   position: 'absolute',
  //   top: '50%',
  //   width: 20,
  //   height: 20,
  //   backgroundColor: 'blue',
  //   borderRadius: 10,
  //   marginLeft: -10,
  // },
  // text: {
  //   marginTop: 20,
  // },


  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurView: {
    width: 200,
    height: 200,
    borderRadius: 50, // Adjust the border shape as needed
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
