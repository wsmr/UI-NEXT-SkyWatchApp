# Astronomy APIs Research

This document contains research on various astronomy APIs that can be used for the SkyWatchApp to provide daily reports of interesting astronomical events visible from a specific location.

## NASA APIs

### 1. APOD (Astronomy Picture of the Day)
- **Description**: Provides the astronomy picture of the day along with metadata and explanation
- **URL**: https://api.nasa.gov/
- **Authentication**: API key required (free)
- **Rate Limits**: 1,000 requests per hour with API key, 30 requests per hour with DEMO_KEY
- **Useful for**: Daily astronomy images and educational content
- **Documentation**: Available on GitHub repository

### 2. DONKI (Space Weather Database Of Notifications, Knowledge, Information)
- **Description**: Comprehensive database for space weather events including:
    - Coronal Mass Ejection (CME)
    - Geomagnetic Storms (GST) - useful for aurora forecasts
    - Solar Flares (FLR)
    - Solar Energetic Particles (SEP)
- **URL**: https://api.nasa.gov/DONKI/
- **Authentication**: API key required (free)
- **Rate Limits**: Same as APOD
- **Useful for**: Aurora borealis forecasts and space weather events
- **Endpoints**:
    - `/CME` - Coronal Mass Ejection data
    - `/GST` - Geomagnetic Storm data
    - `/FLR` - Solar Flare data
    - `/SEP` - Solar Energetic Particle data

### 3. Satellite Situation Center
- **Description**: System to cast geocentric spacecraft location information
- **URL**: https://api.nasa.gov/
- **Authentication**: API key required (free)
- **Rate Limits**: Same as APOD
- **Useful for**: Tracking satellites and spacecraft positions
- **Notes**: Operated by NASA/GSFC Space Physics Data Facility (SPDF)

### 4. TLE API
- **Description**: Two line element data for earth-orbiting objects at a given point in time
- **URL**: https://api.nasa.gov/
- **Authentication**: API key required (free)
- **Rate Limits**: Same as APOD
- **Useful for**: ISS and satellite tracking

## Timeanddate.com Astronomy API

- **Description**: Delivers astronomical events and positions for celestial objects
- **URL**: https://dev.timeanddate.com/astro/
- **Authentication**: API key required (paid with free trial)
- **Services**:
    - **Astro Position Service**: Position of celestial objects (altitude, azimuth, distance, illumination)
    - **Astro Event Service**: Celestial events (sunrise/sunset, moonrise/moonset, twilight, moon phases)
    - **Tide Service**: High and low tide information
- **Useful for**: Moon phases, planetary visibility, sun/moon rise and set times
- **Features**: Can query by location ID, coordinates, or IATA airport codes

## Moon-API.com

- **Description**: Professional Moon Phase & Lunar Data API
- **URL**: https://moon-api.com/
- **Authentication**: API key required (likely paid with free tier)
- **Features**:
    - Real-time moon phase calculations
    - Lunar transit timings
    - Zodiac sign positions
    - Moon rise and set predictions
    - Lunar illumination data
    - Location-based calculations
- **Useful for**: Detailed moon data and phases

## Aurora API (GitHub: evanchiu/aurora-api)

- **Description**: Structured data API on top of NOAA's Aurora Forecast
- **URL**: https://github.com/evanchiu/aurora-api
- **Authentication**: None mentioned
- **Features**: Provides structured data from NOAA's Aurora Forecast
- **Sample Data**:
  ```json
  {
    "issued": "2018-02-01T00:30:00.000Z",
    "breakdown": [
      {
        "start": "2018-02-01T00:00:00.000Z",
        "kp": "3"
      },
      {
        "start": "2018-02-02T00:00:00.000Z",
        "kp": "2"
      }
    ]
  }
  ```
- **Useful for**: Aurora borealis forecasts
- **Notes**: Can be deployed with CloudFormation on AWS

## Meteomatics API

- **Description**: Weather API with meteor shower visibility data
- **URL**: https://www.meteomatics.com/en/api/available-parameters/meteor-showers/
- **Authentication**: API key required (paid with free test account)
- **Features**:
    - Meteor Shower Visibility parameter
    - Index depends on active days of shower, peak date, moon light, cloud cover, land use, declination and elevation
- **Parameter Format**: `meteor_showers_<name>_visibility:idx`
- **Supported Meteor Showers**: geminids, perseids, quadrantids, eta_aquariids
- **Useful for**: Meteor shower visibility forecasts

## API Selection Recommendations

For the SkyWatchApp, we recommend using a combination of these APIs:

1. **NASA TLE API** - For ISS and satellite tracking
2. **Timeanddate.com Astronomy API** - For moon phases, planetary visibility, and celestial events
3. **Aurora API** - For aurora borealis forecasts
4. **Meteomatics API** - For meteor shower visibility
5. **NASA APOD** - For daily astronomy images and educational content

This combination will provide comprehensive coverage of all the required astronomical events for the application.
