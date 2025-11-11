#!/bin/bash

# Script para solucionar el error "unable to load script" en React Native

echo "🔧 Solucionando error 'unable to load script'..."

# 1. Matar procesos de Metro
echo "1️⃣ Deteniendo procesos de Metro..."
pkill -f "react-native" || true
pkill -f "metro" || true

# 2. Limpiar cachés
echo "2️⃣ Limpiando cachés..."
rm -rf android/app/build
rm -rf android/build
rm -rf node_modules/.cache
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Configurar port forwarding
echo "3️⃣ Configurando port forwarding..."
adb reverse tcp:8081 tcp:8081

# 4. Iniciar Metro con caché limpia
echo "4️⃣ Iniciando Metro con caché limpia..."
echo "Metro se iniciará en segundo plano..."
npx react-native start --reset-cache &

# Esperar a que Metro esté listo
sleep 5

# 5. Verificar que Metro esté corriendo
echo "5️⃣ Verificando servidor Metro..."
if curl -s http://localhost:8081/status > /dev/null; then
    echo "✅ Servidor Metro está corriendo correctamente"
else
    echo "❌ Error: Servidor Metro no está respondiendo"
    exit 1
fi

# 6. Reinstalar y ejecutar app
echo "6️⃣ Reinstalando aplicación..."
cd android && ./gradlew clean && cd ..
npx react-native run-android

echo "✅ ¡Proceso completado!"
echo ""
echo "Si aún ves el error rojo, intenta:"
echo "1. Presiona 'R' dos veces en el emulador para recargar"
echo "2. O abre el menú Dev (agitar el dispositivo) y selecciona 'Reload'"
