# 🚀 Deploy ALL NCQ Applications to Firebase

## One Command Deployment

Run this single command to deploy EVERYTHING:

```bash
cd "/Users/kh/Desktop/NCQ pure FE"
./DEPLOY-EVERYTHING.sh
```

## What This Will Deploy:

### 1. **Core Platforms**
- ✅ User Portal
- ✅ Admin Dashboard
- ✅ Landing Page

### 2. **Healthcare Solutions**
- ✅ Hospital Management System
- ✅ Smart Hospitality
- ✅ Hospitality Staff Portal

### 3. **Technology Platforms**
- ✅ IoT Platform
- ✅ API Portal
- ✅ LLM Platform (AI)
- ✅ **Smart Building with 3D Visualization** 🏢

### 4. **Payment Solutions**
- ✅ Payment Gateway
- ✅ Payment Admin Portal
- ✅ Payment Merchant Portal

## Live URLs After Deployment:

- 🌐 **User Portal**: https://ncq-sa.web.app
- 👨‍💼 **Admin Dashboard**: https://ncq-admin.web.app
- 🏥 **Hospital Management**: https://ncq-hospital.web.app
- 🏢 **Smart Building (3D)**: https://ncq-smart-building.web.app
- 🔌 **API Portal**: https://ncq-api-portal.web.app
- 📡 **IoT Platform**: https://ncq-iot.web.app
- 🤖 **LLM Platform**: https://ncq-llm.web.app
- 💳 **Payment Gateway**: https://ncq-payment.web.app
- 💰 **Payment Admin**: https://ncq-payment-admin.web.app
- 🏪 **Payment Merchant**: https://ncq-payment-merchant.web.app
- 👥 **Hospitality Staff**: https://ncq-hospitality-staff.web.app
- 🏨 **Smart Hospitality**: https://ncq-hospitality.web.app
- 🏠 **Landing Page**: https://ncq-landing.web.app

## What the Script Does:

1. **Checks Prerequisites** - Firebase CLI, Node.js
2. **Creates Hosting Sites** - Sets up all 13 hosting sites
3. **Builds All Apps** - Compiles each application
4. **Deploys Everything** - Uploads to Firebase

## Time Required:

⏱️ **Approximately 15-20 minutes** (depending on internet speed)

## Prerequisites:

- Node.js installed
- Firebase CLI (will be installed if missing)
- Internet connection

## Troubleshooting:

If you get any errors:

1. **Login Error**: Run `firebase login`
2. **Build Error**: Check individual app's `package.json`
3. **Permission Error**: Make sure you have access to `ncq-sa` project

## Success! 🎉

After deployment, all your NCQ applications will be live on Firebase with:
- SSL certificates
- Global CDN
- Automatic scaling
- Real-time metrics

Visit the [Firebase Console](https://console.firebase.google.com/project/ncq-sa/hosting/sites) to manage your deployments.