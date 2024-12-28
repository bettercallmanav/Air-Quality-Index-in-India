'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
            A Product Management Case Study by Manav
          </p>
          <a 
            href="https://www.linkedin.com/in/bettercallmanav/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            Connect on LinkedIn
          </a>
        </div>

        {/* Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <p>
              Led the development of a comprehensive Air Quality Index monitoring platform 
              for India, transforming complex environmental data into actionable insights 
              for users, policy makers, and stakeholders.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Metric 
                title="Development Time"
                value="12 Weeks"
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
            title="Problem Discovery"
            description="Conducted extensive research to understand user needs and market gaps in air quality monitoring."
            points={[
              "Identified lack of accessible real-time air quality data",
              "Found fragmentation in existing solutions",
              "Discovered need for comparative analysis tools",
              "Recognized importance of location-based insights"
            ]}
          />

          <ProcessStep 
            number="2"
            title="Solution Design"
            description="Developed comprehensive solution architecture addressing key user needs."
            points={[
              "Created interactive map visualization system",
              "Designed intuitive comparison tools",
              "Integrated forecast capabilities",
              "Implemented responsive mobile-first design"
            ]}
          />

          <ProcessStep 
            number="3"
            title="Technical Implementation"
            description="Led cross-functional team in building robust technical infrastructure."
            points={[
              "Integrated WAQI API for real-time data",
              "Implemented geolocation services",
              "Built caching system for performance",
              "Developed progressive web capabilities"
            ]}
          />

          <ProcessStep 
            number="4"
            title="Impact & Results"
            description="Delivered significant value through comprehensive feature set."
            points={[
              "Comprehensive coverage of metropolitan areas",
              "Real-time monitoring of key pollutants",
              "5-day forecast predictions",
              "Sub-60 second data refresh rate"
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
                <h3 className="font-semibold mb-2">Product Strategy</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Market Analysis</li>
                  <li>Feature Prioritization</li>
                  <li>Product Roadmap</li>
                  <li>User Journey Mapping</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Technical Leadership</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>API Integration</li>
                  <li>Performance Optimization</li>
                  <li>Architecture Design</li>
                  <li>Technical Documentation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Data Analytics</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Data Visualization</li>
                  <li>Metrics Definition</li>
                  <li>Performance Tracking</li>
                  <li>Insight Generation</li>
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
