'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const ProcessStep = ({ number, title, description, points }: { 
  number: string; 
  title: string; 
  description: string;
  points: string[];
}) => (
  <div className="relative flex gap-6 pb-12 last:pb-0">
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
        {number}
      </div>
      <div className="flex-1 w-px bg-border mt-4 last:hidden"></div>
    </div>
    <div className="flex-1 space-y-3 pt-1.5">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <ul className="space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Metric = ({ title, value, description }: { 
  title: string; 
  value: string; 
  description: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const CaseStudy = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-screen-xl py-12">
        {/* Header */}
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter">
            Air Quality Index Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            A Product Management Case Study by Manav
          </p>
          <div className="mt-8 max-w-[800px] mx-auto text-left bg-muted/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Problem Statement</h3>
            <p className="text-muted-foreground">
              At 9:55 PM on December 27th, I was thinking about checking the air quality index for my parents. 
              This concern led me to develop a prototype within 16 hours, completing it at 1:55 PM on December 28th. 
              The goal was to create a tool that would help people easily check and compare AQI levels across different cities, 
              making air quality information more accessible and actionable for everyone.
            </p>
          </div>
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
        </div>

        {/* Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <p>
              Built a real-time Air Quality Index monitoring platform in just 16 hours, 
              driven by a personal need to check air quality for family members. The project 
              evolved from a simple AQI checker into a comprehensive tool that helps anyone 
              monitor and compare air quality across Indian cities.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Metric 
                title="Development Time"
                value="16 Hours"
                description="From concept to launch"
              />
              <Metric 
                title="Cities Covered"
                value="50+"
                description="Major metropolitan areas"
              />
              <Metric 
                title="Data Points"
                value="6"
                description="Key pollutants monitored"
              />
              <Metric 
                title="Forecast Range"
                value="5 Days"
                description="Predictive insights"
              />
            </div>
          </CardContent>
        </Card>

        {/* Process Timeline */}
        <div className="space-y-12 mb-12">
          <h2 className="text-2xl font-bold tracking-tight">Product Development Process</h2>
          
          <ProcessStep 
            number="1"
            title="Initial Setup"
            description="Quick setup of development environment and core technologies."
            points={[
              "Set up Next.js with TypeScript and Tailwind CSS",
              "Configured WAQI API integration",
              "Implemented basic project structure",
              "Set up version control and development workflow"
            ]}
          />

          <ProcessStep 
            number="2"
            title="Core Features"
            description="Focused on essential features for checking air quality data."
            points={[
              "Built city search functionality",
              "Integrated real-time AQI data fetching",
              "Added geolocation support",
              "Implemented error handling and loading states"
            ]}
          />

          <ProcessStep 
            number="3"
            title="Data Visualization"
            description="Added visual elements to make data more understandable."
            points={[
              "Created interactive India metro map",
              "Built AQI charts and trends display",
              "Added forecast visualization",
              "Implemented city comparison view"
            ]}
          />

          <ProcessStep 
            number="4"
            title="Polish & Launch"
            description="Final touches and optimizations before release."
            points={[
              "Added responsive design for all devices",
              "Optimized performance and load times",
              "Improved error messages and user feedback",
              "Deployed and tested final version"
            ]}
          />
        </div>

        {/* Key Features */}
        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold tracking-tight">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-Time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Live tracking of air quality metrics across multiple cities with 
                  instant updates and notifications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">City Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Side-by-side analysis of air quality metrics between different 
                  cities for informed decision making.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Forecast Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  5-day air quality forecasts enabling proactive planning and 
                  health protection measures.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interactive Map</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visual representation of air quality data with state-wise 
                  filtering and geographic insights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intuitive charts and graphs presenting complex data in 
                  easily digestible formats.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile Responsive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fully responsive design ensuring seamless experience across 
                  all devices and screen sizes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills & Tools */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Skills Demonstrated</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Rapid Development</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Next.js & React</li>
                  <li>Tailwind CSS</li>
                  <li>TypeScript</li>
                  <li>Responsive Design</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">API Integration</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>WAQI API Integration</li>
                  <li>Geolocation Services</li>
                  <li>Real-time Data Fetching</li>
                  <li>Error Handling</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Data Visualization</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Interactive Maps</li>
                  <li>AQI Charts & Trends</li>
                  <li>City Comparison Tools</li>
                  <li>Forecast Display</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CaseStudy;
