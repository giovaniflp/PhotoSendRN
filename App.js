import React, { useState, useEffect } from "react";
import { View, Button, FlatList, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  list,
} from "firebase/storage";
import { TouchableOpacity } from "react-native-web";

const ImagePickerExample = () => {
  const [imageUri, setImageUri] = useState(
    "https://cdn3.iconfinder.com/data/icons/materia-office-vol-2/24/010_082_document_upload_file-1024.png"
  );
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState([null]);
  const [visible, setVisible] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyDQOrucZlwKtFVaY7cUcmcusUvMSoqGrjo",
    authDomain: "storage-image-72ab0.firebaseapp.com",
    projectId: "storage-image-72ab0",
    storageBucket: "storage-image-72ab0.appspot.com",
    messagingSenderId: "430674483482",
    appId: "1:430674483482:web:07a2b524a2c3b194bef4a3"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Armazena a imagem para o upload e exibe a imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log(result.assets);
    }
  };

  function getRandom(max) {
    return Math.floor(Math.random() * max + 1);
  }

  //Método para realizar upload para o Firebase
  const uploadImage = async () => {
    if (!imageUri || imageUri == "https://cdn3.iconfinder.com/data/icons/materia-office-vol-2/24/010_082_document_upload_file-1024.png") {
      alert("Escolha uma imagem para enviar");
    } else {
      const storage = getStorage();
      var name = getRandom(200);
      const mountainsRef = ref(storage, name + ".jpg");

      const response = await fetch(imageUri);
      const blob = await response.blob();

      uploadBytes(mountainsRef, blob).then((snapshot) => {
        alert("Imagem enviada com sucesso!!");
        window.location.reload();
      });
    }
  };

  //Listar no console as imagens salvas no storage
  async function LinkImage() {
    // Create a reference under which you want to list
    const storage = getStorage();
    const listRef = ref(storage);

    // Fetch the first page of 100.
    const firstPage = await list(listRef, { maxResults: 100 });
    var lista = [];
    firstPage.items.map((item) => {
      var link =
        "https://firebasestorage.googleapis.com/v0/b/" +
        item.bucket +
        "/o/" +
        item.fullPath +
        "?alt=media";
      lista.push(link);
    });
    setImage(lista);
    setVisible(true);
    console.log(image);
  }

  useEffect(()=>{
    LinkImage()
  })

  const deleteImage = async (imageRef) => {
    try {
      const storage = getStorage();
      const imageRefObj = ref(storage, imageRef);
      await deleteObject(imageRefObj);
      console.log("Imagem deletada com sucesso");
      window.location.reload();
    } catch (error) {
      console.log("Erro ao deletar imagem", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40, backgroundColor:  "gray"}}>
      <Button title="Escolher Imagem" onPress={pickImage} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginVertical: 20}}
        />
      )}
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Enviar Imagem"
          onPress={uploadImage}
          disabled={!imageUri}
          style={{marginVertical: '8px'}}
        />
      )}
        
      
      <FlatList
        data={image}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 20,
              alignItems: "center",
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <Image source={{ uri: item }} style={{ width: 50, height: 50 }} />
            <Button title="Deletar" onPress={() => deleteImage(item)} />
          </View>
        )}
      />
    </View>
  );
};

export default ImagePickerExample;
