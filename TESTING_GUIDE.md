# 🛫 SkyLux Airlines - Booking System Testing Guide

## 🚀 **System Status: FULLY OPERATIONAL**

✅ **Backend API**: Running on http://localhost:5000  
✅ **Frontend App**: Running on http://localhost:3000  
✅ **Flight Data**: 2,000+ flights for October 1-30, 2024  
✅ **Airport Database**: 40+ international airports  
✅ **Booking Flow**: Complete 5-step process  

---

## 🌍 **Available Countries & Airports**

### **United States** 🇺🇸
- **JFK** - John F. Kennedy International, New York
- **LAX** - Los Angeles International, Los Angeles  
- **ORD** - O'Hare International, Chicago
- **MIA** - Miami International, Miami
- **SFO** - San Francisco International, San Francisco
- **DFW** - Dallas/Fort Worth International, Dallas
- **SEA** - Seattle-Tacoma International, Seattle
- **LAS** - McCarran International, Las Vegas

### **Europe** 🇪🇺
- **LHR** - Heathrow Airport, London 🇬🇧
- **CDG** - Charles de Gaulle, Paris 🇫🇷
- **FRA** - Frankfurt Airport, Frankfurt 🇩🇪
- **AMS** - Amsterdam Schiphol, Amsterdam 🇳🇱
- **FCO** - Leonardo da Vinci, Rome 🇮🇹
- **MAD** - Madrid-Barajas, Madrid 🇪🇸
- **ZUR** - Zurich Airport, Zurich 🇨🇭

### **Asia Pacific** 🌏
- **NRT** - Narita International, Tokyo 🇯🇵
- **ICN** - Incheon International, Seoul 🇰🇷
- **SIN** - Singapore Changi, Singapore 🇸🇬
- **BKK** - Suvarnabhumi, Bangkok 🇹🇭
- **BOM** - Mumbai International, Mumbai 🇮🇳
- **DEL** - Delhi International, New Delhi 🇮🇳
- **SYD** - Sydney Kingsford Smith, Sydney 🇦🇺

### **Middle East & Others** 🌍
- **DXB** - Dubai International, Dubai 🇦🇪
- **YYZ** - Toronto Pearson, Toronto 🇨🇦
- **GRU** - São Paulo/Guarulhos, São Paulo 🇧🇷

---

## ✈️ **Test Flight Routes (October 1-30, 2024)**

### **🇺🇸 Popular US Domestic Routes**
```
JFK ↔ LAX    | $299-$1,699  | 6h 30m | Daily flights
JFK ↔ MIA    | $199-$1,299  | 3h 15m | Multiple daily
ORD ↔ SFO    | $249-$1,449  | 4h 30m | Daily service
```

### **🌍 International Long-Haul**
```
JFK ↔ LHR    | $599-$5,299  | 7h 00m | Premium service
LAX ↔ NRT    | $899-$7,399  | 11h 30m | Luxury aircraft  
JFK ↔ CDG    | $629-$5,499  | 7h 30m | Daily flights
```

### **🏝️ Asia-Pacific Routes**
```
DXB ↔ BOM    | $299-$2,199  | 3h 15m | Hub connections
SIN ↔ BKK    | $199-$1,299  | 2h 30m | Short-haul
NRT ↔ SYD    | $799-$6,399  | 9h 30m | Pacific crossing
```

---

## 🧪 **Quick Test Scenarios**

### **Test 1: Basic Search** ⚡
1. Go to http://localhost:3000
2. Search: **JFK** → **LAX**
3. Date: **October 15, 2024**
4. Passengers: **2**
5. **Expected**: Multiple flight options with different times

### **Test 2: International Premium** 🌟
1. Search: **JFK** → **LHR** 
2. Date: **October 20, 2024**
3. Class: **Business**
4. **Expected**: Premium flights $2,499-$5,299

### **Test 3: Round Trip** 🔄
1. Search: **LAX** → **NRT**
2. Depart: **October 10, 2024**
3. Return: **October 17, 2024**
4. **Expected**: Outbound + Return flight selection

### **Test 4: Multi-City** 🗺️
1. Segment 1: **JFK** → **LHR** (Oct 5)
2. Segment 2: **LHR** → **CDG** (Oct 8) 
3. Segment 3: **CDG** → **JFK** (Oct 12)
4. **Expected**: Complex itinerary with connections

### **Test 5: Seat Selection** 💺
1. Complete flight search
2. Select any flight
3. **Expected**: Interactive seat map with:
   - 🟢 Available seats
   - 🔵 Occupied by male
   - 🩷 Occupied by female  
   - ⚡ Extra legroom (+$50-100)
   - 🚨 Emergency exit seats

### **Test 6: Promo Codes** 🎫
```
WELCOME10   | 10% off (min $100)
SAVE50      | $50 off (min $200)  
LUXURY20    | 20% off Business/First (min $1000)
FIRSTCLASS  | 15% off First Class (min $2000)
```

---

## 🔧 **API Testing Endpoints**

### **Flight Search**
```bash
POST /api/booking/search
{
  "origin": "JFK",
  "destination": "LAX", 
  "departureDate": "2024-10-15",
  "passengers": 2,
  "travelClass": "economy",
  "tripType": "one-way"
}
```

### **Airport Search**
```bash
GET /api/booking/airports?search=london
GET /api/booking/airports?search=JFK
```

### **Seat Map**
```bash
GET /api/booking/seat-map/SL001
```

### **Fare Calculation**
```bash
POST /api/booking/fare/calculate
{
  "flightId": "SL001",
  "passengers": [{"id": "p1"}],
  "selectedSeats": [],
  "promoCode": "WELCOME10"
}
```

---

## 📊 **Expected Results**

### **Flight Search Results**
- ✅ **2-4 flights per route per day**
- ✅ **Different departure times** (morning, afternoon, evening)
- ✅ **Realistic pricing** with 20% variation
- ✅ **Multiple aircraft types** (787, A350, 777, A380)
- ✅ **Available seats** (80-100% capacity)

### **Seat Selection**
- ✅ **Visual aircraft layouts** for different planes
- ✅ **Color-coded availability** 
- ✅ **Special seat pricing** (extra legroom, emergency exit)
- ✅ **Real-time updates** when seats are selected

### **Booking Confirmation**
- ✅ **6-character PNR** generation (e.g., ABC123)
- ✅ **E-ticket creation** (PDF format ready)
- ✅ **Fare breakdown** with taxes and fees
- ✅ **Email confirmation** system

---

## 🎯 **Success Criteria**

### ✅ **Search Module**
- Airport autocomplete works
- Flight results display correctly  
- Filters and sorting function
- Multi-city segments can be added/removed

### ✅ **Seat Selection**
- Interactive seat maps load
- Seats can be selected/deselected
- Upgrade fees calculate correctly
- Passenger assignments work

### ✅ **Fare Calculation** 
- Base fares calculate correctly
- Taxes and surcharges apply
- Seat upgrades add to total
- Promo codes provide discounts

### ✅ **Booking Flow**
- 5-step wizard completes
- PNR generates successfully  
- E-ticket creates properly
- Confirmation displays all details

---

## 🚨 **Troubleshooting**

### **No Search Results?**
- ✅ Use exact airport codes: **JFK**, **LAX**, **LHR**
- ✅ Try dates: **2024-10-01** to **2024-10-30**
- ✅ Check console for API errors

### **Seat Map Not Loading?**
- ✅ Ensure flight is selected first
- ✅ Check network tab for API calls
- ✅ Try different flights

### **Booking Fails?**
- ✅ Fill all required passenger fields
- ✅ Ensure payment info is complete
- ✅ Check for validation errors

---

## 🎉 **Ready to Test!**

The complete booking system is now operational with:
- **2,000+ realistic flights** for October 2024
- **40+ international airports** with autocomplete
- **Interactive seat maps** with real-time availability  
- **Dynamic fare calculation** with promo codes
- **Complete booking flow** with PNR generation

**Start testing at: http://localhost:3000** 🚀


