# 🚀 SkyLux Airlines - Render Deployment Guide

This guide will help you deploy the SkyLux Airlines flight booking system to Render.com.

## 📋 Prerequisites

- GitHub repository: [https://github.com/Hammadali-185/skylux-flight-booking-system](https://github.com/Hammadali-185/skylux-flight-booking-system)
- Render.com account (free tier available)
- Node.js 16+ (for local testing)

## 🌐 Deployment Steps

### **Step 1: Backend Deployment**

1. **Login to Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `skylux-flight-booking-system`

3. **Configure Backend Service**
   ```
   Name: skylux-backend
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://skylux-frontend.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note the URL: `https://skylux-backend.onrender.com`

### **Step 2: Frontend Deployment**

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select `skylux-flight-booking-system`

2. **Configure Frontend Service**
   ```
   Name: skylux-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://skylux-backend.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (5-10 minutes)
   - Note the URL: `https://skylux-frontend.onrender.com`

## 🔧 Configuration Files

### **render.yaml** (Already included)
```yaml
services:
  - type: web
    name: skylux-backend
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CORS_ORIGIN
        value: https://skylux-frontend.onrender.com

  - type: web
    name: skylux-frontend
    env: static
    plan: free
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
    envVars:
      - key: REACT_APP_API_URL
        value: https://skylux-backend.onrender.com
```

### **package.json** (Root)
```json
{
  "name": "skylux-flight-booking-system",
  "scripts": {
    "start": "cd backend && npm start",
    "build": "cd frontend && npm run build",
    "heroku-postbuild": "npm run install-all && npm run build"
  }
}
```

## 🌍 Live URLs

After successful deployment:

- **Frontend**: [https://skylux-frontend.onrender.com](https://skylux-frontend.onrender.com)
- **Backend API**: [https://skylux-backend.onrender.com](https://skylux-backend.onrender.com)

## 🔍 Testing Deployment

### **Backend API Test**
```bash
curl https://skylux-backend.onrender.com/api/health
```

### **Frontend Test**
1. Visit [https://skylux-frontend.onrender.com](https://skylux-frontend.onrender.com)
2. Test flight search functionality
3. Verify all pages load correctly

## 🛠️ Troubleshooting

### **Common Issues**

1. **Build Failures**
   - Check Node.js version (16+)
   - Verify all dependencies in package.json
   - Check build logs in Render dashboard

2. **CORS Errors**
   - Ensure CORS_ORIGIN matches frontend URL
   - Check backend environment variables

3. **API Connection Issues**
   - Verify REACT_APP_API_URL in frontend
   - Check backend deployment status
   - Test API endpoints directly

4. **Static Site Issues**
   - Verify build command and publish directory
   - Check for build errors in logs
   - Ensure all assets are included

### **Debug Commands**

```bash
# Test backend locally
cd backend && npm start

# Test frontend locally
cd frontend && npm start

# Check build output
cd frontend && npm run build
```

## 📊 Performance Optimization

### **Render Free Tier Limits**
- 750 hours/month per service
- Services sleep after 15 minutes of inactivity
- Cold start time: 30-60 seconds

### **Optimization Tips**
1. **Enable Auto-Deploy**: Automatic deployments on git push
2. **Monitor Usage**: Check Render dashboard for usage stats
3. **Optimize Images**: Compress images for faster loading
4. **Code Splitting**: Use React.lazy() for better performance

## 🔄 Updates and Maintenance

### **Deploying Updates**
1. Push changes to GitHub main branch
2. Render automatically detects changes
3. Services redeploy automatically
4. Monitor deployment logs

### **Environment Variables**
- Update in Render dashboard
- No code changes needed
- Services restart automatically

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: [github.com/Hammadali-185/skylux-flight-booking-system/issues](https://github.com/Hammadali-185/skylux-flight-booking-system/issues)
- **Project README**: [README.md](README.md)

---

## ✅ Deployment Checklist

- [ ] GitHub repository connected
- [ ] Backend service created and deployed
- [ ] Frontend static site created and deployed
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] API endpoints tested
- [ ] Frontend functionality verified
- [ ] Performance monitoring enabled

**🎉 Your SkyLux Airlines application is now live on Render!**
