# 🚀 Deploy Smart Building to Firebase

## Quick Deploy (One Command)

Run this from your terminal:

```bash
cd "/Users/kh/Desktop/NCQ co/ncq-platform-demo/smart-building"
./deploy.sh
```

## What This Will Do:

1. ✅ Install dependencies (if needed)
2. ✅ Build the Next.js app with 3D visualization
3. ✅ Deploy to Firebase project `ncq-sa`
4. ✅ Create a new hosting site `ncq-smart-building`

## Your App Will Be Available At:

- 🌐 **Main URL**: https://ncq-smart-building.web.app
- 🌐 **Alternative**: https://ncq-sa.web.app/smart-building

## Manual Steps (if needed):

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the app**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   firebase deploy --only hosting:smart-building
   ```

## Features Included:

- ✨ **3D Building Visualization** with Babylon.js
- 🏢 **5 Floors** with interactive rooms
- 📡 **IoT Device Visualization**
- 🎮 **Interactive Camera Controls**
- 📱 **Responsive Design**
- 🔄 **Real-time Updates** (using mock data)

## Troubleshooting:

- If you get a Firebase login error, run: `firebase login`
- If the build fails, check that all dependencies are installed
- The app uses mock data for demo purposes

## Success! 🎉

After deployment, open your browser and navigate to the URL to see your 3D smart building in action!