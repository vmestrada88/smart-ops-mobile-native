# Solución: Error "Unable to Load Script"

Este error ocurre cuando la aplicación React Native no puede conectarse al servidor Metro Bundler.

## 🔴 Síntomas
- Pantalla roja con el mensaje "Unable to load script"
- La app no puede cargar el bundle de JavaScript
- El emulador/dispositivo no se conecta al servidor Metro

## ✅ Soluciones Rápidas

### Solución 1: Port Forwarding (Más Común)
```bash
# Configurar el port forwarding del emulador
npm run adb:reverse

# O manualmente:
adb reverse tcp:8081 tcp:8081
```

### Solución 2: Recargar la App
```bash
# Abrir menú Dev en el emulador
npm run adb:reload

# Luego selecciona "Reload" desde el menú
# O presiona R dos veces en la terminal de Metro
```

### Solución 3: Reiniciar Metro con Caché Limpia
```bash
# Terminal 1: Iniciar Metro limpiando caché
npm run start:reset

# Terminal 2: Ejecutar la app
npm run android
```

### Solución 4: Limpieza Completa (Si nada funciona)
```bash
# Opción A: Usar script automático
npm run fix

# Opción B: Manual
# 1. Detener Metro (Ctrl+C en la terminal)
pkill -f "react-native"

# 2. Limpiar cachés
rm -rf android/app/build
rm -rf android/build
npm run start:reset

# 3. En otra terminal
npm run adb:reverse
npm run android
```

## 🔍 Verificar que Metro está corriendo

```bash
# Verificar el servidor Metro
curl http://localhost:8081/status

# Debería responder con: "packager-status:running"
```

## 📱 Scripts NPM Disponibles

```bash
npm run start          # Iniciar Metro normal
npm run start:reset    # Iniciar Metro limpiando caché
npm run android        # Ejecutar app en Android
npm run adb:reverse    # Configurar port forwarding
npm run adb:reload     # Abrir menú Dev
npm run clean          # Limpiar build de Android
npm run clean:all      # Limpieza completa (node_modules + builds)
npm run fix            # Script automático de solución
```

## 🛠️ Causas Comunes

1. **Metro no está corriendo**: Iniciar con `npm start`
2. **Port forwarding no configurado**: Ejecutar `adb reverse tcp:8081 tcp:8081`
3. **Caché corrupta**: Limpiar con `npm run start:reset`
4. **Builds antiguos**: Limpiar con `npm run clean`
5. **Emulador sin conexión a localhost**: Verificar configuración de red

## 🔧 Debugging Avanzado

### Verificar dispositivos conectados
```bash
adb devices
```

### Ver logs de la app
```bash
npx react-native log-android
```

### Verificar Metro está escuchando
```bash
lsof -i :8081
```

## 💡 Tips

- **Siempre** asegúrate de que Metro esté corriendo antes de ejecutar la app
- **Port forwarding** debe ejecutarse cada vez que reinicies el emulador
- Si usas dispositivo físico, asegúrate de que esté en la **misma red WiFi**
- Para dispositivo físico, agita el teléfono para abrir el menú Dev

## 🚀 Proceso Ideal de Desarrollo

```bash
# Terminal 1
npm run start:reset

# Esperar a que Metro esté listo (ver "Dev server ready")

# Terminal 2
npm run adb:reverse
npm run android

# Si hay cambios y no se reflejan
# En Terminal 1, presiona: r (reload)
```

## 📝 Notas Adicionales

- El servidor Metro debe estar corriendo en `http://localhost:8081`
- El emulador debe poder acceder a localhost mediante port forwarding
- Los cambios en el código deberían actualizarse automáticamente (Fast Refresh)
- Si Fast Refresh no funciona, presiona `r` en la terminal de Metro

## ⚠️ Problemas Conocidos

### Error: "Execution failed for task ':app:installDebug'"
```bash
npm run clean
npm run android
```

### Error: "Could not connect to development server"
```bash
npm run adb:reverse
# Verificar que Metro esté corriendo
curl http://localhost:8081/status
```

### Error: "Unable to resolve module"
```bash
npm run clean:all
npm run adb:reverse
npm run android
```
