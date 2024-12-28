# Air Quality Index Dashboard 🌤️

A real-time Air Quality Index monitoring platform for Indian cities, built in 16 hours using Next.js, TypeScript, and Tailwind CSS. This project was developed with the assistance of Claude AI and Cline, showcasing the potential of AI-assisted rapid development.

## 🌟 Motivation

At 9:55 PM on December 27th, I wanted to check the air quality for my parents' location in India. Instead of using existing fragmented solutions, I decided to build a comprehensive tool that would make air quality information more accessible and actionable for everyone. By 1:55 PM the next day, this project was complete.

## ✨ Features

- **Real-Time Monitoring**: Live tracking of air quality metrics across multiple cities
- **City Comparison**: Side-by-side analysis of AQI metrics between different cities
- **Interactive Map**: Visual representation of air quality data with state-wise filtering
- **Forecast Predictions**: 5-day air quality forecasts for proactive planning
- **Data Visualization**: Intuitive charts and graphs for easy understanding
- **Mobile Responsive**: Seamless experience across all devices
- **Geolocation Support**: Quick access to local air quality data
- **Error Handling**: Robust error management and user feedback

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [WAQI API](https://waqi.info/) - Air quality data
- Claude AI & Cline - Development assistance

## 🚀 Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/aqi-dashboard.git
   ```

2. Install dependencies:

   ```bash
   cd aqi-dashboard
   npm install
   ```

3. Create a `.env.local` file and add your WAQI API key:

   ```env
   NEXT_PUBLIC_AQI_API_TOKEN=your_api_key_here
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🌐 API Integration

The project uses the World Air Quality Index (WAQI) API to fetch real-time air quality data. You'll need to:

1. Get an API token from [WAQI](https://aqicn.org/api/)
2. Add it to your `.env.local` file

## 📱 Features in Detail

### Real-Time Monitoring

- Live AQI data for all major Indian metropolitan areas
- Automatic updates and notifications
- Support for 6 key pollutants

### Interactive Map

- State-wise filtering capabilities
- Geographic insights
- Location-based search

### City Comparison

- Compare up to 5 cities simultaneously
- Side-by-side metric analysis
- Historical data comparison

### Forecast Display

- 5-day AQI predictions
- Trend analysis
- Pollutant-specific forecasts

## 🤖 AI-Assisted Development

This project showcases the potential of AI-assisted development:

- Used Claude AI for code generation and problem-solving
- Leveraged Cline for rapid prototyping and development
- Completed the entire project in just 16 hours

## 📈 Development Timeline

1. **Initial Setup** (Hours 1-4)

   - Project scaffolding with Next.js
   - API integration setup
   - Basic project structure

2. **Core Features** (Hours 5-8)

   - City search functionality
   - Real-time data fetching
   - Geolocation support

3. **Data Visualization** (Hours 9-12)

   - Interactive map implementation
   - Charts and trends
   - Forecast display

4. **Polish & Launch** (Hours 13-16)
   - Responsive design
   - Performance optimization
   - Final testing and deployment

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [World Air Quality Index](https://waqi.info/) for providing the API
- Claude AI and Cline for development assistance
- The Next.js and React communities for excellent documentation
