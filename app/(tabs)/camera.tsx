import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
// import * as FileSystem from 'expo-file-system';
// import * as DocumentPicker from 'expo-document-picker';
// import ExcelJS from 'exceljs';

export default function App() {
  const [permission, requestPermissionAsync] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [uniqueBarcodes, setUniqueBarcodes] = useState<string[]>([]);
  const [cameraEnabled, setCameraEnabled] = useState(true); // Состояние для управления видимостью камеры

  useEffect(() => {
    requestPermissionAsync();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Нужно разрешение на использование камеры</Text>
        <Button onPress={requestPermissionAsync} title="Разрешить" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (uniqueBarcodes.includes(data)) {
      setScanned(true);
      setCameraEnabled(false); // Отключаем камеру после успешного сканирования
      alert(`Баркод с данными ${data} уже был отсканирован.`);
      return;
    }

    if (uniqueBarcodes.length >= 3) {
      setScanned(true);
      setCameraEnabled(false); // Отключаем камеру после успешного сканирования
      alert('Достигнуто максимальное количество различных баркодов (3).');
      return;
    }

    setUniqueBarcodes(prev => [...prev, data]);
    setScanned(true);
    setCameraEnabled(false); // Отключаем камеру после успешного сканирования
    alert(`Содержание баркода ${data} было отсканировано.`);
  };

  // const exportToExcel = async () => {
  //   if (uniqueBarcodes.length === 0) {
  //     alert('Нет данных для экспорта.');
  //     return;
  //   }

  //   const workbook = new ExcelJS.Workbook();
  //   const sheet = workbook.addWorksheet('Barcodes');

  //   // Add header row
  //   sheet.addRow(['Data']);

  //   // Add data rows
  //   uniqueBarcodes.forEach(data => {
  //     sheet.addRow([data]);
  //   });

  //   try {
  //     // Save workbook to a temporary file
  //     const fileName = FileSystem.documentDirectory + 'barcodes.xlsx';
  //     await workbook.xlsx.writeFile(fileName);

  //     // Open the file using DocumentPicker
  //     await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });

  //     alert('Данные успешно экспортированы в Excel.');
  //   } catch (error) {
  //     console.error('Ошибка при экспорте данных в Excel:', error);
  //     alert('Произошла ошибка при экспорте данных в Excel.');
  //   }
  // };

  const resetScan = () => {
    setScanned(false);
    setCameraEnabled(true); // Включаем камеру перед новым сканированием
  };

  return (
    <View style={styles.container}>
      {cameraEnabled && !scanned && (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
        />
      )}
      {scanned && (
        <View style={styles.bottomButtons}>
          <Button title="Отсканировать снова" onPress={resetScan} />
          {/* <Button title="Экспорт в Excel" onPress={exportToExcel} /> */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});